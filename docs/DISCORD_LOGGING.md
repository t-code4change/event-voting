# Discord Logging System Documentation

## Overview

The Discord Logging System provides real-time notifications to a Discord channel whenever important events occur in the Bright4Event platform. This helps track user activity, monitor system health, and get immediate insights into how users interact with the platform.

## Features

- ✅ **Real-time notifications** to Discord webhook
- ✅ **Color-coded messages** based on event type
- ✅ **Automatic timestamp** in Vietnamese timezone
- ✅ **Environment-aware** (production only by default)
- ✅ **Comprehensive event coverage** - 50+ event types
- ✅ **Structured data** with custom fields for each event

## Configuration

### Environment Variables

Add the following to your `.env.local` file:

```env
NEXT_PUBLIC_DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN
NEXT_PUBLIC_VERCEL_ENV=production  # Optional: Set to 'production' to enable logging
NODE_ENV=production  # Or set this to 'production'
```

### Getting a Discord Webhook URL

1. Open Discord and navigate to your server
2. Go to Server Settings > Integrations > Webhooks
3. Click "New Webhook" or select an existing one
4. Copy the Webhook URL
5. Add it to your environment variables

## Event Types & Color Codes

The system uses color-coded embeds to differentiate event types:

| Event Type | Color | Hex Code | Usage |
|------------|-------|----------|-------|
| INFO | Blue | `#3498db` | General information, page views |
| SUCCESS | Green | `#2ecc71` | Successful operations (login, registration, check-in) |
| WARNING | Orange | `#f39c12` | Deletions, important changes |
| ERROR | Red | `#e74c3c` | Errors and failures |
| USER_ACTION | Purple | `#9b59b6` | User interactions (votes, button clicks) |
| PAYMENT | Gold | `#f1c40f` | Payment-related events |

## Available Events

### 1. Page View Events

#### Main App Pages
- `pageViewHome` - Home page view
- `pageViewPricing` - Pricing page view
- `pageViewContact` - Contact page view
- `pageViewGuide` - Guide page view
- `pageViewAbout` - About page view
- `pageViewBlog` - Blog page view (with optional article slug)
- `pageViewFAQ` - FAQ page view
- `pageViewCaseStudies` - Case studies page view

#### Event Pages
- `pageViewEventWelcome` - Event welcome screen
- `pageViewEventWaiting` - Event waiting room
- `pageViewEventCheckIn` - Event check-in page
- `pageViewEventVote` - Event voting page
- `pageViewEventResults` - Event results page
- `pageViewEventLive` - Event live page

#### Admin Pages
- `pageViewAdminDashboard` - Admin dashboard
- `pageViewAdminEvents` - Admin events management
- `pageViewAdminCategories` - Admin categories management
- `pageViewAdminCandidates` - Admin candidates management
- `pageViewAdminResults` - Admin results page
- `pageViewAdminSettings` - Admin settings page
- `pageViewAdminAnalytics` - Admin analytics page
- `pageViewAdminPackages` - Admin packages management
- `pageViewAdminSubscriptions` - Admin subscriptions list
- `pageViewAdminInvoices` - Admin invoices list

### 2. User Authentication Events
- `userLogin` - User login (email or Google)
- `userRegister` - New user registration
- `userLogout` - User logout
- `adminLogin` - Admin login
- `adminLogout` - Admin logout
- `guestAuthSuccess` - Guest authentication for events

### 3. User Action Events

#### Homepage Actions
- `buttonClickCreateEvent` - Create event button clicked
- `buttonClickViewDemo` - View demo button clicked
- `buttonClickJoinEvent` - Join event button clicked
- `buttonClickViewGuide` - View guide button clicked

#### Contact & Newsletter
- `contactFormSubmit` - Contact form submitted
- `newsletterSubscribe` - Newsletter subscription

### 4. Event Actions
- `eventJoin` - User joined an event
- `eventCreate` - New event created
- `eventView` - Event viewed
- `eventCheckInSuccess` - Successful check-in
- `voteSubmit` - Vote submitted (legacy)
- `voteUpdate` - Vote updated

