-- =============================================
-- ADMIN FEATURE TABLES - Complete Schema
-- Migration: 20250114000001
-- Description: Add all missing tables for admin features
-- =============================================

-- =============================================
-- TABLE: guests
-- Purpose: Manage guest list for events
-- =============================================
CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  -- Basic info
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  job_title TEXT,

  -- Categorization
  guest_type TEXT DEFAULT 'standard' CHECK (guest_type IN ('vip', 'speaker', 'sponsor', 'staff', 'standard')),
  table_number TEXT,
  seat_number TEXT,

  -- Check-in status
  check_in_status TEXT DEFAULT 'pending' CHECK (check_in_status IN ('pending', 'checked_in', 'cancelled', 'no_show')),
  check_in_time TIMESTAMP WITH TIME ZONE,
  check_in_method TEXT CHECK (check_in_method IN ('qr', 'manual', 'self')),

  -- Additional data
  notes TEXT,
  custom_fields JSONB DEFAULT '{}'::jsonb,

  -- QR code
  qr_code_data TEXT UNIQUE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guests_event_id ON guests(event_id);
CREATE INDEX IF NOT EXISTS idx_guests_email ON guests(email);
CREATE INDEX IF NOT EXISTS idx_guests_phone ON guests(phone);
CREATE INDEX IF NOT EXISTS idx_guests_qr_code ON guests(qr_code_data);
CREATE INDEX IF NOT EXISTS idx_guests_check_in_status ON guests(check_in_status);

COMMENT ON TABLE guests IS 'Guest list for events with check-in tracking';

-- =============================================
-- TABLE: check_in_configs
-- Purpose: Configure check-in form and settings
-- =============================================
CREATE TABLE IF NOT EXISTS check_in_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  -- Form fields configuration
  form_fields JSONB DEFAULT '{
    "full_name": { "enabled": true, "required": true, "order": 1 },
    "email": { "enabled": true, "required": false, "order": 2 },
    "phone": { "enabled": true, "required": false, "order": 3 },
    "company": { "enabled": false, "required": false, "order": 4 },
    "job_title": { "enabled": false, "required": false, "order": 5 }
  }'::jsonb,

  -- Check-in method
  enable_qr_check_in BOOLEAN DEFAULT true,
  enable_manual_check_in BOOLEAN DEFAULT true,
  enable_self_check_in BOOLEAN DEFAULT false,

  -- QR settings
  qr_url_template TEXT DEFAULT 'https://bright4event.com/event/{event_id}/check-in/{qr_code}',

  -- Success message
  success_message TEXT DEFAULT 'Check-in thành công! Chúc bạn có trải nghiệm tuyệt vời!',
  success_redirect_url TEXT,

  -- LED display
  show_on_led BOOLEAN DEFAULT true,
  led_display_duration INTEGER DEFAULT 5,

  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT one_check_in_config_per_event UNIQUE(event_id)
);

CREATE INDEX IF NOT EXISTS idx_check_in_configs_event_id ON check_in_configs(event_id);

COMMENT ON TABLE check_in_configs IS 'Check-in form configuration per event';

-- =============================================
-- TABLE: waiting_screen_configs
-- Purpose: Slideshow and quotes for waiting screen
-- =============================================
CREATE TABLE IF NOT EXISTS waiting_screen_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  -- Slideshow settings
  slides JSONB DEFAULT '[]'::jsonb,
  /* Example:
  [
    {
      "id": "uuid",
      "url": "https://...",
      "type": "image",
      "order": 1
    }
  ]
  */

  slide_duration INTEGER DEFAULT 5,
  is_playing BOOLEAN DEFAULT true,

  -- Quote settings
  current_quote TEXT,
  quote_list JSONB DEFAULT '[]'::jsonb,

  -- Display settings
  show_event_logo BOOLEAN DEFAULT true,
  event_logo_url TEXT,
  background_color TEXT DEFAULT '#000000',

  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT one_waiting_screen_per_event UNIQUE(event_id)
);

CREATE INDEX IF NOT EXISTS idx_waiting_screen_event_id ON waiting_screen_configs(event_id);

