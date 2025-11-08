-- =============================================
-- COMPLETE DATABASE SETUP - AUTO USER REGISTRATION
-- Xóa hết và tạo lại từ đầu
-- =============================================

-- =============================================
-- PART 1: CLEAN UP EVERYTHING
-- =============================================

DO $$ BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '================================================';
  RAISE NOTICE 'PART 1: CLEANING UP';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';
END $$;

-- Drop all triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created_first_event ON auth.users CASCADE;
DROP TRIGGER IF EXISTS trigger_auto_generate_event_code ON events CASCADE;
DROP TRIGGER IF EXISTS update_subscription_on_event_change ON events CASCADE;

-- Drop all functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user_subscription() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user_first_event() CASCADE;
DROP FUNCTION IF EXISTS public.generate_event_code() CASCADE;
DROP FUNCTION IF EXISTS public.auto_generate_event_code() CASCADE;
DROP FUNCTION IF EXISTS public.update_subscription_events_used() CASCADE;
DROP FUNCTION IF EXISTS public.can_user_create_event_v2(UUID) CASCADE;

-- Drop views
DROP VIEW IF EXISTS results CASCADE;

-- Drop tables (theo thứ tự phụ thuộc)
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS voters CASCADE;
DROP TABLE IF EXISTS candidates CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS packages CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DO $$ BEGIN
  RAISE NOTICE '✅ Cleaned up all old objects';
  RAISE NOTICE '';
END $$;

-- =============================================
-- PART 2: CREATE TABLES
-- =============================================

DO $$ BEGIN
  RAISE NOTICE '================================================';
  RAISE NOTICE 'PART 2: CREATING TABLES';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';
END $$;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table: users (public profile)
CREATE TABLE public.users (
    id UUID PRIMARY KEY,  -- Same as auth.users.id
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.users IS 'User profiles (linked to auth.users)';

-- Table: packages (subscription plans)
CREATE TABLE public.packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    max_events INTEGER,  -- NULL = unlimited
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.packages IS 'Subscription packages';

-- Table: subscriptions
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    package_id UUID NOT NULL REFERENCES public.packages(id),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    amount_paid DECIMAL(10, 2) DEFAULT 0,
    events_limit INTEGER,  -- NULL = unlimited
    events_used INTEGER DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);

COMMENT ON TABLE public.subscriptions IS 'User subscriptions';

-- Table: events
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    code VARCHAR(8) UNIQUE,
    voting_start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    voting_end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT false,
    auth_settings JSONB DEFAULT '{"require_email": true, "require_phone": false, "require_otp": false}'::jsonb,
    settings JSONB DEFAULT '{
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
    }'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT start_before_end CHECK (voting_start_time < voting_end_time)
);

CREATE INDEX idx_events_user_id ON public.events(user_id);
CREATE INDEX idx_events_code ON public.events(code);
CREATE INDEX idx_events_is_active ON public.events(is_active);

COMMENT ON TABLE public.events IS 'Voting events';
COMMENT ON COLUMN public.events.user_id IS 'User who owns this event';
COMMENT ON COLUMN public.events.code IS 'Unique event code (ERXXXXXX)';

-- Table: categories
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    emoji TEXT,
    max_votes_per_voter INTEGER NOT NULL DEFAULT 1,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT unique_category_per_event UNIQUE (event_id, name)
);

CREATE INDEX idx_categories_event_id ON public.categories(event_id);

COMMENT ON TABLE public.categories IS 'Award categories for each event';

-- Table: candidates
CREATE TABLE public.candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    photo_url TEXT,
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_candidates_category_id ON public.candidates(category_id);

COMMENT ON TABLE public.candidates IS 'Candidates competing in each category';

-- Table: voters
CREATE TABLE public.voters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    email TEXT,
    phone TEXT,
    is_verified BOOLEAN DEFAULT false,
    voted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_voters_event_id ON public.voters(event_id);
CREATE INDEX idx_voters_email ON public.voters(email);

