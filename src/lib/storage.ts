import { getSupabaseClient, isSupabaseConfigured } from './supabase';
import { calculateExpiry, generateLongToken } from './utils';
import type { ExpiryDuration } from './utils';

export interface ImageRecord {
  id: string;
  token: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  storage_path?: string | null;
  public_url: string;
  duration: ExpiryDuration;
  created_at: string;
  expires_at: string;
}

// Simple IndexedDB helper for Local / Demo Fallback Mode
const DB_NAME = 'ImgURL_LocalDB';
const STORE_NAME = 'images';

function openLocalDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'token' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveToLocalDB(record: ImageRecord): Promise<void> {
  try {
    const db = await openLocalDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to save to local IndexedDB:', err);
  }
}

async function getFromLocalDB(token: string): Promise<ImageRecord | null> {
  try {
    const db = await openLocalDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(token);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to get from local IndexedDB:', err);
    return null;
  }
}

/**
 * Mengunggah gambar ke Supabase Storage + Database
 * (atau ke Local IndexedDB jika Supabase belum dikonfigurasi)
 */
export async function uploadImage(
  file: File,
  duration: ExpiryDuration
): Promise<{ record: ImageRecord; isDemo: boolean; error?: string }> {
  const token = generateLongToken();
  const { expiresAt } = calculateExpiry(duration);
  const now = new Date();

  const supabase = getSupabaseClient();
  const isDemo = !isSupabaseConfigured() || !supabase;

  if (isDemo || !supabase) {
    // Demo Mode: Convert File to base64 Data URL and store in IndexedDB
    const base64Url = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });

    const record: ImageRecord = {
      id: crypto.randomUUID ? crypto.randomUUID() : 'local_' + Date.now(),
      token,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
      storage_path: null,
      public_url: base64Url,
      duration,
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
    };

    await saveToLocalDB(record);
    saveRecentUpload(record);
    return { record, isDemo: true };
  }

  // Supabase Mode
  try {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${token}_${cleanFileName}`;

    // 1. Upload to Supabase Storage Bucket 'images'
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      throw new Error(`Gagal mengunggah file ke Supabase Storage: ${uploadError.message}`);
    }

    // 2. Dapatkan Public URL dari Storage
    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(storagePath);

    const publicUrl = publicUrlData.publicUrl;

    // 3. Masukkan record ke database 'images'
    const { data: dbData, error: dbError } = await supabase
      .from('images')
      .insert([
        {
          token,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          storage_path: storagePath,
          public_url: publicUrl,
          duration,
          created_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Supabase DB error:', dbError);
      throw new Error(`Gagal menyimpan data ke Supabase: ${dbError.message}`);
    }

    const record: ImageRecord = {
      id: dbData.id,
      token: dbData.token,
      file_name: dbData.file_name,
      file_size: dbData.file_size,
      mime_type: dbData.mime_type,
      storage_path: dbData.storage_path,
      public_url: dbData.public_url,
      duration: dbData.duration as ExpiryDuration,
      created_at: dbData.created_at,
      expires_at: dbData.expires_at,
    };

    saveRecentUpload(record);
    return { record, isDemo: false };
  } catch (err: any) {
    console.error('Upload error in Supabase mode:', err);
    throw err;
  }
}

/**
 * Mengambil informasi gambar berdasarkan Token URL Panjang
 * Memeriksa apakah link masih berlaku atau sudah expired
 */
export async function fetchImageByToken(token: string): Promise<{
  image: ImageRecord | null;
  isExpired: boolean;
  status: 'valid' | 'expired' | 'not_found';
  error?: string;
}> {
  const supabase = getSupabaseClient();

  let record: ImageRecord | null = null;

  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('token', token)
        .maybeSingle();

      if (!error && data) {
        record = {
          id: data.id,
          token: data.token,
          file_name: data.file_name,
          file_size: data.file_size,
          mime_type: data.mime_type,
          storage_path: data.storage_path,
          public_url: data.public_url,
          duration: data.duration as ExpiryDuration,
          created_at: data.created_at,
          expires_at: data.expires_at,
        };
      }
    } catch (err) {
      console.warn('Error fetching from Supabase, checking local DB fallback:', err);
    }
  }

  // Fallback to local IndexedDB if not found in Supabase
  if (!record) {
    record = await getFromLocalDB(token);
  }

  if (!record) {
    return { image: null, isExpired: false, status: 'not_found' };
  }

  // Check Expiration
  const now = Date.now();
  const expiryTime = new Date(record.expires_at).getTime();

  if (expiryTime <= now) {
    return { image: record, isExpired: true, status: 'expired' };
  }

  return { image: record, isExpired: false, status: 'valid' };
}

// Local storage helper for keeping track of recent uploads in the browser session
const RECENT_UPLOADS_KEY = 'imgurl_recent_uploads';

export function saveRecentUpload(record: ImageRecord) {
  try {
    const raw = localStorage.getItem(RECENT_UPLOADS_KEY);
    const list: ImageRecord[] = raw ? JSON.parse(raw) : [];
    // Filter out same token
    const filtered = list.filter(item => item.token !== record.token);
    // Don't save large base64 in localStorage list to prevent quota error
    const shallowCopy = {
      ...record,
      public_url: record.public_url.startsWith('data:') ? 'local_cached' : record.public_url,
    };
    filtered.unshift(shallowCopy);
    localStorage.setItem(RECENT_UPLOADS_KEY, JSON.stringify(filtered.slice(0, 10)));
  } catch (e) {
    console.warn('Could not save recent upload to localStorage', e);
  }
}

export function getRecentUploads(): ImageRecord[] {
  try {
    const raw = localStorage.getItem(RECENT_UPLOADS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
