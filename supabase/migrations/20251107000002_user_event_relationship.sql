-- =============================================
-- MIGRATION: Add User-Event Relationship
-- Date: 2025-11-07
-- Description: Add user_id to events table and update RLS policies
-- =============================================

-- This migration adds the missing relationship between users and events
-- so that each user can own multiple events

-- =============================================
-- STEP 1: ADD USER_ID TO EVENTS TABLE
-- =============================================

-- Add user_id column to events table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE events
    ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE;

    CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);

    COMMENT ON COLUMN events.user_id IS 'User who owns this event (from subscription system)';

    RAISE NOTICE 'Added user_id column to events table';
  ELSE
    RAISE NOTICE 'user_id column already exists in events table';
  END IF;
END $$;

-- =============================================
-- STEP 2: ADD SETTINGS COLUMN TO EVENTS
-- =============================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'settings'
  ) THEN
    ALTER TABLE events
    ADD COLUMN settings JSONB DEFAULT '{
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
    }'::jsonb;

    COMMENT ON COLUMN events.settings IS 'Event-specific settings (theme, colors, features)';

    RAISE NOTICE 'Added settings column to events table';
  ELSE
    RAISE NOTICE 'settings column already exists in events table';
  END IF;
END $$;

-- =============================================
-- STEP 3: ADD CODE COLUMN TO EVENTS
-- =============================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'code'
  ) THEN
    ALTER TABLE events
    ADD COLUMN code VARCHAR(8) UNIQUE;

    CREATE UNIQUE INDEX IF NOT EXISTS idx_events_code ON events(code);

    COMMENT ON COLUMN events.code IS 'Unique event code (format: ERXXXXXX - ER + 6 random digits)';

    RAISE NOTICE 'Added code column to events table';
  ELSE
    RAISE NOTICE 'code column already exists in events table';
  END IF;
END $$;

-- =============================================
-- STEP 4: CREATE FUNCTION TO GENERATE EVENT CODE
-- =============================================

CREATE OR REPLACE FUNCTION generate_event_code()
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
  max_attempts INTEGER := 10;
  attempt INTEGER := 0;
BEGIN
  LOOP
    -- Generate code: ER + 6 random digits
    new_code := 'ER' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');

    -- Check if code already exists
    SELECT EXISTS (
      SELECT 1 FROM events WHERE code = new_code
    ) INTO code_exists;

    -- If code doesn't exist, return it
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
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION generate_event_code IS 'Generate unique event code (format: ERXXXXXX)';

-- =============================================
-- STEP 5: CREATE TRIGGER TO AUTO-GENERATE CODE
-- =============================================

CREATE OR REPLACE FUNCTION auto_generate_event_code()
RETURNS TRIGGER AS $$
BEGIN
  -- Only generate code if not provided
  IF NEW.code IS NULL OR NEW.code = '' THEN
    NEW.code := generate_event_code();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_generate_event_code ON events;

CREATE TRIGGER trigger_auto_generate_event_code
  BEFORE INSERT ON events
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_event_code();

COMMENT ON FUNCTION auto_generate_event_code IS 'Trigger function to auto-generate event code on insert';

-- Update existing events with codes if they don't have one
DO $$
DECLARE
  event_record RECORD;
BEGIN
  FOR event_record IN
    SELECT id FROM events WHERE code IS NULL
  LOOP
    UPDATE events
    SET code = generate_event_code()
    WHERE id = event_record.id;
  END LOOP;

  RAISE NOTICE 'Updated codes for existing events';
END $$;

-- =============================================
-- STEP 6: UPDATE RLS POLICIES FOR EVENTS
-- =============================================

-- Drop old policies
DROP POLICY IF EXISTS "Public can view active events" ON events;
DROP POLICY IF EXISTS "Users can view own events" ON events;
DROP POLICY IF EXISTS "Users can create events" ON events;
DROP POLICY IF EXISTS "Users can update own events" ON events;
DROP POLICY IF EXISTS "Users can delete own events" ON events;
DROP POLICY IF EXISTS "Admins can manage all events" ON events;

-- Public can view active events (no change)
CREATE POLICY "Public can view active events"
ON events FOR SELECT
TO public
USING (is_active = true);

-- Users can view their own events
CREATE POLICY "Users can view own events"
ON events FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can create events (must set user_id to their own ID)
CREATE POLICY "Users can create events"
ON events FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can update their own events
CREATE POLICY "Users can update own events"
ON events FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Users can delete their own events
CREATE POLICY "Users can delete own events"
ON events FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Admins can manage all events
CREATE POLICY "Admins can manage all events"
ON events FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin')
  )
);

-- =============================================
-- STEP 4: CREATE/UPDATE RESULTS VIEW
-- =============================================

-- Drop old view if exists
DROP VIEW IF EXISTS results;

-- Create results view with user_id
CREATE OR REPLACE VIEW results AS
SELECT
  e.id AS event_id,
  e.name AS event_name,
  e.user_id,
  cat.id AS category_id,
  cat.name AS category_name,
  cat.display_order AS category_order,
  cand.id AS candidate_id,
  cand.name AS candidate_name,
  cand.photo_url,
  cand.description,
  COUNT(v.id) AS vote_count,
  RANK() OVER (
    PARTITION BY cat.id
    ORDER BY COUNT(v.id) DESC
  ) AS rank
