-- =============================================
-- ADD userCode COLUMN TO public.users
-- Tự động generate mã 6 ký tự viết hoa (VD: A3B7K9)
-- =============================================

DO $$ BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '================================================';
  RAISE NOTICE 'STEP 1: ADD userCode COLUMN';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';
END $$;

-- Add column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'users'
    AND column_name = 'usercode'
  ) THEN
    ALTER TABLE public.users ADD COLUMN userCode VARCHAR(6) UNIQUE;
    RAISE NOTICE '✅ Column userCode added';
  ELSE
    RAISE NOTICE '⚠️  Column userCode already exists';
  END IF;
END $$;

-- =============================================
-- STEP 2: CREATE FUNCTION TO GENERATE userCode
-- =============================================

DO $$ BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '================================================';
  RAISE NOTICE 'STEP 2: CREATE generate_user_code() FUNCTION';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';
END $$;

-- Drop old function if exists
DROP FUNCTION IF EXISTS public.generate_user_code() CASCADE;

-- Create function to generate unique 6-character uppercase code
CREATE OR REPLACE FUNCTION public.generate_user_code()
RETURNS VARCHAR(6) AS $$
DECLARE
  new_code VARCHAR(6);
  code_exists BOOLEAN;
  max_attempts INTEGER := 20;
  attempt INTEGER := 0;
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  chars_length INTEGER;
  i INTEGER;
BEGIN
  chars_length := LENGTH(chars);

  LOOP
    -- Generate 6 random uppercase alphanumeric characters
    new_code := '';
    FOR i IN 1..6 LOOP
      new_code := new_code || SUBSTR(chars, 1 + FLOOR(RANDOM() * chars_length)::INTEGER, 1);
    END LOOP;

    -- Check if code already exists
    SELECT EXISTS (
      SELECT 1 FROM public.users WHERE userCode = new_code
    ) INTO code_exists;

    -- If unique, return it
    IF NOT code_exists THEN
      RETURN new_code;
    END IF;

    -- Prevent infinite loop
    attempt := attempt + 1;
    IF attempt >= max_attempts THEN
      RAISE EXCEPTION 'Failed to generate unique user code after % attempts', max_attempts;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql VOLATILE;

COMMENT ON FUNCTION public.generate_user_code IS 'Generate unique 6-character uppercase user code (e.g., A3B7K9)';

DO $$ BEGIN
  RAISE NOTICE '✅ Function generate_user_code() created';

  -- Test the function
  DECLARE
    test_code VARCHAR(6);
  BEGIN
    test_code := public.generate_user_code();
    RAISE NOTICE '   Test code: %', test_code;
  END;

  RAISE NOTICE '';
END $$;

-- =============================================
-- STEP 3: CREATE TRIGGER FUNCTION
-- =============================================

DO $$ BEGIN
  RAISE NOTICE '================================================';
  RAISE NOTICE 'STEP 3: CREATE auto_set_user_code() FUNCTION';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';
END $$;

-- Drop old function if exists
DROP FUNCTION IF EXISTS public.auto_set_user_code() CASCADE;

-- Create trigger function
CREATE OR REPLACE FUNCTION public.auto_set_user_code()
RETURNS TRIGGER AS $$
BEGIN
  -- Only generate if userCode is NULL
  IF NEW.userCode IS NULL THEN
    NEW.userCode := public.generate_user_code();
    RAISE NOTICE '[AUTO-CODE] Generated userCode: % for user: %', NEW.userCode, NEW.email;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING '[AUTO-CODE] Failed to generate userCode for %: %', NEW.email, SQLERRM;
    -- Don't block user creation if code generation fails
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.auto_set_user_code IS 'Trigger function to auto-generate userCode when new user is created';

DO $$ BEGIN
  RAISE NOTICE '✅ Function auto_set_user_code() created';
  RAISE NOTICE '';
END $$;

-- =============================================
-- STEP 4: CREATE TRIGGER ON public.users
-- =============================================

DO $$ BEGIN
  RAISE NOTICE '================================================';
  RAISE NOTICE 'STEP 4: CREATE TRIGGER ON public.users';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';
END $$;

-- Drop old trigger if exists
DROP TRIGGER IF EXISTS on_user_insert_set_code ON public.users;

-- Create trigger (BEFORE INSERT so code is set before row is created)
CREATE TRIGGER on_user_insert_set_code
  BEFORE INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_set_user_code();

DO $$ BEGIN
  RAISE NOTICE '✅ Trigger on_user_insert_set_code installed on public.users';
  RAISE NOTICE '';
END $$;

-- =============================================
-- STEP 5: BACKFILL EXISTING USERS
-- =============================================