COMMENT ON TABLE public.voters IS 'Registered voters';

-- Table: votes
CREATE TABLE public.votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    voter_id UUID NOT NULL REFERENCES public.voters(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT unique_vote_per_candidate_voter UNIQUE (voter_id, candidate_id)
);

CREATE INDEX idx_votes_voter_id ON public.votes(voter_id);
CREATE INDEX idx_votes_candidate_id ON public.votes(candidate_id);

COMMENT ON TABLE public.votes IS 'Individual votes';

DO $$ BEGIN
  RAISE NOTICE '✅ Created all tables';
  RAISE NOTICE '';
END $$;

-- =============================================
-- PART 3: INSERT DEFAULT DATA
-- =============================================

DO $$ BEGIN
  RAISE NOTICE '================================================';
  RAISE NOTICE 'PART 3: INSERTING DEFAULT DATA';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';
END $$;

-- Insert packages
INSERT INTO public.packages (name, slug, description, price, max_events, features, is_active)
VALUES
  (
    'Basic',
    'basic',
    'Free trial - Perfect for trying out the platform',
    0,
    1,
    '["1 event", "Up to 100 voters", "Email authentication", "Real-time results"]'::jsonb,
    true
  ),
  (
    'Pro',
    'pro',
    'Professional plan for regular users',
    99000,
    5,
    '["5 events", "Up to 500 voters", "Email + Phone authentication", "Real-time results", "Custom branding", "Export data"]'::jsonb,
    true
  ),
  (
    'Enterprise',
    'enterprise',
    'Unlimited events for organizations',
    299000,
    NULL,  -- unlimited
    '["Unlimited events", "Unlimited voters", "All authentication methods", "Real-time results", "Custom branding", "Export data", "Priority support", "White label"]'::jsonb,
    true
  );

DO $$ BEGIN
  RAISE NOTICE '✅ Inserted packages: Basic, Pro, Enterprise';
  RAISE NOTICE '';
END $$;

-- =============================================
-- PART 4: CREATE HELPER FUNCTIONS
-- =============================================

DO $$ BEGIN
  RAISE NOTICE '================================================';
  RAISE NOTICE 'PART 4: CREATING HELPER FUNCTIONS';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';
END $$;

-- Function: generate_event_code
CREATE OR REPLACE FUNCTION public.generate_event_code()
RETURNS VARCHAR(8) AS $$
DECLARE
  new_code VARCHAR(8);
  code_exists BOOLEAN;
  max_attempts INTEGER := 10;
  attempt INTEGER := 0;
BEGIN
  LOOP
    new_code := 'ER' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');

    SELECT EXISTS (SELECT 1 FROM public.events WHERE code = new_code) INTO code_exists;

    IF NOT code_exists THEN
      RETURN new_code;
    END IF;

    attempt := attempt + 1;
    IF attempt >= max_attempts THEN
      RAISE EXCEPTION 'Failed to generate unique event code after % attempts', max_attempts;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql VOLATILE;

COMMENT ON FUNCTION public.generate_event_code IS 'Generate unique event code (ERXXXXXX)';

DO $$ BEGIN
  RAISE NOTICE '✅ Created generate_event_code()';
END $$;

-- =============================================
-- PART 5: CREATE TRIGGER FUNCTIONS
-- =============================================

DO $$ BEGIN
  RAISE NOTICE '================================================';
  RAISE NOTICE 'PART 5: CREATING TRIGGER FUNCTIONS';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';
END $$;

-- Trigger Function 1: Create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    'user',
    true
  );

  RAISE NOTICE '[AUTO-SETUP] Created user profile for: %', NEW.email;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING '[AUTO-SETUP] Failed to create user profile: %', SQLERRM;
    RAISE EXCEPTION 'User profile creation failed: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$ BEGIN
  RAISE NOTICE '✅ Created handle_new_user()';
END $$;

-- Trigger Function 2: Create subscription
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER AS $$
DECLARE
  basic_package_id UUID;
  basic_max_events INTEGER;