COMMENT ON TABLE waiting_screen_configs IS 'Waiting screen slideshow configuration';

-- =============================================
-- TABLE: welcome_led_configs
-- Purpose: Welcome LED screen settings
-- =============================================
CREATE TABLE IF NOT EXISTS welcome_led_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  -- Welcome message
  welcome_message TEXT DEFAULT 'Chào mừng đến với sự kiện!',
  sub_message TEXT,

  -- Animation settings
  animation_type TEXT DEFAULT 'fade' CHECK (animation_type IN ('fade', 'slide', 'zoom', 'confetti')),
  animation_speed TEXT DEFAULT 'medium' CHECK (animation_speed IN ('slow', 'medium', 'fast')),

  -- Color & Theme
  background_type TEXT DEFAULT 'gradient' CHECK (background_type IN ('solid', 'gradient', 'image')),
  background_color TEXT DEFAULT '#0C0F15',
  gradient_colors JSONB DEFAULT '["#0C0F15", "#161A23"]'::jsonb,
  background_image_url TEXT,

  text_color TEXT DEFAULT '#FFD700',
  logo_url TEXT,
  logo_position TEXT DEFAULT 'top' CHECK (logo_position IN ('top', 'bottom', 'left', 'right', 'center')),

  -- Auto display
  auto_show BOOLEAN DEFAULT true,
  show_duration INTEGER DEFAULT 10,

  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT one_welcome_led_per_event UNIQUE(event_id)
);

CREATE INDEX IF NOT EXISTS idx_welcome_led_event_id ON welcome_led_configs(event_id);

COMMENT ON TABLE welcome_led_configs IS 'Welcome LED screen configuration';

-- =============================================
-- TABLE: result_led_configs
-- Purpose: Result LED display settings
-- =============================================
CREATE TABLE IF NOT EXISTS result_led_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  -- Display settings
  display_mode TEXT DEFAULT 'live' CHECK (display_mode IN ('live', 'final', 'top3', 'all')),
  refresh_interval INTEGER DEFAULT 5,
  show_vote_count BOOLEAN DEFAULT true,
  show_percentage BOOLEAN DEFAULT true,
  show_photos BOOLEAN DEFAULT true,

  -- Visual effects
  enable_confetti BOOLEAN DEFAULT true,
  enable_award_animation BOOLEAN DEFAULT true,
  enable_sound_effects BOOLEAN DEFAULT false,

  -- Theme
  theme TEXT DEFAULT 'gold' CHECK (theme IN ('gold', 'silver', 'bronze', 'rainbow')),
  background_image_url TEXT,

  -- Categories to display (null = all)
  selected_categories JSONB,

  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT one_result_led_per_event UNIQUE(event_id)
);

CREATE INDEX IF NOT EXISTS idx_result_led_event_id ON result_led_configs(event_id);

COMMENT ON TABLE result_led_configs IS 'Result LED display configuration';

-- =============================================
-- TABLE: mini_games
-- Purpose: Mini games for events (lucky wheel, quiz, etc)
-- =============================================
CREATE TABLE IF NOT EXISTS mini_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  description TEXT,
  game_type TEXT NOT NULL CHECK (game_type IN ('lucky_wheel', 'quiz', 'lucky_number', 'memory', 'custom')),

  -- Game config JSON
  config JSONB DEFAULT '{}'::jsonb,
  /* Example for lucky_wheel:
  {
    "prizes": [
      { "id": "1", "name": "iPhone 15", "probability": 0.01, "color": "#FFD700" },
      { "id": "2", "name": "AirPods", "probability": 0.05, "color": "#FFC107" }
    ],
    "spin_duration": 5,
    "sound_enabled": true
  }
  */

  -- Winners tracking
  winners JSONB DEFAULT '[]'::jsonb,
  /* Example:
  [
    {
      "guest_id": "uuid",
      "guest_name": "Nguyễn Văn A",
      "prize_id": "1",
      "prize_name": "iPhone 15",
      "won_at": "2025-01-14T10:30:00Z"
    }
  ]
  */

  -- Game status
  is_active BOOLEAN DEFAULT false,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  max_participants INTEGER,
  participants_count INTEGER DEFAULT 0,

  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mini_games_event_id ON mini_games(event_id);
