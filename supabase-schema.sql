-- =============================================
-- Bright4Event - DATABASE SCHEMA
-- Supabase (PostgreSQL 15)
-- Updated: 2025-11-05
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLE: events
-- =============================================
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    voting_start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    voting_end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT false,
    auth_settings JSONB DEFAULT '{"require_email": true, "require_phone": false, "require_otp": false}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT start_before_end CHECK (voting_start_time < voting_end_time)
);

COMMENT ON TABLE events IS 'Stores event information for voting';
COMMENT ON COLUMN events.is_active IS 'Only one event should be active at a time';
COMMENT ON COLUMN events.auth_settings IS 'Authentication configuration: require_email, require_phone, require_otp';

-- =============================================
-- TABLE: categories
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    emoji TEXT,
    max_votes_per_voter INTEGER NOT NULL DEFAULT 1,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT unique_category_per_event UNIQUE (event_id, name)
);

CREATE INDEX IF NOT EXISTS idx_categories_event_id ON categories(event_id);
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(display_order);

COMMENT ON TABLE categories IS 'Award categories for each event';
COMMENT ON COLUMN categories.max_votes_per_voter IS 'Maximum number of candidates each voter can select in this category';

-- =============================================
-- TABLE: candidates
-- =============================================
CREATE TABLE IF NOT EXISTS candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    photo_url TEXT,
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_candidates_category_id ON candidates(category_id);
CREATE INDEX IF NOT EXISTS idx_candidates_order ON candidates(display_order);

COMMENT ON TABLE candidates IS 'Candidates competing in each category';
COMMENT ON COLUMN candidates.photo_url IS 'URL to candidate photo in Supabase Storage';

-- =============================================
-- TABLE: voters
-- =============================================
CREATE TABLE IF NOT EXISTS voters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    email TEXT,
    phone TEXT,
    is_verified BOOLEAN DEFAULT false,
    voted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_voters_event_id ON voters(event_id);
CREATE INDEX IF NOT EXISTS idx_voters_email ON voters(email);
CREATE INDEX IF NOT EXISTS idx_voters_phone ON voters(phone);

COMMENT ON TABLE voters IS 'Registered voters who have verified via OTP or quick login';
COMMENT ON COLUMN voters.is_verified IS 'Whether the voter has been verified (via OTP or quick login)';
COMMENT ON COLUMN voters.voted_at IS 'Timestamp when voter last submitted votes';

-- =============================================
-- TABLE: votes
-- =============================================
CREATE TABLE IF NOT EXISTS votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    voter_id UUID NOT NULL REFERENCES voters(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_votes_voter_id ON votes(voter_id);
CREATE INDEX IF NOT EXISTS idx_votes_event_id ON votes(event_id);
CREATE INDEX IF NOT EXISTS idx_votes_category_id ON votes(category_id);
CREATE INDEX IF NOT EXISTS idx_votes_candidate_id ON votes(candidate_id);
CREATE INDEX IF NOT EXISTS idx_votes_created_at ON votes(created_at DESC);

COMMENT ON TABLE votes IS 'Ballot submissions from voters (multiple votes per category allowed based on max_votes_per_voter)';

-- =============================================
-- TABLE: otp_codes
-- =============================================
CREATE TABLE IF NOT EXISTS otp_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    email TEXT,
    phone TEXT,
    code TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_used BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_otp_event_id ON otp_codes(event_id);
CREATE INDEX IF NOT EXISTS idx_otp_email ON otp_codes(email);
CREATE INDEX IF NOT EXISTS idx_otp_phone ON otp_codes(phone);
CREATE INDEX IF NOT EXISTS idx_otp_expires_at ON otp_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_otp_is_used ON otp_codes(is_used);

COMMENT ON TABLE otp_codes IS 'OTP codes for email/phone verification';
COMMENT ON COLUMN otp_codes.expires_at IS 'OTP expires after 5 minutes';

-- =============================================
-- TRIGGERS: Auto-update updated_at
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_candidates_updated_at ON candidates;
CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON candidates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_voters_updated_at ON voters;
CREATE TRIGGER update_voters_updated_at BEFORE UPDATE ON voters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_votes_updated_at ON votes;
CREATE TRIGGER update_votes_updated_at BEFORE UPDATE ON votes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE voters ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view active events" ON events;
DROP POLICY IF EXISTS "Public can view categories" ON categories;
DROP POLICY IF EXISTS "Public can view candidates" ON candidates;
DROP POLICY IF EXISTS "Anyone can create voter" ON voters;
DROP POLICY IF EXISTS "Anyone can view voters" ON voters;
DROP POLICY IF EXISTS "Anyone can update voters" ON voters;
DROP POLICY IF EXISTS "Anyone can view votes" ON votes;
DROP POLICY IF EXISTS "Anyone can insert votes" ON votes;
DROP POLICY IF EXISTS "Anyone can create OTP" ON otp_codes;
DROP POLICY IF EXISTS "Anyone can read OTP for verification" ON otp_codes;
DROP POLICY IF EXISTS "Anyone can verify OTP" ON otp_codes;

-- Anyone can view active events
CREATE POLICY "Public can view active events"
ON events FOR SELECT
TO public
USING (is_active = true);

-- Anyone can view categories for active events
CREATE POLICY "Public can view categories"
ON categories FOR SELECT
TO public
USING (
    EXISTS (
        SELECT 1 FROM events
        WHERE events.id = categories.event_id
        AND events.is_active = true
    )
);

-- Anyone can view candidates for active events
CREATE POLICY "Public can view candidates"
ON candidates FOR SELECT
TO public
USING (
    EXISTS (
        SELECT 1 FROM categories
        JOIN events ON events.id = categories.event_id
        WHERE candidates.category_id = categories.id
        AND events.is_active = true
    )
);

-- Voters policies
CREATE POLICY "Anyone can create voter"
ON voters FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can view voters"
ON voters FOR SELECT
TO public
USING (true);

CREATE POLICY "Anyone can update voters"
ON voters FOR UPDATE
TO public
USING (true);

-- Votes policies
CREATE POLICY "Anyone can view votes"
ON votes FOR SELECT
TO public
USING (true);

CREATE POLICY "Anyone can insert votes"
ON votes FOR INSERT
TO public
WITH CHECK (true);

-- OTP policies
CREATE POLICY "Anyone can create OTP"
ON otp_codes FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can read OTP for verification"
ON otp_codes FOR SELECT
TO public
USING (is_used = false AND expires_at > NOW());

CREATE POLICY "Anyone can verify OTP"
ON otp_codes FOR UPDATE
TO public
USING (is_used = false);

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Get vote count for candidate
CREATE OR REPLACE FUNCTION get_vote_count(candidate_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)::INTEGER
        FROM votes
        WHERE candidate_id = candidate_uuid
    );
END;
$$ LANGUAGE plpgsql;

-- Check if voting is open
CREATE OR REPLACE FUNCTION is_voting_open(event_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT EXISTS (
            SELECT 1 FROM events
            WHERE id = event_uuid
            AND is_active = true
            AND NOW() BETWEEN voting_start_time AND voting_end_time
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Cleanup expired OTPs
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS void AS $$
BEGIN
    DELETE FROM otp_codes
    WHERE expires_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- STORAGE BUCKET (Run in Storage section)
-- =============================================
-- Note: Run this in Supabase Dashboard > Storage
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('candidate-photos', 'candidate-photos', true);

-- =============================================
-- COMPLETED
-- =============================================
-- Schema creation completed successfully!
-- Next steps:
-- 1. Run seed data script (supabase-seed.sql)
-- 2. Test connection from Next.js app
-- 3. Generate TypeScript types