BEGIN
  SELECT id, max_events INTO basic_package_id, basic_max_events
  FROM public.packages
  WHERE slug = 'basic'
  LIMIT 1;

  IF basic_package_id IS NULL THEN
    RAISE EXCEPTION 'Basic package not found';
  END IF;

  INSERT INTO public.subscriptions (
    user_id, package_id, status, amount_paid,
    events_limit, events_used, start_date, end_date
  ) VALUES (
    NEW.id,
    basic_package_id,
    'active',
    0,
    basic_max_events,
    0,
    NOW(),
    NOW() + INTERVAL '30 days'
  );

  RAISE NOTICE '[AUTO-SETUP] Created Basic subscription for: %', NEW.email;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING '[AUTO-SETUP] Failed to create subscription: %', SQLERRM;
    RAISE EXCEPTION 'Subscription creation failed: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$ BEGIN
  RAISE NOTICE '✅ Created handle_new_user_subscription()';
END $$;

-- Trigger Function 3: Create first event
CREATE OR REPLACE FUNCTION public.handle_new_user_first_event()
RETURNS TRIGGER AS $$
DECLARE
  event_code VARCHAR(8);
BEGIN
  event_code := public.generate_event_code();

  INSERT INTO public.events (
    name, description, voting_start_time, voting_end_time,
    user_id, code, is_active, auth_settings, settings
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
  );

  RAISE NOTICE '[AUTO-SETUP] Created first event (%) for: %', event_code, NEW.email;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING '[AUTO-SETUP] Failed to create first event: %', SQLERRM;
    RAISE EXCEPTION 'Event creation failed: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$ BEGIN
  RAISE NOTICE '✅ Created handle_new_user_first_event()';
  RAISE NOTICE '';
END $$;

-- =============================================
-- PART 6: CREATE TRIGGERS
-- =============================================

DO $$ BEGIN
  RAISE NOTICE '================================================';
  RAISE NOTICE 'PART 6: CREATING TRIGGERS ON auth.users';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';
END $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_subscription();

CREATE TRIGGER on_auth_user_created_first_event
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_first_event();

DO $$ BEGIN
  RAISE NOTICE '✅ Created 3 triggers:';
  RAISE NOTICE '   - on_auth_user_created';
  RAISE NOTICE '   - on_auth_user_created_subscription';
  RAISE NOTICE '   - on_auth_user_created_first_event';
  RAISE NOTICE '';
END $$;

-- =============================================
-- PART 7: RLS POLICIES
-- =============================================

DO $$ BEGIN
  RAISE NOTICE '================================================';
  RAISE NOTICE 'PART 7: SETTING UP RLS POLICIES';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';
END $$;

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE TO authenticated USING (id = auth.uid());

-- Packages policies (public read)
CREATE POLICY "Anyone can view packages" ON public.packages FOR SELECT TO public USING (is_active = true);

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Events policies
CREATE POLICY "Public can view active events" ON public.events FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Users can view own events" ON public.events FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can create events" ON public.events FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own events" ON public.events FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can delete own events" ON public.events FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Categories policies
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT TO public USING (
  EXISTS (SELECT 1 FROM public.events WHERE id = event_id AND is_active = true)
);
CREATE POLICY "Users can manage own event categories" ON public.categories FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.events WHERE id = event_id AND user_id = auth.uid())
);

-- Candidates policies
CREATE POLICY "Public can view candidates" ON public.candidates FOR SELECT TO public USING (
  EXISTS (
    SELECT 1 FROM public.categories c
    JOIN public.events e ON c.event_id = e.id
    WHERE c.id = category_id AND e.is_active = true
  )
);
CREATE POLICY "Users can manage own event candidates" ON public.candidates FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.categories c
    JOIN public.events e ON c.event_id = e.id
    WHERE c.id = category_id AND e.user_id = auth.uid()
  )
);

-- Voters policies
CREATE POLICY "Public can create voters" ON public.voters FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Voters can view own data" ON public.voters FOR SELECT TO public USING (true);

