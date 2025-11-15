-- =============================================
-- FIX: Database error saving new user
-- =============================================
-- Error: {"code":"unexpected_failure","message":"Database error saving new user"}
-- Cause: Missing 'basic' package or triggers not properly configured
-- =============================================

-- STEP 1: Verify packages table exists and has data
-- =============================================

DO $$
DECLARE
  packages_exists BOOLEAN;
  basic_package_count INTEGER;
BEGIN
  -- Check if packages table exists
  SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_name = 'packages'
  ) INTO packages_exists;

  IF NOT packages_exists THEN
    RAISE WARNING '❌ packages table does not exist! Creating now...';

    -- Create packages table if missing (should be from migration 20251107000001)
    CREATE TABLE IF NOT EXISTS packages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      price DECIMAL(12,2) NOT NULL,
      currency TEXT NOT NULL DEFAULT 'VND',
      billing_period TEXT NOT NULL DEFAULT 'one_time' CHECK (billing_period IN ('one_time', 'monthly', 'yearly')),
      max_events INTEGER,
      max_participants_per_event INTEGER,
      max_categories_per_event INTEGER,
      max_candidates_per_category INTEGER,
      features JSONB DEFAULT '{}'::jsonb,
      is_active BOOLEAN DEFAULT true,
      is_popular BOOLEAN DEFAULT false,
      is_highlighted BOOLEAN DEFAULT false,
      display_order INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    RAISE NOTICE '✅ Created packages table';
  ELSE
    RAISE NOTICE '✅ packages table exists';
  END IF;

  -- Check if basic package exists
  SELECT COUNT(*) INTO basic_package_count
  FROM packages
  WHERE slug = 'basic';

  IF basic_package_count = 0 THEN
    RAISE WARNING '❌ Basic package not found! Inserting now...';

    -- Insert basic package
    INSERT INTO packages (name, slug, description, price, billing_period, max_events, max_participants_per_event, features, is_active, display_order)
    VALUES (
      'Basic',
      'basic',
      'Dành cho sự kiện nhỏ và vừa - Miễn phí 30 ngày',
      0,
      'one_time',
      1,  -- 1 event limit for basic package
      200,
      '{"custom_branding": false, "led_display": false, "qr_checkin": true, "advanced_analytics": false, "priority_support": false}'::jsonb,
      true,
      1
    )
    ON CONFLICT (slug) DO UPDATE SET
      description = EXCLUDED.description,
      max_events = EXCLUDED.max_events,
      max_participants_per_event = EXCLUDED.max_participants_per_event;

    RAISE NOTICE '✅ Basic package created';
  ELSE
    RAISE NOTICE '✅ Basic package exists';
  END IF;
END $$;

-- =============================================
-- STEP 2: Fix handle_new_user_subscription function to handle missing package gracefully
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
    -- Log warning but DON'T fail the user creation
    RAISE WARNING 'Basic package not found! Cannot create subscription for user %. User profile will still be created.', NEW.email;
    RETURN NEW;  -- Return NEW to continue trigger chain
  END IF;

  -- Create Basic subscription for new user
  BEGIN
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
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Failed to create subscription for %: %', NEW.email, SQLERRM;
    -- Don't fail user creation, just log the error
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- STEP 3: Fix handle_new_user_first_event function to handle failures gracefully
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user_first_event()
RETURNS TRIGGER AS $$
DECLARE
  new_event_id UUID;
  event_code VARCHAR(8);
  has_subscription BOOLEAN;
BEGIN
  -- Check if user has an active subscription
  SELECT EXISTS (
    SELECT 1 FROM subscriptions
    WHERE user_id = NEW.id
    AND status = 'active'
  ) INTO has_subscription;

  IF NOT has_subscription THEN
    RAISE WARNING 'User % has no active subscription. Skipping first event creation.', NEW.email;
    RETURN NEW;
  END IF;

  -- Generate event code
  BEGIN
    event_code := generate_event_code();
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Failed to generate event code for %: %', NEW.email, SQLERRM;
    RETURN NEW;
  END;

  -- Create first event for new user
  BEGIN
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
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Failed to create first event for %: %', NEW.email, SQLERRM;
    -- Don't fail user creation, just log the error
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- STEP 4: Ensure triggers are properly installed
-- =============================================

-- Drop and recreate triggers to ensure correct order
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_first_event ON auth.users;

-- Trigger 1: Create user profile (runs first - MUST succeed)
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Trigger 2: Create subscription (runs second - can fail gracefully)
CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_subscription();

-- Trigger 3: Create first event (runs third - can fail gracefully)
CREATE TRIGGER on_auth_user_created_first_event
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_first_event();

-- =============================================
-- STEP 5: Enable RLS on packages table if not already
-- =============================================

ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- Allow public to view active packages
DROP POLICY IF EXISTS "Anyone can view active packages" ON packages;
CREATE POLICY "Anyone can view active packages"
ON packages FOR SELECT
TO public
USING (is_active = true);

-- =============================================
-- VERIFICATION
-- =============================================

DO $$
DECLARE
  basic_package RECORD;
  trigger_count INTEGER;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=================================================';
  RAISE NOTICE 'REGISTRATION FIX VERIFICATION';
  RAISE NOTICE '=================================================';

  -- Check basic package
  SELECT * INTO basic_package FROM packages WHERE slug = 'basic' LIMIT 1;
  IF FOUND THEN
    RAISE NOTICE '✅ Basic package: % (ID: %)', basic_package.name, basic_package.id;
    RAISE NOTICE '   - Events limit: %', basic_package.max_events;
    RAISE NOTICE '   - Max participants: %', basic_package.max_participants_per_event;
  ELSE
    RAISE WARNING '❌ Basic package NOT FOUND!';
  END IF;

  -- Check triggers
  SELECT COUNT(*) INTO trigger_count
  FROM pg_trigger
  WHERE tgname IN ('on_auth_user_created', 'on_auth_user_created_subscription', 'on_auth_user_created_first_event');

  RAISE NOTICE 'Triggers installed: % / 3', trigger_count;

  IF trigger_count = 3 THEN
    RAISE NOTICE '✅ All triggers installed correctly';
  ELSE
    RAISE WARNING '❌ Missing triggers! Expected 3, found %', trigger_count;
  END IF;

  RAISE NOTICE '=================================================';
  RAISE NOTICE '';

  IF FOUND AND trigger_count = 3 THEN
    RAISE NOTICE '✅ REGISTRATION FIX COMPLETED SUCCESSFULLY!';
    RAISE NOTICE '';
    RAISE NOTICE 'You can now register new users. The system will:';
    RAISE NOTICE '  1. Create user profile in public.users';
    RAISE NOTICE '  2. Create Basic subscription (30 days trial)';
    RAISE NOTICE '  3. Create first event automatically';
    RAISE NOTICE '  4. If steps 2-3 fail, user profile is still created';
    RAISE NOTICE '';
  ELSE
    RAISE WARNING '❌ REGISTRATION FIX INCOMPLETE!';
    RAISE WARNING 'Please check the errors above and contact support.';
  END IF;
END $$;

-- =============================================
-- COMPLETED
-- =============================================
