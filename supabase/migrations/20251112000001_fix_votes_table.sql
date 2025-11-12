-- =============================================
-- FIX VOTES TABLE - ADD MISSING COLUMNS
-- Migration: 20251112000001
-- Description: Add event_id and updated_at columns to votes table
-- =============================================

-- Add event_id column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'votes' AND column_name = 'event_id'
  ) THEN
    -- Add the column
    ALTER TABLE votes
    ADD COLUMN event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE;

    -- Create index
    CREATE INDEX IF NOT EXISTS idx_votes_event_id ON votes(event_id);

    COMMENT ON COLUMN votes.event_id IS 'Reference to the event this vote belongs to';

    RAISE NOTICE 'Added event_id column to votes table';
  ELSE
    RAISE NOTICE 'event_id column already exists in votes table';
  END IF;
END $$;

-- Add updated_at column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'votes' AND column_name = 'updated_at'
  ) THEN
    -- Add the column
    ALTER TABLE votes
    ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

    COMMENT ON COLUMN votes.updated_at IS 'Timestamp when vote was last updated';

    RAISE NOTICE 'Added updated_at column to votes table';
  ELSE
    RAISE NOTICE 'updated_at column already exists in votes table';
  END IF;
END $$;

-- Ensure trigger exists for updated_at
DROP TRIGGER IF EXISTS update_votes_updated_at ON votes;
CREATE TRIGGER update_votes_updated_at BEFORE UPDATE ON votes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