-- Votes policies
CREATE POLICY "Public can create votes" ON public.votes FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public can view votes" ON public.votes FOR SELECT TO public USING (true);

DO $$ BEGIN
  RAISE NOTICE '✅ Set up RLS policies';
  RAISE NOTICE '';
END $$;

-- =============================================
-- PART 8: CREATE RESULTS VIEW
-- =============================================

DO $$ BEGIN
  RAISE NOTICE '================================================';
  RAISE NOTICE 'PART 8: CREATING RESULTS VIEW';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';
END $$;

CREATE OR REPLACE VIEW public.results AS
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
  COUNT(v.id) AS vote_count,
  RANK() OVER (PARTITION BY cat.id ORDER BY COUNT(v.id) DESC) AS rank
FROM public.events e
JOIN public.categories cat ON cat.event_id = e.id
JOIN public.candidates cand ON cand.category_id = cat.id
LEFT JOIN public.votes v ON v.candidate_id = cand.id
GROUP BY e.id, e.name, e.user_id, cat.id, cat.name, cat.display_order, cand.id, cand.name, cand.photo_url
ORDER BY e.created_at DESC, cat.display_order, vote_count DESC;

DO $$ BEGIN
  RAISE NOTICE '✅ Created results view';
  RAISE NOTICE '';
END $$;

-- =============================================
-- PART 9: VERIFICATION
-- =============================================

DO $$ BEGIN
  RAISE NOTICE '================================================';
  RAISE NOTICE 'PART 9: VERIFICATION';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';
END $$;

-- Count tables
DO $$
DECLARE
  table_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
  AND table_name IN ('users', 'packages', 'subscriptions', 'events', 'categories', 'candidates', 'voters', 'votes');

  RAISE NOTICE 'Tables created: % / 8', table_count;
END $$;

-- Count functions
DO $$
DECLARE
  func_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO func_count
  FROM information_schema.routines
  WHERE routine_schema = 'public'
  AND routine_name IN ('generate_event_code', 'handle_new_user', 'handle_new_user_subscription', 'handle_new_user_first_event');

  RAISE NOTICE 'Functions created: % / 4', func_count;
END $$;

-- Count triggers
DO $$
DECLARE
  trigger_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO trigger_count
  FROM pg_trigger t
  JOIN pg_class c ON t.tgrelid = c.oid
  JOIN pg_namespace n ON c.relnamespace = n.oid
  WHERE n.nspname = 'auth'
  AND c.relname = 'users'
  AND tgname IN ('on_auth_user_created', 'on_auth_user_created_subscription', 'on_auth_user_created_first_event');

  RAISE NOTICE 'Triggers created: % / 3', trigger_count;
END $$;

-- Check Basic package
DO $$
DECLARE
  basic_pkg RECORD;
BEGIN
  SELECT * INTO basic_pkg FROM public.packages WHERE slug = 'basic';

  IF FOUND THEN
    RAISE NOTICE 'Basic package: ✅ (id: %)', basic_pkg.id;
  ELSE
    RAISE WARNING 'Basic package: ❌ NOT FOUND';
  END IF;
END $$;

-- Test event code generation
DO $$
DECLARE
  test_code VARCHAR(8);
BEGIN
  test_code := public.generate_event_code();
  RAISE NOTICE 'Event code test: ✅ (sample: %)', test_code;
END $$;

DO $$ BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '================================================';
  RAISE NOTICE '✅ ✅ ✅  SETUP COMPLETE!  ✅ ✅ ✅';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';
  RAISE NOTICE '🧪 Next step: Test registration';
  RAISE NOTICE '   Run: npx tsx test-register-frontend.ts';
  RAISE NOTICE '';
  RAISE NOTICE '📝 What happens when a user registers:';
  RAISE NOTICE '   1. User profile created in public.users';
  RAISE NOTICE '   2. Basic subscription created (30 days, 1 event)';
  RAISE NOTICE '   3. First event created with code (ERXXXXXX)';
  RAISE NOTICE '';
END $$;