### 5. Admin Actions

#### Event Management
- `adminEventCreate` - Admin created event
- `adminEventUpdate` - Admin updated event
- `adminEventDelete` - Admin deleted event

#### Category Management
- `adminCategoryCreate` - Admin created category
- `adminCategoryUpdate` - Admin updated category
- `adminCategoryDelete` - Admin deleted category

#### Candidate Management
- `adminCandidateCreate` - Admin created candidate
- `adminCandidateUpdate` - Admin updated candidate
- `adminCandidateDelete` - Admin deleted candidate

#### Settings
- `adminSettingsUpdate` - Admin updated settings

### 6. Payment Events
- `paymentInitiated` - Payment process started
- `paymentConfirmed` - Payment confirmed

### 7. Error Events
- `error` - General error logging

### 8. Custom Events
- `custom` - Custom event with flexible fields

## Usage Examples

### Page View Tracking

```typescript
import DiscordLogger from '@/lib/discord-logger'

// In a page component
useEffect(() => {
  DiscordLogger.pageViewHome(user?.email)
}, [])

// Event page with details
useEffect(() => {
  if (eventId && eventName) {
    DiscordLogger.pageViewEventVote(eventId, eventName, user?.email)
  }
}, [eventId, eventName, user])
```

### Button Click Tracking

```typescript
import DiscordLogger from '@/lib/discord-logger'

const handleCreateEvent = () => {
  // Log the button click
  DiscordLogger.buttonClickCreateEvent(user?.email)

  // Navigate to dashboard
  router.push('/admin/dashboard')
}

const handleJoinEvent = (eventCode: string) => {
  // Log join event action
  DiscordLogger.buttonClickJoinEvent(eventCode, user?.email)

  // Navigate to event
  router.push(`/event/${eventCode}`)
}
```

### Form Submission Tracking

```typescript
import DiscordLogger from '@/lib/discord-logger'

const handleContactFormSubmit = async (formData) => {
  try {
    // Log contact form submission
    await DiscordLogger.contactFormSubmit(
      formData.name,
      formData.email,
      formData.phone,
      formData.requestType,
      formData.message
    )

    // Submit to backend
    // ...
  } catch (error) {
    console.error(error)
  }
}
```

### Admin Actions Tracking

```typescript
import DiscordLogger from '@/lib/discord-logger'

// Event creation
const createEvent = async (eventData) => {
  const newEvent = await api.createEvent(eventData)

  await DiscordLogger.adminEventCreate(
    newEvent.id,
    newEvent.name,
    user.email,
    eventData.event_date
  )
}

// Category deletion
const deleteCategory = async (categoryId, categoryName) => {
  await api.deleteCategory(categoryId)

  await DiscordLogger.adminCategoryDelete(
    categoryId,
    categoryName,
    user.email
  )
}
```

### Vote Tracking

```typescript
import DiscordLogger from '@/lib/discord-logger'

const submitVotes = async (voterId: string) => {
  const votes = Object.entries(selectedVotes)

  await fetch('/api/votes/submit', {
    method: 'POST',
    body: JSON.stringify({ voter_id: voterId, event_id: eventId, votes })
  })

  // Log vote submission
  await DiscordLogger.voteUpdate(
    eventId,
    eventName,
    voterId,
    votes.length,
    votes.reduce((sum, [_, candidateIds]) => sum + candidateIds.length, 0)
  )
}
```

### Check-in Tracking

```typescript
import DiscordLogger from '@/lib/discord-logger'

const handleCheckIn = async (data: { type: 'phone' | 'code', value: string }) => {
  // Process check-in
  const response = await api.checkIn(eventId, data)

  if (response.success) {
    // Log successful check-in
    await DiscordLogger.eventCheckInSuccess(
      eventId,
      eventName,
      data.value,
      data.type
    )
  }
}
```

### Authentication Tracking