FROM events e
JOIN categories cat ON cat.event_id = e.id
JOIN candidates cand ON cand.category_id = cat.id
LEFT JOIN votes v ON v.candidate_id = cand.id
GROUP BY
  e.id, e.name, e.user_id,
  cat.id, cat.name, cat.display_order,
  cand.id, cand.name, cand.photo_url, cand.description
ORDER BY e.created_at DESC, cat.display_order, vote_count DESC;

COMMENT ON VIEW results IS 'Aggregated voting results with rankings per category';

-- =============================================
-- STEP 5: CREATE HELPER FUNCTION TO CHECK USER EVENT LIMITS
-- =============================================

-- Function to check if user can create more events based on subscription
CREATE OR REPLACE FUNCTION can_user_create_event_v2(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  active_sub RECORD;
  current_event_count INTEGER;
BEGIN
  -- Get active subscription
  SELECT s.*, s.events_limit, s.events_used
  INTO active_sub
  FROM subscriptions s
  WHERE s.user_id = user_uuid
  AND s.status = 'active'
  AND (s.end_date IS NULL OR s.end_date > NOW())
  ORDER BY s.created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN false;  -- No active subscription
  END IF;

  -- Check if unlimited events
  IF active_sub.events_limit IS NULL THEN
    RETURN true;
  END IF;

  -- Count current events for user
  SELECT COUNT(*) INTO current_event_count
  FROM events
  WHERE user_id = user_uuid;

  -- Check if within limit
  RETURN current_event_count < active_sub.events_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION can_user_create_event_v2 IS 'Check if user can create more events based on subscription limits';

-- =============================================
-- STEP 6: CREATE TRIGGER TO UPDATE SUBSCRIPTION EVENTS_USED
-- =============================================

-- Function to update subscription events_used when event is created
CREATE OR REPLACE FUNCTION update_subscription_events_used()
RETURNS TRIGGER AS $$
DECLARE
  active_sub_id UUID;
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Find active subscription for this user
    SELECT id INTO active_sub_id
    FROM subscriptions
    WHERE user_id = NEW.user_id
    AND status = 'active'
    AND (end_date IS NULL OR end_date > NOW())
    ORDER BY created_at DESC
    LIMIT 1;

    IF FOUND THEN
      -- Increment events_used
      UPDATE subscriptions
      SET events_used = COALESCE(events_used, 0) + 1
      WHERE id = active_sub_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    -- Find active subscription for this user
    SELECT id INTO active_sub_id
    FROM subscriptions
    WHERE user_id = OLD.user_id
    AND status = 'active'
    AND (end_date IS NULL OR end_date > NOW())
    ORDER BY created_at DESC
    LIMIT 1;

    IF FOUND THEN
      -- Decrement events_used
      UPDATE subscriptions
      SET events_used = GREATEST(COALESCE(events_used, 0) - 1, 0)
      WHERE id = active_sub_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS update_subscription_on_event_change ON events;

-- Create trigger
CREATE TRIGGER update_subscription_on_event_change
  AFTER INSERT OR DELETE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_subscription_events_used();

COMMENT ON FUNCTION update_subscription_events_used IS 'Automatically update subscription events_used counter when events are created/deleted';

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Check if migration was successful
DO $$
DECLARE
  has_user_id BOOLEAN;
  has_settings BOOLEAN;
  has_code BOOLEAN;
  sample_code TEXT;
BEGIN
  -- Check user_id column
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'user_id'
  ) INTO has_user_id;

  -- Check settings column
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'settings'
  ) INTO has_settings;

  -- Check code column
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'code'
  ) INTO has_code;

  -- Generate sample code
  sample_code := generate_event_code();

  RAISE NOTICE '';
  RAISE NOTICE '=================================================';
  RAISE NOTICE 'MIGRATION VERIFICATION';
  RAISE NOTICE '=================================================';
  RAISE NOTICE 'Events table has user_id: %', CASE WHEN has_user_id THEN '✅ YES' ELSE '❌ NO' END;
  RAISE NOTICE 'Events table has settings: %', CASE WHEN has_settings THEN '✅ YES' ELSE '❌ NO' END;
  RAISE NOTICE 'Events table has code: %', CASE WHEN has_code THEN '✅ YES' ELSE '❌ NO' END;
  RAISE NOTICE 'Sample generated code: %', sample_code;
  RAISE NOTICE '=================================================';
  RAISE NOTICE '';

  IF has_user_id AND has_settings AND has_code THEN
    RAISE NOTICE '✅ Migration completed successfully!';
  ELSE
    RAISE WARNING '❌ Migration incomplete. Please check the logs above.';
  END IF;
END $$;

-- =============================================
-- COMPLETED
-- =============================================
-- Next steps:
-- 1. Update existing events to assign them to a user
-- 2. Run seed data script to create test data
-- 3. Test the user-event relationship in the app