CREATE INDEX IF NOT EXISTS idx_mini_games_is_active ON mini_games(is_active);

COMMENT ON TABLE mini_games IS 'Mini games for event entertainment';

-- =============================================
-- TABLE: event_settings
-- Purpose: Centralized settings for each event
-- =============================================
CREATE TABLE IF NOT EXISTS event_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  -- Voting settings
  voting_settings JSONB DEFAULT '{
    "allow_multiple_votes": false,
    "require_email_verification": true,
    "require_phone_verification": true,
    "show_realtime_results": true,
    "enable_confetti": true,
    "enable_award_mode": false
  }'::jsonb,

  -- Display settings
  display_settings JSONB DEFAULT '{
    "theme": "gold",
    "primary_color": "#FFD700",
    "secondary_color": "#FFC107",
    "background_color": "#0C0F15",
    "custom_logo_url": null,
    "custom_css": null
  }'::jsonb,

  -- Email settings
  email_settings JSONB DEFAULT '{
    "enable_welcome_email": false,
    "enable_vote_confirmation": false,
    "enable_result_notification": false,
    "from_name": "Bright4Event",
    "from_email": "noreply@bright4event.com"
  }'::jsonb,

  -- Analytics settings
  analytics_settings JSONB DEFAULT '{
    "enable_google_analytics": false,
    "enable_facebook_pixel": false,
    "google_analytics_id": null,
    "facebook_pixel_id": null
  }'::jsonb,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT one_settings_per_event UNIQUE(event_id)
);

CREATE INDEX IF NOT EXISTS idx_event_settings_event_id ON event_settings(event_id);

COMMENT ON TABLE event_settings IS 'Centralized event configuration';

-- =============================================
-- TRIGGERS: Auto-update updated_at
-- =============================================
DROP TRIGGER IF EXISTS update_guests_updated_at ON guests;
CREATE TRIGGER update_guests_updated_at BEFORE UPDATE ON guests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_check_in_configs_updated_at ON check_in_configs;
CREATE TRIGGER update_check_in_configs_updated_at BEFORE UPDATE ON check_in_configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_waiting_screen_configs_updated_at ON waiting_screen_configs;
CREATE TRIGGER update_waiting_screen_configs_updated_at BEFORE UPDATE ON waiting_screen_configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_welcome_led_configs_updated_at ON welcome_led_configs;
CREATE TRIGGER update_welcome_led_configs_updated_at BEFORE UPDATE ON welcome_led_configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_result_led_configs_updated_at ON result_led_configs;
CREATE TRIGGER update_result_led_configs_updated_at BEFORE UPDATE ON result_led_configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_mini_games_updated_at ON mini_games;
CREATE TRIGGER update_mini_games_updated_at BEFORE UPDATE ON mini_games
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_event_settings_updated_at ON event_settings;
CREATE TRIGGER update_event_settings_updated_at BEFORE UPDATE ON event_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Guests
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view guests for their events" ON guests;
CREATE POLICY "Users can view guests for their events"
ON guests FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM events e
    JOIN subscriptions s ON s.user_id = auth.uid()
    WHERE e.id = guests.event_id
    AND s.status = 'active'
  )
);

DROP POLICY IF EXISTS "Users can manage guests for their events" ON guests;
CREATE POLICY "Users can manage guests for their events"
ON guests FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM events e
    JOIN subscriptions s ON s.user_id = auth.uid()
    WHERE e.id = guests.event_id
    AND s.status = 'active'
  )
);

-- Check-in configs
ALTER TABLE check_in_configs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view check-in configs for their events" ON check_in_configs;
CREATE POLICY "Users can view check-in configs for their events"
ON check_in_configs FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM events e
    JOIN subscriptions s ON s.user_id = auth.uid()
    WHERE e.id = check_in_configs.event_id
    AND s.status = 'active'
  )
);