```typescript
import DiscordLogger from '@/lib/discord-logger'

// User login
const handleLogin = async (email: string, method: 'email' | 'google') => {
  const result = await signIn(email, method)

  if (result.success) {
    await DiscordLogger.userLogin(email, method)
  }
}

// Admin login
const handleAdminLogin = async (email: string) => {
  const result = await adminSignIn(email)

  if (result.success) {
    await DiscordLogger.adminLogin(email)
  }
}

// Guest authentication
const handleGuestAuth = async (eventId: string, identifier: string, type: 'phone' | 'code') => {
  const result = await guestAuth(eventId, identifier, type)

  if (result.success) {
    await DiscordLogger.guestAuthSuccess(
      eventId,
      eventName,
      identifier,
      type
    )
  }
}
```

### Error Tracking

```typescript
import DiscordLogger from '@/lib/discord-logger'

try {
  // Some operation
  await riskyOperation()
} catch (error) {
  // Log error to Discord
  await DiscordLogger.error(
    error instanceof Error ? error.message : 'Unknown error',
    {
      Page: 'Voting Page',
      'Event ID': eventId,
      'User': user?.email || 'Anonymous'
    }
  )
}
```

### Custom Events

```typescript
import DiscordLogger from '@/lib/discord-logger'

// Log a custom event with custom fields
await DiscordLogger.custom(
  'Feature Flag Toggled',
  {
    'Feature Name': 'live-voting',
    'Enabled': 'true',
    'Toggled By': user.email,
    'Event ID': eventId
  },
  'INFO'
)
```

## Best Practices

### 1. Always Handle Errors Gracefully
The Discord logger automatically catches and logs errors to console. Never let logging failures break your app.

```typescript
// ✅ Good - Logger handles errors internally
await DiscordLogger.pageViewHome(user?.email)

// ❌ Bad - Don't wrap in try-catch unless you need to
try {
  await DiscordLogger.pageViewHome(user?.email)
} catch (error) {
  // This will never execute - logger handles errors
}
```

### 2. Log User Email When Available
Always pass user email when available to track user journeys.

```typescript
// ✅ Good
DiscordLogger.pageViewHome(user?.email)

// ⚠️ Okay but less useful
DiscordLogger.pageViewHome()
```

### 3. Use Appropriate Event Types
Choose the right event type for better Discord notification organization.

```typescript
// ✅ Good - Uses SUCCESS for successful operations
DiscordLogger.userLogin(email, 'email')

// ✅ Good - Uses WARNING for deletions
DiscordLogger.adminEventDelete(eventId, eventName, userEmail)

// ✅ Good - Uses USER_ACTION for user interactions
DiscordLogger.buttonClickCreateEvent(userEmail)
```

### 4. Avoid Logging Sensitive Data
Never log passwords, tokens, or sensitive personal information.

```typescript
// ❌ Bad
DiscordLogger.custom('User Data', {
  password: userPassword,  // NEVER do this
  creditCard: cardNumber   // NEVER do this
})

// ✅ Good
DiscordLogger.custom('User Data', {
  email: userEmail,
  action: 'profile_updated'
})
```

### 5. Keep Messages Concise
Long messages are truncated. Keep details brief and relevant.

```typescript
// ✅ Good
DiscordLogger.contactFormSubmit(
  name,
  email,
  phone,
  requestType,
  message  // Automatically truncated to 100 chars
)

// ❌ Bad - Manual truncation not needed
DiscordLogger.custom('Long Message', {
  Content: veryLongText.substring(0, 1000)  // Don't do this
})
```

### 6. Use Environment Flags for Development
During development, check the console logs instead of spamming Discord.

```typescript
// lib/discord-logger.ts already handles this
const isProduction = process.env.NODE_ENV === 'production' ||
                     process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'

if (!isProduction) {
  console.log(`[Discord Logger - DEV] ${action}:`, details)
  return
}
```

## Testing in Development

To test Discord logging in development mode, temporarily override the environment check:

```typescript
// In lib/discord-logger.ts (for testing only)
const isProduction = true  // Force production mode for testing

// Don't forget to revert this after testing!
```

