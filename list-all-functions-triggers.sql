-- =============================================
-- LIST ALL FUNCTIONS AND TRIGGERS
-- Phân tích xem cái nào cần giữ, cái nào cần xóa
-- =============================================

-- =============================================
-- PART 1: LIST ALL FUNCTIONS IN PUBLIC SCHEMA
-- =============================================

SELECT
  '📦 FUNCTIONS' as section,
  routine_name as name,
  routine_type as type,
  pg_get_function_result(p.oid) as returns,
  CASE
    WHEN routine_name LIKE 'handle_new_user%' THEN '🔴 XÓA - Trigger function cho auto user setup'
    WHEN routine_name = 'generate_event_code' THEN '🔴 XÓA - Helper function cho event code'
    WHEN routine_name = 'auto_generate_event_code' THEN '🔴 XÓA - Trigger function cho events table'
    WHEN routine_name = 'update_subscription_events_used' THEN '🟡 GIỮ - Update subscription counter (cần sau)'
    WHEN routine_name = 'can_user_create_event_v2' THEN '🟡 GIỮ - Check event limit (cần sau)'
    ELSE '🔵 KIỂM TRA - Xem có cần không'
  END as recommendation
FROM information_schema.routines r
JOIN pg_proc p ON p.proname = r.routine_name
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- =============================================
-- PART 2: LIST ALL TRIGGERS ON auth.users
-- =============================================

SELECT
  '🎯 TRIGGERS ON auth.users' as section,
  tgname as trigger_name,
  pg_get_functiondef(tgfoid)::text as calls_function,
  CASE WHEN tgenabled = 'O' THEN '✅ ENABLED' ELSE '❌ DISABLED' END as status,
  CASE
    WHEN tgname LIKE 'on_auth_user%' THEN '🔴 XÓA - Auto user setup triggers'
    ELSE '🔵 KIỂM TRA - Xem có cần không'
  END as recommendation
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'auth'
AND c.relname = 'users'
AND NOT tgisinternal  -- Skip internal triggers
ORDER BY tgname;

-- =============================================
-- PART 3: LIST ALL TRIGGERS ON events TABLE
-- =============================================

SELECT
  '🎯 TRIGGERS ON events' as section,
  tgname as trigger_name,
  pg_get_functiondef(tgfoid)::text as calls_function,
  CASE WHEN tgenabled = 'O' THEN '✅ ENABLED' ELSE '❌ DISABLED' END as status,
  CASE
    WHEN tgname = 'trigger_auto_generate_event_code' THEN '🔴 XÓA - Auto generate code (làm lại sau)'
    WHEN tgname = 'update_subscription_on_event_change' THEN '🟡 GIỮ - Update subscription (cần sau)'
    ELSE '🔵 KIỂM TRA'
  END as recommendation
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public'
AND c.relname = 'events'
AND NOT tgisinternal
ORDER BY tgname;

-- =============================================
-- SUMMARY & RECOMMENDATIONS
-- =============================================

DO $$
DECLARE
  func_count INTEGER;
  auth_trigger_count INTEGER;
  event_trigger_count INTEGER;
