import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_URL = 'imgurl_supabase_url';
const STORAGE_KEY_KEY = 'imgurl_supabase_key';

export function getStoredSupabaseConfig(): { url: string; anonKey: string } {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const localUrl = localStorage.getItem(STORAGE_KEY_URL) || '';
  const localKey = localStorage.getItem(STORAGE_KEY_KEY) || '';

  return {
    url: (localUrl || envUrl).trim(),
    anonKey: (localKey || envKey).trim(),
  };
}

export function saveSupabaseConfig(url: string, anonKey: string) {
  localStorage.setItem(STORAGE_KEY_URL, url.trim());
  localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
  _supabaseClient = null; // Reset cached client
}

export function clearSupabaseConfig() {
  localStorage.removeItem(STORAGE_KEY_URL);
  localStorage.removeItem(STORAGE_KEY_KEY);
  _supabaseClient = null;
}

let _supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (_supabaseClient) return _supabaseClient;

  const { url, anonKey } = getStoredSupabaseConfig();

  if (url && anonKey && url.startsWith('http')) {
    try {
      _supabaseClient = createClient(url, anonKey);
      return _supabaseClient;
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return null;
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getStoredSupabaseConfig();
  return Boolean(url && anonKey && url.startsWith('http'));
}

export async function testSupabaseConnection(url: string, anonKey: string): Promise<{ success: boolean; message: string }> {
  try {
    const client = createClient(url, anonKey);
    // Simple query to verify connection
    const { error } = await client.from('images').select('count', { count: 'exact', head: true });
    if (error) {
      if (error.code === '42P01') {
        return { 
          success: true, 
          message: 'Koneksi ke Supabase berhasil! Namun tabel "images" belum dibuat. Jalankan skrip SQL terlebih dahulu.' 
        };
      }
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Koneksi ke Supabase berhasil & tabel "images" siap digunakan!' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Gagal menghubungi server Supabase' };
  }
}