Or set the environment variable:
```bash
NODE_ENV=production npm run dev
```

## Monitoring & Analytics

### View Logs in Discord
1. Open your Discord server
2. Navigate to the channel where the webhook posts
3. View real-time notifications

### Common Patterns to Monitor
- **User Journey**: Track page views to understand user flow
- **Conversion Funnel**: Monitor button clicks and form submissions
- **Admin Activity**: Track all admin actions for audit purposes
- **Error Patterns**: Group error messages to identify issues
- **Event Engagement**: Monitor event participation and voting

## Troubleshooting

### Logs Not Appearing in Discord

**Check 1: Environment Variables**
```bash
# Verify webhook URL is set
echo $NEXT_PUBLIC_DISCORD_WEBHOOK_URL

# Verify environment is production
echo $NODE_ENV
echo $NEXT_PUBLIC_VERCEL_ENV
```

**Check 2: Webhook URL is Valid**
Test the webhook manually:
```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"content": "Test message"}'
```

**Check 3: Console Logs**
Check browser console or server logs for `[Discord Logger - DEV]` messages.

### Rate Limiting

Discord webhooks have rate limits:
- **30 requests per minute** per webhook
- **5 requests per second** burst

If you hit rate limits, consider:
1. Batching similar events
2. Using separate webhooks for different event types
3. Implementing client-side debouncing for frequent events

### Message Not Formatted Correctly

Ensure your data matches the expected structure:
```typescript
// ✅ Correct usage
await DiscordLogger.pageViewEventVote(
  "event-123",      // eventId (string)
  "GLOW UP 2025",   // eventName (string)
  "user@email.com"  // userEmail (optional string)
)

// ❌ Incorrect - wrong parameter order
await DiscordLogger.pageViewEventVote(
  "GLOW UP 2025",   // Wrong!
  "event-123",      // Wrong!
  "user@email.com"
)
```

## Advanced Usage

### Conditional Logging

```typescript
// Only log important admin actions in production
if (isProduction && isImportantAction) {
  await DiscordLogger.adminEventDelete(eventId, eventName, userEmail)
}
```

### Aggregated Logging

```typescript
// Batch multiple events
const logBatchEvents = async (events: Event[]) => {
  const summary = `Processed ${events.length} events`
  const eventNames = events.map(e => e.name).join(', ')

  await DiscordLogger.custom('Batch Processing Complete', {
    'Total Events': events.length.toString(),
    'Events': eventNames,
  }, 'SUCCESS')
}
```

### Integration with Analytics

```typescript
// Log to both Discord and analytics
const trackEvent = async (eventName: string, properties: any) => {
  // Log to Discord
  await DiscordLogger.custom(eventName, properties, 'USER_ACTION')

  // Log to analytics (e.g., Google Analytics, Mixpanel)
  analytics.track(eventName, properties)
}
```

## Migration Guide

If you're upgrading from an older version of the Discord logger, here's what changed:

### New Events Added
- All page view events (20+ events)
- Homepage button click events (4 events)
- Admin management events (15+ events)
- Check-in and guest auth events

### Updated Events
- `voteSubmit` → Consider using `voteUpdate` for better clarity
- Added `adminLogin` and `adminLogout` (separate from `userLogin`/`userLogout`)

### No Breaking Changes
All existing events remain functional. New events are additive only.

## File Structure

```
lib/
└── discord-logger.ts          # Main Discord logging service

docs/
├── DISCORD_LOGGING.md         # This documentation
└── DISCORD_IMPLEMENTATION.md  # Implementation examples
```

## API Reference

See [lib/discord-logger.ts](../lib/discord-logger.ts) for the complete API reference and TypeScript definitions.

## Support

For issues or questions:
1. Check the console for error messages
2. Verify environment variables are set correctly
3. Test webhook URL manually
4. Review this documentation

## License

Part of the Bright4Event platform. Internal use only.

---

**Last Updated:** 2025-01-14
**Version:** 2.0
**Maintainer:** Code4Change Team
