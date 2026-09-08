-- =========================================================
-- SQL SCHEMA FOR IMAGE TO URL (ImgURL) - DEVELOPED BY DIMAS
-- =========================================================


-- 1. Buat tabel 'images' untuk menyimpan data & masa kedaluwarsa link
CREATE TABLE IF NOT EXISTS public.images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  storage_path TEXT,
  public_url TEXT NOT NULL,
  duration TEXT NOT NULL DEFAULT '1_day',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL
);

-- Buat Index untuk pencarian cepat berdasarkan token unik dan pengecekan kedaluwarsa
CREATE INDEX IF NOT EXISTS idx_images_token ON public.images (token);
CREATE INDEX IF NOT EXISTS idx_images_expires_at ON public.images (expires_at);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

-- Izinkan publik untuk membaca/mengakses metadata gambar
CREATE POLICY "Allow public read access"
  ON public.images
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Izinkan publik untuk mengunggah metadata gambar
CREATE POLICY "Allow public insert access"
  ON public.images
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 3. Konfigurasi Supabase Storage (Bucket 'images')
-- Catatan: Jika bucket belum ada di dashboard Supabase Storage, buat bucket baru dengan nama 'images' dan centang 'Public bucket'.
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Kebijakan akses Storage: Membaca file gambar
CREATE POLICY "Public Access for Images Bucket"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'images');

-- Kebijakan akses Storage: Mengunggah gambar
CREATE POLICY "Public Upload for Images Bucket"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'images');