DO $$ BEGIN
  RAISE NOTICE '================================================';
  RAISE NOTICE 'STEP 5: BACKFILL EXISTING USERS';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';
END $$;

-- Update existing users that don't have userCode
DO $$
DECLARE
  user_record RECORD;
  new_code VARCHAR(6);
  updated_count INTEGER := 0;
BEGIN
  FOR user_record IN
    SELECT id, email FROM public.users WHERE userCode IS NULL
  LOOP
    new_code := public.generate_user_code();
    UPDATE public.users SET userCode = new_code WHERE id = user_record.id;
    updated_count := updated_count + 1;
    RAISE NOTICE '  ✅ Set userCode % for user: %', new_code, user_record.email;
  END LOOP;

  IF updated_count > 0 THEN
    RAISE NOTICE '';
    RAISE NOTICE '✅ Backfilled % existing users', updated_count;
  ELSE
    RAISE NOTICE '⚠️  No users need backfilling';
  END IF;

  RAISE NOTICE '';
END $$;

-- =============================================
-- STEP 6: VERIFICATION
-- =============================================

DO $$ BEGIN
  RAISE NOTICE '================================================';
  RAISE NOTICE 'STEP 6: VERIFICATION';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';
END $$;

-- Check column exists
DO $$
DECLARE
  column_exists BOOLEAN;
  is_unique BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'users'
    AND column_name = 'usercode'
  ) INTO column_exists;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage ccu
      ON tc.constraint_name = ccu.constraint_name
    WHERE tc.table_schema = 'public'
    AND tc.table_name = 'users'
    AND ccu.column_name = 'usercode'
    AND tc.constraint_type = 'UNIQUE'
  ) INTO is_unique;

  IF column_exists THEN
    RAISE NOTICE '✅ Column: userCode exists';
    IF is_unique THEN
      RAISE NOTICE '✅ Constraint: userCode is UNIQUE';
    ELSE
      RAISE NOTICE '⚠️  Constraint: userCode is NOT unique';
    END IF;
  ELSE
    RAISE WARNING '❌ Column userCode NOT found';
  END IF;
END $$;

-- Check function exists
DO $$
DECLARE
  func_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.routines
    WHERE routine_schema = 'public'
    AND routine_name = 'generate_user_code'
  ) INTO func_exists;

  IF func_exists THEN
    RAISE NOTICE '✅ Function: generate_user_code()';
  ELSE
    RAISE WARNING '❌ Function NOT found: generate_user_code()';
  END IF;
END $$;

-- Check trigger function exists
DO $$
DECLARE
  func_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.routines
    WHERE routine_schema = 'public'
    AND routine_name = 'auto_set_user_code'
  ) INTO func_exists;

  IF func_exists THEN
    RAISE NOTICE '✅ Function: auto_set_user_code()';
  ELSE
    RAISE WARNING '❌ Function NOT found: auto_set_user_code()';
  END IF;
END $$;

-- Check trigger exists
DO $$
DECLARE
  trigger_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'public'
    AND c.relname = 'users'
    AND tgname = 'on_user_insert_set_code'
  ) INTO trigger_exists;

  IF trigger_exists THEN
    RAISE NOTICE '✅ Trigger: on_user_insert_set_code on public.users';
  ELSE
    RAISE WARNING '❌ Trigger NOT found: on_user_insert_set_code';
  END IF;
END $$;

-- Show sample of generated codes
DO $$
DECLARE
  sample_count INTEGER;
  sample_record RECORD;
BEGIN
  SELECT COUNT(*) INTO sample_count
  FROM public.users
  WHERE userCode IS NOT NULL
  LIMIT 5;

  IF sample_count > 0 THEN
    RAISE NOTICE '';
    RAISE NOTICE 'Sample userCodes:';

    FOR sample_record IN
      SELECT email, userCode FROM public.users WHERE userCode IS NOT NULL LIMIT 5
    LOOP
      RAISE NOTICE '  % → %', sample_record.email, sample_record.userCode;
    END LOOP;
  END IF;
END $$;

DO $$ BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '================================================';
  RAISE NOTICE '✅ ✅ ✅  SETUP COMPLETE  ✅ ✅ ✅';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';
  RAISE NOTICE 'What happens now:';
  RAISE NOTICE '  When a NEW row is inserted into public.users';
  RAISE NOTICE '  → Trigger fires BEFORE INSERT';
  RAISE NOTICE '  → Auto generates userCode (6 uppercase chars)';
  RAISE NOTICE '  → Example: A3B7K9, X9M2P5, etc.';
  RAISE NOTICE '';
  RAISE NOTICE '🧪 Test: Insert a user and check userCode column';
  RAISE NOTICE '';
END $$;