-- Waiting screen configs
ALTER TABLE waiting_screen_configs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage waiting screen for their events" ON waiting_screen_configs;
CREATE POLICY "Users can manage waiting screen for their events"
ON waiting_screen_configs FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM events e
    JOIN subscriptions s ON s.user_id = auth.uid()
    WHERE e.id = waiting_screen_configs.event_id
    AND s.status = 'active'
  )
);

-- Welcome LED configs
ALTER TABLE welcome_led_configs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage welcome LED for their events" ON welcome_led_configs;
CREATE POLICY "Users can manage welcome LED for their events"
ON welcome_led_configs FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM events e
    JOIN subscriptions s ON s.user_id = auth.uid()
    WHERE e.id = welcome_led_configs.event_id
    AND s.status = 'active'
  )
);

-- Result LED configs
ALTER TABLE result_led_configs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage result LED for their events" ON result_led_configs;
CREATE POLICY "Users can manage result LED for their events"
ON result_led_configs FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM events e
    JOIN subscriptions s ON s.user_id = auth.uid()
    WHERE e.id = result_led_configs.event_id
    AND s.status = 'active'
  )
);

-- Mini games
ALTER TABLE mini_games ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage mini games for their events" ON mini_games;
CREATE POLICY "Users can manage mini games for their events"
ON mini_games FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM events e
    JOIN subscriptions s ON s.user_id = auth.uid()
    WHERE e.id = mini_games.event_id
    AND s.status = 'active'
  )
);

-- Event settings
ALTER TABLE event_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage settings for their events" ON event_settings;
CREATE POLICY "Users can manage settings for their events"
ON event_settings FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM events e
    JOIN subscriptions s ON s.user_id = auth.uid()
    WHERE e.id = event_settings.event_id
    AND s.status = 'active'
  )
);

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Function to automatically create default configs when event is created
CREATE OR REPLACE FUNCTION create_default_event_configs()
RETURNS TRIGGER AS $$
BEGIN
  -- Create default check-in config
  INSERT INTO check_in_configs (event_id)
  VALUES (NEW.id)
  ON CONFLICT (event_id) DO NOTHING;

  -- Create default waiting screen config
  INSERT INTO waiting_screen_configs (event_id)
  VALUES (NEW.id)
  ON CONFLICT (event_id) DO NOTHING;

  -- Create default welcome LED config
  INSERT INTO welcome_led_configs (event_id)
  VALUES (NEW.id)
  ON CONFLICT (event_id) DO NOTHING;

  -- Create default result LED config
  INSERT INTO result_led_configs (event_id)
  VALUES (NEW.id)
  ON CONFLICT (event_id) DO NOTHING;

  -- Create default event settings
  INSERT INTO event_settings (event_id)
  VALUES (NEW.id)
  ON CONFLICT (event_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-create configs
DROP TRIGGER IF EXISTS create_event_configs_trigger ON events;
CREATE TRIGGER create_event_configs_trigger
  AFTER INSERT ON events
  FOR EACH ROW
  EXECUTE FUNCTION create_default_event_configs();

-- Function to generate unique QR code for guest
CREATE OR REPLACE FUNCTION generate_guest_qr_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.qr_code_data IS NULL THEN
    NEW.qr_code_data := gen_random_uuid()::text;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate QR code
DROP TRIGGER IF EXISTS generate_qr_code_trigger ON guests;
CREATE TRIGGER generate_qr_code_trigger
  BEFORE INSERT ON guests
  FOR EACH ROW
  EXECUTE FUNCTION generate_guest_qr_code();

-- =============================================
-- COMPLETED
-- =============================================
-- All admin feature tables created successfully!
-- Tables created:
-- - guests
-- - check_in_configs
-- - waiting_screen_configs
-- - welcome_led_configs
-- - result_led_configs
-- - mini_games
-- - event_settings
--
-- Next steps:
-- 1. Run migration: npm run supabase:migrate
-- 2. Update types/database.types.ts
-- 3. Create helper functions in lib/supabase/admin.ts
-- 4. Connect frontend to use Supabase client directly