BEGIN
  -- Count functions
  SELECT COUNT(*) INTO func_count
  FROM information_schema.routines
  WHERE routine_schema = 'public';

  -- Count triggers on auth.users
  SELECT COUNT(*) INTO auth_trigger_count
  FROM pg_trigger t
  JOIN pg_class c ON t.tgrelid = c.oid
  JOIN pg_namespace n ON c.relnamespace = n.oid
  WHERE n.nspname = 'auth'
  AND c.relname = 'users'
  AND NOT tgisinternal;

  -- Count triggers on events
  SELECT COUNT(*) INTO event_trigger_count
  FROM pg_trigger t
  JOIN pg_class c ON t.tgrelid = c.oid
  JOIN pg_namespace n ON c.relnamespace = n.oid
  WHERE n.nspname = 'public'
  AND c.relname = 'events'
  AND NOT tgisinternal;

  RAISE NOTICE '';
  RAISE NOTICE '================================================';
  RAISE NOTICE 'SUMMARY';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Total functions in public schema: %', func_count;
  RAISE NOTICE 'Total triggers on auth.users: %', auth_trigger_count;
  RAISE NOTICE 'Total triggers on events: %', event_trigger_count;
  RAISE NOTICE '';
  RAISE NOTICE '================================================';
  RAISE NOTICE 'RECOMMENDATIONS';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';
  RAISE NOTICE '🔴 XÓA NGAY (cho STEP 1):';
  RAISE NOTICE '   - Tất cả triggers trên auth.users (on_auth_user_*)';
  RAISE NOTICE '   - Tất cả functions handle_new_user*';
  RAISE NOTICE '   - Function generate_event_code()';
  RAISE NOTICE '   - Trigger trigger_auto_generate_event_code trên events';
  RAISE NOTICE '';
  RAISE NOTICE '🟡 GIỮ LẠI (dùng sau):';
  RAISE NOTICE '   - Function update_subscription_events_used()';
  RAISE NOTICE '   - Function can_user_create_event_v2()';
  RAISE NOTICE '   - Trigger update_subscription_on_event_change';
  RAISE NOTICE '';
  RAISE NOTICE '📝 NOTE:';
  RAISE NOTICE '   Sau khi xóa, STEP 1 sẽ tạo lại:';
  RAISE NOTICE '   - 1 function: handle_new_user()';
  RAISE NOTICE '   - 1 trigger: on_auth_user_created';
  RAISE NOTICE '';
  RAISE NOTICE '================================================';
END $$;

-- =============================================
-- DETAILED FUNCTION ANALYSIS
-- =============================================

DO $$
DECLARE
  func_record RECORD;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '================================================';
  RAISE NOTICE 'DETAILED FUNCTION ANALYSIS';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';

  FOR func_record IN
    SELECT routine_name
    FROM information_schema.routines
    WHERE routine_schema = 'public'
    ORDER BY routine_name
  LOOP
    CASE
      -- Auto user setup functions (XÓA)
      WHEN func_record.routine_name = 'handle_new_user' THEN
        RAISE NOTICE '🔴 % - Tạo user profile (XÓA rồi TẠO LẠI trong STEP 1)', func_record.routine_name;

      WHEN func_record.routine_name = 'handle_new_user_subscription' THEN
        RAISE NOTICE '🔴 % - Tạo subscription (XÓA, làm lại STEP 2)', func_record.routine_name;

      WHEN func_record.routine_name = 'handle_new_user_first_event' THEN
        RAISE NOTICE '🔴 % - Tạo event đầu tiên (XÓA, làm lại STEP 3)', func_record.routine_name;

      -- Event code functions (XÓA)
      WHEN func_record.routine_name = 'generate_event_code' THEN
        RAISE NOTICE '🔴 % - Generate event code (XÓA, làm lại STEP 3)', func_record.routine_name;

      WHEN func_record.routine_name = 'auto_generate_event_code' THEN
        RAISE NOTICE '🔴 % - Trigger function cho event code (XÓA, làm lại STEP 3)', func_record.routine_name;

      -- Subscription tracking (GIỮ)
      WHEN func_record.routine_name = 'update_subscription_events_used' THEN
        RAISE NOTICE '🟡 % - Track event usage (GIỮ LẠI)', func_record.routine_name;

      WHEN func_record.routine_name = 'can_user_create_event_v2' THEN
        RAISE NOTICE '🟡 % - Check event limit (GIỮ LẠI)', func_record.routine_name;

      -- Unknown (check)
      ELSE
        RAISE NOTICE '🔵 % - Cần kiểm tra', func_record.routine_name;
    END CASE;
  END LOOP;

  RAISE NOTICE '';
  RAISE NOTICE '================================================';
END $$;
