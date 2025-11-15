-- =====================================================
-- Avatar Storage Setup Migration
-- =====================================================
-- This migration sets up the storage bucket and policies
-- for user avatar uploads in the Profile feature
-- =====================================================

-- 1. Create avatars bucket (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- 2. Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Allow authenticated users to upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update/delete own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update own avatars" ON storage.objects;

-- 4. Create policy: Allow authenticated users to upload avatars
CREATE POLICY "Allow authenticated users to upload avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = 'avatars'
);

-- 5. Create policy: Allow users to update their own avatars
CREATE POLICY "Allow users to update own avatars"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  owner = auth.uid()
)
WITH CHECK (
  bucket_id = 'avatars' AND
  owner = auth.uid()
);

-- 6. Create policy: Allow users to delete their own avatars
CREATE POLICY "Allow users to update/delete own avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  owner = auth.uid()
);

-- 7. Create policy: Public read access for all avatars
CREATE POLICY "Public read access for avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- =====================================================
-- Verification Queries (Optional - for testing)
-- =====================================================

-- Check if bucket exists
-- SELECT * FROM storage.buckets WHERE id = 'avatars';

-- Check policies
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- =====================================================
-- Rollback (if needed)
-- =====================================================

-- To rollback this migration, run:
-- DROP POLICY IF EXISTS "Allow authenticated users to upload avatars" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow users to update own avatars" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow users to update/delete own avatars" ON storage.objects;
-- DROP POLICY IF EXISTS "Public read access for avatars" ON storage.objects;
-- DELETE FROM storage.buckets WHERE id = 'avatars';
