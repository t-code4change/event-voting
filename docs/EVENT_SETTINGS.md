# Event Voting Settings

## Overview
Event voting behavior can be configured through the `settings` JSONB column in the `events` table. This allows flexible control over when and how voting is allowed.

## Settings Structure

The voting settings are stored in the `events.settings.voting` object:

```json
{
  "settings": {
    "voting": {
      "is_require_otp": false,
      "allow_vote_before_start_date": true,
      "allow_vote_after_end_date": true,
      "allow_edit_before_deadline": true
    }
  }
}
```

## Available Settings

### `is_require_otp` (boolean, default: false)
- **Description**: Require OTP verification for voting
- **Values**:
  - `true`: Users must verify their phone/email with OTP before voting
  - `false`: Users can vote without OTP verification (quick login)
- **Current Status**: Not yet implemented in API

### `allow_vote_before_start_date` (boolean, default: true)
- **Description**: Allow voting before the official start time
- **Values**:
  - `true`: Users can vote anytime, even before `voting_start_time`
  - `false`: Voting is blocked until `voting_start_time` is reached
- **API Behavior**:
  - When `false` and current time < start time: Returns "Bình chọn chưa bắt đầu" (400 error)
  - When `true`: Voting allowed regardless of start time

### `allow_vote_after_end_date` (boolean, default: true)
- **Description**: Allow voting after the official end time
- **Values**:
  - `true`: Users can continue voting after `voting_end_time`
  - `false`: Voting is blocked after `voting_end_time` is reached
- **API Behavior**:
  - When `false` and current time > end time: Returns "Bình chọn đã kết thúc" (400 error)
  - When `true`: Voting allowed even after end time

### `allow_edit_before_deadline` (boolean, default: true)
- **Description**: Allow users to change their votes before the deadline
- **Values**:
  - `true`: Users can modify their votes multiple times
  - `false`: Once voted, users cannot change their selection
- **API Behavior**:
  - When `false` and user already voted: Returns "Bạn đã bình chọn rồi và không thể sửa đổi" (400 error)
  - When `true`: Previous votes are deleted and replaced with new votes

## Use Cases

### Case 1: Strict Voting Window
For events that need strict control over voting times:
```json
{
  "allow_vote_before_start_date": false,
  "allow_vote_after_end_date": false
}
```
**Result**: Voting only allowed between `voting_start_time` and `voting_end_time`

### Case 2: Demo/Testing Mode (Current GLOW UP 2025 Settings)
For demos, testing, or flexible events:
```json
{
  "allow_vote_before_start_date": true,
  "allow_vote_after_end_date": true,
  "allow_edit_before_deadline": true
}
```
**Result**: Voting always allowed, users can change votes anytime

### Case 3: Early Voting, No Late Voting
Allow pre-registration voting but enforce deadline:
```json
{
  "allow_vote_before_start_date": true,
  "allow_vote_after_end_date": false
}
```
**Result**: Can vote early, but blocked after end time

### Case 4: One-Time Voting
Prevent users from changing their minds:
```json
{
  "allow_vote_before_start_date": false,
  "allow_vote_after_end_date": false,
  "allow_edit_before_deadline": false
}
```
**Result**: Strict voting window, votes are final once submitted

## Updating Settings

### Via SQL (Supabase Dashboard)
```sql
UPDATE events
SET settings = jsonb_set(
  COALESCE(settings, '{}'::jsonb),
  '{voting}',
  '{
    "is_require_otp": false,
    "allow_vote_before_start_date": true,
    "allow_vote_after_end_date": true,
    "allow_edit_before_deadline": true
  }'::jsonb
)
WHERE id = 'd112584a-4c6e-47fa-a4da-df1e3488d374';
```

### Via Script (TypeScript)
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

await supabase
  .from('events')
  .update({
    settings: {
      ...existingSettings,
      voting: {
        is_require_otp: false,
        allow_vote_before_start_date: true,
        allow_vote_after_end_date: true,
        allow_edit_before_deadline: true
      }
    }
  })
  .eq('id', eventId)
```

## API Implementation

The settings are checked in `/app/api/votes/submit/route.ts`:

```typescript
// Extract voting settings from JSONB column
const votingSettings = event.settings?.voting || {
  allow_vote_before_start_date: true,
  allow_vote_after_end_date: true,
  is_require_otp: false
}

// Check voting start time (only if allow_vote_before_start_date is false)
if (!votingSettings.allow_vote_before_start_date && now < startTime) {
  return NextResponse.json(
    { message: "Bình chọn chưa bắt đầu" },
    { status: 400 }
  )
}

// Check voting end time (only if allow_vote_after_end_date is false)
if (!votingSettings.allow_vote_after_end_date && now > endTime) {
  return NextResponse.json(
    { message: "Bình chọn đã kết thúc" },
    { status: 400 }
  )
}
```

## Default Behavior

If `settings.voting` is not set or missing, the API uses these defaults:
- `allow_vote_before_start_date`: `true` (most permissive)
- `allow_vote_after_end_date`: `true` (most permissive)
- `allow_edit_before_deadline`: `true` (most permissive)
- `is_require_otp`: `false`

This ensures backward compatibility and prevents blocking votes if settings are not configured.
