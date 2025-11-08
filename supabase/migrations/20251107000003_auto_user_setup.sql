-- =============================================
-- AUTO USER SETUP - Triggers & Functions
-- Date: 2025-11-07
-- Description: Automatically create user profile, subscription, and first event on registration
-- =============================================

-- =============================================
-- FUNCTION 1: Auto Create User Profile
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_email TEXT;
  user_metadata JSONB;
BEGIN
  -- Get email from auth.users
  user_email := NEW.email;
  user_metadata := NEW.raw_user_meta_data;

  -- Insert into public.users
  INSERT INTO public.users (
    id,
    email,
    full_name,
    avatar_url,
    role,
    is_active
  ) VALUES (
    NEW.id,
    user_email,
    COALESCE(user_metadata->>'full_name', user_metadata->>'name', split_part(user_email, '@', 1)),
    COALESCE(user_metadata->>'avatar_url', user_metadata->>'picture'),
    'user',
    true
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, users.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
    updated_at = NOW();

  RAISE NOTICE 'Created user profile for: %', user_email;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.handle_new_user IS 'Automatically create user profile when auth user is created';

-- =============================================
-- FUNCTION 2: Auto Create Subscription (Basic Package)
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER AS $$
DECLARE
  basic_package_id UUID;
  new_subscription_id UUID;
BEGIN
  -- Get Basic package ID
  SELECT id INTO basic_package_id
  FROM public.packages
  WHERE slug = 'basic'
  LIMIT 1;

  IF basic_package_id IS NULL THEN
    RAISE WARNING 'Basic package not found! Cannot create subscription for user %', NEW.email;
    RETURN NEW;
  END IF;

  -- Create Basic subscription for new user
  INSERT INTO public.subscriptions (
    user_id,
    package_id,
    status,
    amount_paid,
    currency,
    events_limit,
    events_used,
    start_date,
    end_date
  ) VALUES (
    NEW.id,
    basic_package_id,
    'active',
    0,
    'VND',
    1,  -- Basic: 1 event limit
    0,  -- No events created yet
    NOW(),
    NOW() + INTERVAL '30 days'  -- 30 days free trial
  )
  RETURNING id INTO new_subscription_id;

  RAISE NOTICE 'Created Basic subscription (30 days trial) for user: %', NEW.email;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.handle_new_user_subscription IS 'Automatically create Basic subscription (30 days trial) for new users';

-- =============================================
-- FUNCTION 3: Auto Create First Event
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user_first_event()
RETURNS TRIGGER AS $$
DECLARE
  new_event_id UUID;
  event_code VARCHAR(8);
BEGIN
  -- Generate event code
  event_code := generate_event_code();

  -- Create first event for new user
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
    NEW.id,
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
  )
  RETURNING id INTO new_event_id;

  RAISE NOTICE 'Created first event (%) for user: %', event_code, NEW.email;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.handle_new_user_first_event IS 'Automatically create first event for new users';

-- =============================================
-- TRIGGERS: Chain triggers on auth.users INSERT
-- =============================================

-- Trigger 1: Create user profile (runs first)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Trigger 2: Create subscription (runs second, after user profile)
DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users;
CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_subscription();

-- Trigger 3: Create first event (runs third, after subscription)
DROP TRIGGER IF EXISTS on_auth_user_created_first_event ON auth.users;
CREATE TRIGGER on_auth_user_created_first_event
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_first_event();

-- =============================================
-- VERIFICATION
-- =============================================

DO $$
DECLARE
  has_user_trigger BOOLEAN;
  has_subscription_trigger BOOLEAN;
  has_event_trigger BOOLEAN;
BEGIN
  -- Check triggers exist
  SELECT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) INTO has_user_trigger;

  SELECT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created_subscription'
  ) INTO has_subscription_trigger;

  SELECT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created_first_event'
  ) INTO has_event_trigger;

  RAISE NOTICE '';
  RAISE NOTICE '=================================================';
  RAISE NOTICE 'AUTO USER SETUP VERIFICATION';
  RAISE NOTICE '=================================================';
  RAISE NOTICE 'User profile trigger: %', CASE WHEN has_user_trigger THEN '✅ YES' ELSE '❌ NO' END;
  RAISE NOTICE 'Subscription trigger: %', CASE WHEN has_subscription_trigger THEN '✅ YES' ELSE '❌ NO' END;
  RAISE NOTICE 'First event trigger: %', CASE WHEN has_event_trigger THEN '✅ YES' ELSE '❌ NO' END;
  RAISE NOTICE '=================================================';
  RAISE NOTICE '';

  IF has_user_trigger AND has_subscription_trigger AND has_event_trigger THEN
    RAISE NOTICE '✅ Auto user setup completed successfully!';
    RAISE NOTICE '';
    RAISE NOTICE 'When a new user registers:';
    RAISE NOTICE '  1. User profile created in public.users';
    RAISE NOTICE '  2. Basic subscription created (30 days trial, 1 event)';
    RAISE NOTICE '  3. First event created automatically';
    RAISE NOTICE '';
  ELSE
    RAISE WARNING '❌ Auto user setup incomplete. Please check the logs above.';
  END IF;
END $$;

-- =============================================
-- COMPLETED
-- =============================================
-- Auto user setup completed!
--
-- New user registration flow:
-- 1. User signs up via Supabase Auth
-- 2. auth.users record created
-- 3. TRIGGER 1: public.users profile created
-- 4. TRIGGER 2: Basic subscription created (30 days trial)
-- 5. TRIGGER 3: First event created with code
--
-- User immediately has:
-- - User profile
-- - Active Basic subscription (30 days)
-- - First event ready to customize
