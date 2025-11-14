-- Create event_settings table
CREATE TABLE IF NOT EXISTS event_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL UNIQUE REFERENCES events(id) ON DELETE CASCADE,
  is_require_otp BOOLEAN DEFAULT false,
  allow_vote_before_start_date BOOLEAN DEFAULT true,
  allow_vote_after_end_date BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add index on event_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_event_settings_event_id ON event_settings(event_id);

-- Add RLS policies
ALTER TABLE event_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read event settings
CREATE POLICY "Anyone can view event settings"
  ON event_settings
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Policy: Only event owners can update settings
CREATE POLICY "Event owners can update settings"
  ON event_settings
  FOR UPDATE
  TO authenticated
  USING (
    event_id IN (
      SELECT id FROM events WHERE user_id = auth.uid()
    )
  );

-- Policy: Only event owners can insert settings
CREATE POLICY "Event owners can insert settings"
  ON event_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    event_id IN (
      SELECT id FROM events WHERE user_id = auth.uid()
    )
  );

-- Policy: Only event owners can delete settings
CREATE POLICY "Event owners can delete settings"
  ON event_settings
  FOR DELETE
  TO authenticated
  USING (
    event_id IN (
      SELECT id FROM events WHERE user_id = auth.uid()
    )
  );

-- Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_event_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER event_settings_updated_at
  BEFORE UPDATE ON event_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_event_settings_updated_at();

-- Insert default settings for existing events
INSERT INTO event_settings (event_id, is_require_otp, allow_vote_before_start_date, allow_vote_after_end_date)
SELECT
  id,
  false,
  true,
  true
FROM events
WHERE id NOT IN (SELECT event_id FROM event_settings);

COMMENT ON TABLE event_settings IS 'Event-specific settings for voting behavior';
COMMENT ON COLUMN event_settings.is_require_otp IS 'Require OTP verification for voting';
COMMENT ON COLUMN event_settings.allow_vote_before_start_date IS 'Allow voting before the official start time';
COMMENT ON COLUMN event_settings.allow_vote_after_end_date IS 'Allow voting after the official end time';
