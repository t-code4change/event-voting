-- =============================================
-- AUTO CREATE EVENT WHEN NEW USER IN public.users
-- Khi có user mới trong public.users → tự động tạo event mặc định
-- =============================================

-- =============================================
-- PART 1: CREATE HELPER FUNCTION - generate_event_code
-- =============================================

DO $$ BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '================================================';
  RAISE NOTICE 'STEP 1: CREATE generate_event_code() FUNCTION';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';
END $$;

-- Drop old function if exists
DROP FUNCTION IF EXISTS public.generate_event_code() CASCADE;

-- Create function to generate unique event code
CREATE OR REPLACE FUNCTION public.generate_event_code()
RETURNS VARCHAR(8) AS $$
DECLARE
  new_code VARCHAR(8);
  code_exists BOOLEAN;
  max_attempts INTEGER := 10;
  attempt INTEGER := 0;
BEGIN
  LOOP
    -- Generate code: ER + 6 random digits
    new_code := 'ER' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');

    -- Check if code already exists
    SELECT EXISTS (
      SELECT 1 FROM public.events WHERE code = new_code
    ) INTO code_exists;

    -- If unique, return it
    IF NOT code_exists THEN
      RETURN new_code;
    END IF;

    -- Prevent infinite loop
    attempt := attempt + 1;
    IF attempt >= max_attempts THEN
      RAISE EXCEPTION 'Failed to generate unique event code after % attempts', max_attempts;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql VOLATILE;

COMMENT ON FUNCTION public.generate_event_code IS 'Generate unique event code (ERXXXXXX)';

DO $$ BEGIN
  RAISE NOTICE '✅ Function generate_event_code() created';

  -- Test the function
  DECLARE
    test_code VARCHAR(8);
  BEGIN
    test_code := public.generate_event_code();
    RAISE NOTICE '   Test code: %', test_code;
  END;

  RAISE NOTICE '';
END $$;

-- =============================================
-- PART 2: CREATE TRIGGER FUNCTION - auto_create_first_event
-- =============================================

DO $$ BEGIN
  RAISE NOTICE '================================================';
  RAISE NOTICE 'STEP 2: CREATE auto_create_first_event() FUNCTION';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';
END $$;

-- Drop old function if exists
DROP FUNCTION IF EXISTS public.auto_create_first_event() CASCADE;

-- Create trigger function
CREATE OR REPLACE FUNCTION public.auto_create_first_event()
RETURNS TRIGGER AS $$
DECLARE
  event_code VARCHAR(8);
  new_event_id UUID;
BEGIN
  -- Generate unique event code
  event_code := public.generate_event_code();

  -- Create first event for this user
  INSERT INTO public.events (
    name,
    description,
    voting_start_time,
    voting_end_time,
    user_id,
    code,
    is_active,
    auth_settings,
    settings
  ) VALUES (
    'My First Event',
    'Welcome! This is your first event. Edit it to get started.',
    NOW() + INTERVAL '1 day',
    NOW() + INTERVAL '8 days',
    NEW.id,  -- User ID from public.users
    event_code,
    false,
    '{"require_email": true, "require_phone": false, "require_otp": false}'::jsonb,
    '{
      "theme": "default",
      "colors": {
        "primary": "#3b82f6",
        "secondary": "#8b5cf6"
      },
      "features": {
        "show_results_realtime": true,
        "allow_comments": false,
        "require_registration": true
      }
    }'::jsonb
  ) RETURNING id INTO new_event_id;

  RAISE NOTICE '[AUTO-EVENT] Created event (%) for user: % (%)', event_code, NEW.full_name, NEW.email;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING '[AUTO-EVENT] Failed to create event for user %: %', NEW.email, SQLERRM;
    -- Don't block user creation if event creation fails
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.auto_create_first_event IS 'Trigger function to auto-create first event when new user is added to public.users';

DO $$ BEGIN
  RAISE NOTICE '✅ Function auto_create_first_event() created';
  RAISE NOTICE '';
END $$;

-- =============================================
-- PART 3: CREATE TRIGGER ON public.users
-- =============================================

DO $$ BEGIN
  RAISE NOTICE '================================================';
  RAISE NOTICE 'STEP 3: CREATE TRIGGER ON public.users';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';
END $$;

-- Drop old trigger if exists
DROP TRIGGER IF EXISTS on_user_created_auto_event ON public.users;

-- Create trigger
CREATE TRIGGER on_user_created_auto_event
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_create_first_event();

