-- =============================================
-- SIMPLE TRIGGER TEST
-- Insert a test user directly into auth.users
-- =============================================

DO $$
DECLARE
  test_user_id UUID;
  test_email TEXT;
  has_profile BOOLEAN;
  has_subscription BOOLEAN;
  has_event BOOLEAN;
BEGIN
  test_email := 'trigger-test-' || floor(random() * 10000) || '@gmail.com';

  RAISE NOTICE '';
  RAISE NOTICE '================================================';
  RAISE NOTICE 'TESTING TRIGGERS';
  RAISE NOTICE '================================================';
  RAISE NOTICE 'Creating test user: %', test_email;
  RAISE NOTICE '';

  BEGIN
    -- Insert into auth.users (this SHOULD trigger all 3 triggers)
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
      '{"full_name":"Trigger Test"}'::jsonb,
      NOW(), NOW(),
      '', '', ''
    ) RETURNING id INTO test_user_id;

    RAISE NOTICE '✅ Auth user created: %', test_user_id;

    -- Wait for triggers
    PERFORM pg_sleep(1);

    -- Check results
    SELECT EXISTS (SELECT 1 FROM public.users WHERE id = test_user_id) INTO has_profile;
    SELECT EXISTS (SELECT 1 FROM public.subscriptions WHERE user_id = test_user_id) INTO has_subscription;
    SELECT EXISTS (SELECT 1 FROM public.events WHERE user_id = test_user_id) INTO has_event;

    RAISE NOTICE '';
    RAISE NOTICE '================================================';
    RAISE NOTICE 'RESULTS:';
    RAISE NOTICE '================================================';

    IF has_profile THEN
      RAISE NOTICE '✅ User profile created';
    ELSE
      RAISE WARNING '❌ User profile NOT created (trigger 1 failed)';
    END IF;

    IF has_subscription THEN
      RAISE NOTICE '✅ Subscription created';
    ELSE
      RAISE WARNING '❌ Subscription NOT created (trigger 2 failed)';
    END IF;

    IF has_event THEN
      DECLARE
        event_code TEXT;
      BEGIN
        SELECT code INTO event_code FROM public.events WHERE user_id = test_user_id;
        RAISE NOTICE '✅ First event created (code: %)', event_code;
      END;
    ELSE
      RAISE WARNING '❌ First event NOT created (trigger 3 failed)';
    END IF;

    RAISE NOTICE '';

    IF has_profile AND has_subscription AND has_event THEN
      RAISE NOTICE '🎉 🎉 🎉  ALL TRIGGERS WORKING!  🎉 🎉 🎉';
    ELSE
      RAISE WARNING '❌ SOME TRIGGERS FAILED - Check logs above';
    END IF;

    -- Cleanup
    DELETE FROM auth.users WHERE id = test_user_id;
    RAISE NOTICE '';
    RAISE NOTICE 'Test user cleaned up';

  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '';
    RAISE NOTICE '================================================';
    RAISE NOTICE '❌ ERROR OCCURRED';
    RAISE NOTICE '================================================';
    RAISE NOTICE 'Error: %', SQLERRM;
    RAISE NOTICE 'State: %', SQLSTATE;

    -- Cleanup
    BEGIN
      DELETE FROM auth.users WHERE email = test_email;
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END;

  RAISE NOTICE '';
  RAISE NOTICE '================================================';
END $$;
