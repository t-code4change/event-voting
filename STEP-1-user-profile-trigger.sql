-- =============================================
-- STEP 1: CREATE USER PROFILE TRIGGER ONLY
-- Tạo user profile trong public.users khi register
-- =============================================

-- =============================================
-- CLEAN UP OLD STUFF
-- =============================================

DO $$ BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '================================================';
  RAISE NOTICE 'STEP 1: CLEANING UP OLD TRIGGERS & FUNCTIONS';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';
END $$;

-- Drop all old triggers on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created_first_event ON auth.users CASCADE;

-- Drop all old functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user_subscription() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user_first_event() CASCADE;
DROP FUNCTION IF EXISTS public.generate_event_code() CASCADE;

DO $$ BEGIN
  RAISE NOTICE '✅ Cleaned up all old triggers and functions';
  RAISE NOTICE '';
END $$;

-- =============================================
-- CREATE USERS TABLE (if not exists)
-- =============================================

DO $$ BEGIN
  RAISE NOTICE '================================================';
  RAISE NOTICE 'STEP 2: ENSURE USERS TABLE EXISTS';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';
END $$;

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY,  -- Same as auth.users.id
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

DO $$ BEGIN
  RAISE NOTICE '✅ Users table ready';
  RAISE NOTICE '';
END $$;

-- =============================================
-- CREATE TRIGGER FUNCTION: handle_new_user
-- =============================================

DO $$ BEGIN
  RAISE NOTICE '================================================';
  RAISE NOTICE 'STEP 3: CREATING TRIGGER FUNCTION';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';
END $$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert user profile into public.users
  INSERT INTO public.users (
    id,
    email,
    full_name,
    role,
    is_active
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    'user',
    true
  );

  RAISE NOTICE '[TRIGGER] Created user profile for: %', NEW.email;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING '[TRIGGER] Failed to create user profile for %: %', NEW.email, SQLERRM;
    -- Don't block user creation, just log the error
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.handle_new_user IS 'Trigger function to create user profile in public.users when auth user is created';

DO $$ BEGIN
  RAISE NOTICE '✅ Function handle_new_user() created';
  RAISE NOTICE '';
END $$;

-- =============================================
-- CREATE TRIGGER ON auth.users
-- =============================================

DO $$ BEGIN
  RAISE NOTICE '================================================';
  RAISE NOTICE 'STEP 4: CREATING TRIGGER ON auth.users';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';
END $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

DO $$ BEGIN
  RAISE NOTICE '✅ Trigger on_auth_user_created installed';
  RAISE NOTICE '';
END $$;

-- =============================================
-- VERIFICATION
-- =============================================

DO $$ BEGIN
  RAISE NOTICE '================================================';
  RAISE NOTICE 'STEP 5: VERIFICATION';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';
END $$;

-- Check if function exists
DO $$
DECLARE
  func_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.routines
    WHERE routine_schema = 'public'
    AND routine_name = 'handle_new_user'
  ) INTO func_exists;

  IF func_exists THEN
    RAISE NOTICE '✅ Function exists: handle_new_user()';
  ELSE
    RAISE WARNING '❌ Function NOT found: handle_new_user()';
  END IF;
END $$;

-- Check if trigger exists
DO $$
DECLARE
  trigger_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'auth'
    AND c.relname = 'users'
    AND tgname = 'on_auth_user_created'
  ) INTO trigger_exists;

  IF trigger_exists THEN
    RAISE NOTICE '✅ Trigger exists: on_auth_user_created';
  ELSE
    RAISE WARNING '❌ Trigger NOT found: on_auth_user_created';
  END IF;
END $$;

-- Check if users table exists
DO $$
DECLARE
  table_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'users'
  ) INTO table_exists;

  IF table_exists THEN
    RAISE NOTICE '✅ Table exists: public.users';
  ELSE
    RAISE WARNING '❌ Table NOT found: public.users';
  END IF;
END $$;

DO $$ BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '================================================';
  RAISE NOTICE '✅ ✅ ✅  STEP 1 COMPLETE  ✅ ✅ ✅';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';
  RAISE NOTICE 'What happens now:';
  RAISE NOTICE '  When a user registers → User profile created in public.users';
  RAISE NOTICE '';
  RAISE NOTICE 'Next: Test with npx tsx test-register-frontend.ts';
  RAISE NOTICE '';
END $$;

-- =============================================
-- TEST TRIGGER (Optional - uncomment to test)
-- =============================================

/*
DO $$
DECLARE
  test_user_id UUID;
  test_email TEXT;
  has_profile BOOLEAN;
BEGIN
  test_email := 'step1-test-' || floor(random() * 10000) || '@gmail.com';

  RAISE NOTICE '';
  RAISE NOTICE '================================================';
  RAISE NOTICE 'TESTING TRIGGER';
  RAISE NOTICE '================================================';
  RAISE NOTICE 'Creating test user: %', test_email;

  -- Insert test user
  INSERT INTO auth.users (
    instance_id, id, aud, role, email,
    encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated', 'authenticated', test_email,
    crypt('Admin@123', gen_salt('bf')), NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Step 1 Test"}'::jsonb,
    NOW(), NOW(),
    '', '', ''
  ) RETURNING id INTO test_user_id;

  -- Wait for trigger
  PERFORM pg_sleep(0.5);

  -- Check if profile created
  SELECT EXISTS (SELECT 1 FROM public.users WHERE id = test_user_id) INTO has_profile;

  RAISE NOTICE '';
  IF has_profile THEN
    RAISE NOTICE '🎉 SUCCESS! User profile created';
    RAISE NOTICE '   User ID: %', test_user_id;
  ELSE
    RAISE WARNING '❌ FAILED! User profile NOT created';
  END IF;

  -- Cleanup
  DELETE FROM auth.users WHERE id = test_user_id;
  RAISE NOTICE 'Test user cleaned up';
  RAISE NOTICE '';
END $$;
*/