DO $$ BEGIN
  RAISE NOTICE '✅ Trigger on_user_created_auto_event installed on public.users';
  RAISE NOTICE '';
END $$;

-- =============================================
-- PART 4: VERIFICATION
-- =============================================

DO $$ BEGIN
  RAISE NOTICE '================================================';
  RAISE NOTICE 'STEP 4: VERIFICATION';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';
END $$;

-- Check generate_event_code function
DO $$
DECLARE
  func_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.routines
    WHERE routine_schema = 'public'
    AND routine_name = 'generate_event_code'
  ) INTO func_exists;

  IF func_exists THEN
    RAISE NOTICE '✅ Function: generate_event_code()';
  ELSE
    RAISE WARNING '❌ Function NOT found: generate_event_code()';
  END IF;
END $$;

-- Check auto_create_first_event function
DO $$
DECLARE
  func_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.routines
    WHERE routine_schema = 'public'
    AND routine_name = 'auto_create_first_event'
  ) INTO func_exists;

  IF func_exists THEN
    RAISE NOTICE '✅ Function: auto_create_first_event()';
  ELSE
    RAISE WARNING '❌ Function NOT found: auto_create_first_event()';
  END IF;
END $$;

-- Check trigger on public.users
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
    AND tgname = 'on_user_created_auto_event'
  ) INTO trigger_exists;

  IF trigger_exists THEN
    RAISE NOTICE '✅ Trigger: on_user_created_auto_event on public.users';
  ELSE
    RAISE WARNING '❌ Trigger NOT found: on_user_created_auto_event';
  END IF;
END $$;

-- Check if events table has required columns
DO $$
DECLARE
  has_user_id BOOLEAN;
  has_code BOOLEAN;
  has_settings BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'events'
    AND column_name = 'user_id'
  ) INTO has_user_id;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'events'
    AND column_name = 'code'
  ) INTO has_code;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'events'
    AND column_name = 'settings'
  ) INTO has_settings;

  IF has_user_id AND has_code AND has_settings THEN
    RAISE NOTICE '✅ Events table has: user_id, code, settings';
  ELSE
    RAISE WARNING '❌ Events table missing columns:';
    IF NOT has_user_id THEN
      RAISE WARNING '   - user_id';
    END IF;
    IF NOT has_code THEN
      RAISE WARNING '   - code';
    END IF;
    IF NOT has_settings THEN
      RAISE WARNING '   - settings';
    END IF;
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
  RAISE NOTICE '  → Trigger fires';
  RAISE NOTICE '  → Auto creates first event with:';
  RAISE NOTICE '     • Name: "My First Event"';
  RAISE NOTICE '     • Code: ER123456 (random)';
  RAISE NOTICE '     • user_id: linked to user';
  RAISE NOTICE '     • Default settings';
  RAISE NOTICE '';
  RAISE NOTICE '🧪 Test: Insert a user into public.users and check events table';
  RAISE NOTICE '';
END $$;

-- =============================================
-- OPTIONAL: TEST THE TRIGGER
-- Uncomment to test immediately
-- =============================================

/*
DO $$
DECLARE
  test_user_id UUID;
  has_event BOOLEAN;
  event_code TEXT;
BEGIN
  test_user_id := gen_random_uuid();

  RAISE NOTICE '';
  RAISE NOTICE '================================================';
  RAISE NOTICE 'TESTING TRIGGER';
  RAISE NOTICE '================================================';
  RAISE NOTICE 'Creating test user...';

  -- Insert test user into public.users
  INSERT INTO public.users (id, email, full_name, role, is_active)
  VALUES (
    test_user_id,
    'trigger-test-' || floor(random() * 10000) || '@gmail.com',
    'Trigger Test User',
    'user',
    true
  );

  -- Wait for trigger
  PERFORM pg_sleep(0.5);

  -- Check if event was created
  SELECT EXISTS (
    SELECT 1 FROM public.events WHERE user_id = test_user_id
  ) INTO has_event;

  IF has_event THEN
    SELECT code INTO event_code FROM public.events WHERE user_id = test_user_id;
    RAISE NOTICE '';
    RAISE NOTICE '🎉 SUCCESS! Event created automatically';
    RAISE NOTICE '   Event code: %', event_code;
  ELSE
    RAISE WARNING '';
    RAISE WARNING '❌ FAILED! Event NOT created';
  END IF;

  -- Cleanup
  DELETE FROM public.users WHERE id = test_user_id;
  RAISE NOTICE 'Test user cleaned up';
  RAISE NOTICE '';
END $$;
*/
