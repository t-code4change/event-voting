-- =============================================
-- VERIFY COMPLETE SETUP
-- =============================================

-- Check tables exist
SELECT
  'Tables' as check_type,
  COUNT(*) as count,
  CASE
    WHEN COUNT(*) = 8 THEN '✅ All tables exist'
    ELSE '❌ Missing tables: ' || (8 - COUNT(*))::text
  END as status
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('users', 'packages', 'subscriptions', 'events', 'categories', 'candidates', 'voters', 'votes');

-- Check functions exist
SELECT
  'Functions' as check_type,
  COUNT(*) as count,
  CASE
    WHEN COUNT(*) >= 4 THEN '✅ All functions exist'
    ELSE '❌ Missing functions: ' || (4 - COUNT(*))::text
  END as status
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('generate_event_code', 'handle_new_user', 'handle_new_user_subscription', 'handle_new_user_first_event');

-- Check triggers exist
SELECT
  'Triggers' as check_type,
  COUNT(*) as count,
  CASE
    WHEN COUNT(*) = 3 THEN '✅ All triggers exist'
    ELSE '❌ Missing triggers: ' || (3 - COUNT(*))::text
  END as status
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'auth'
AND c.relname = 'users'
AND tgname IN ('on_auth_user_created', 'on_auth_user_created_subscription', 'on_auth_user_created_first_event');

-- Check Basic package
SELECT
  'Basic Package' as check_type,
  COUNT(*) as count,
  CASE
    WHEN COUNT(*) = 1 THEN '✅ Basic package exists'
    ELSE '❌ Basic package missing'
  END as status
FROM packages
WHERE slug = 'basic';

-- List all triggers on auth.users
SELECT
  tgname as trigger_name,
  CASE WHEN tgenabled = 'O' THEN '✅ ENABLED' ELSE '❌ DISABLED' END as status
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'auth'
AND c.relname = 'users'
ORDER BY tgname;

-- Test if we can manually call trigger functions
DO $$
DECLARE
  test_code VARCHAR(8);
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE 'Testing functions manually...';

  -- Test generate_event_code
  BEGIN
    test_code := public.generate_event_code();
    RAISE NOTICE '✅ generate_event_code() works: %', test_code;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING '❌ generate_event_code() failed: %', SQLERRM;
  END;

END $$;
