/**
 * Discord Logging Service
 * Gửi notifications về Discord webhook khi có các events quan trọng
 */

interface DiscordWebhookPayload {
  content?: string
  embeds?: Array<{
    title?: string
    description?: string
    color?: number
    fields?: Array<{
      name: string
      value: string
      inline?: boolean
    }>
    timestamp?: string
    footer?: {
      text: string
    }
  }>
}

// Discord webhook URL (set trong .env.local)
const DISCORD_WEBHOOK_URL = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/1437116551575900311/GP56PD_a7eiC8qTa7HQuxhfl-d5rPOgg3iXLkfHxRIuvZ5JuIjh_oXP6D5wud7kqXk18'

// Check if running in production environment
const isProduction = process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'

// Color codes for different event types
const EventColors = {
  INFO: 0x3498db,      // Blue
  SUCCESS: 0x2ecc71,   // Green
  WARNING: 0xf39c12,   // Orange
  ERROR: 0xe74c3c,     // Red
  USER_ACTION: 0x9b59b6, // Purple
  PAYMENT: 0xf1c40f,   // Gold
}

/**
 * Log user action to Discord
 */
export async function logToDiscord(
  action: string,
  details: Record<string, any> = {},
  type: keyof typeof EventColors = 'INFO'
) {
  // Skip if not in production environment
  if (!isProduction) {
    console.log(`[Discord Logger - DEV] ${action}:`, details)
    return
  }

  // Skip if webhook URL not configured
  if (!DISCORD_WEBHOOK_URL) {
    console.warn('Discord webhook URL not configured')
    return
  }

  try {
    const fields = Object.entries(details).map(([key, value]) => ({
      name: key,
      value: String(value),
      inline: true,
    }))

    const payload: DiscordWebhookPayload = {
      embeds: [
        {
          title: `🎯 ${action}`,
          color: EventColors[type],
          fields,
          timestamp: new Date().toISOString(),
          footer: {
            text: 'Bright4Event Event Tracking',
          },
        },
      ],
    }

    await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  } catch (error) {
    console.error('Failed to log to Discord:', error)
  }
}

/**
 * Helper functions for common events
 */

export const DiscordLogger = {
  // User authentication events
  userLogin: async (email: string, method: 'email' | 'google' = 'email') => {
    await logToDiscord('User Login', {
      Email: email,
      Method: method,
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'SUCCESS')
  },

  userRegister: async (email: string, method: 'email' | 'google' = 'email') => {
    await logToDiscord('New User Registration', {
      Email: email,
      Method: method,
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'SUCCESS')
  },

  userLogout: async (email: string) => {
    await logToDiscord('User Logout', {
      Email: email,
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'INFO')
  },

  // Page view events
  pageView: async (page: string, userEmail?: string) => {
    await logToDiscord('Page View', {
      Page: page,
      User: userEmail || 'Anonymous',
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'INFO')
  },

  // Event actions
  eventJoin: async (eventId: string, eventName: string, userEmail?: string) => {
    await logToDiscord('User Joined Event', {
      'Event ID': eventId,
      'Event Name': eventName,
      User: userEmail || 'Anonymous',
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'USER_ACTION')
  },

  eventCreate: async (eventId: string, eventName: string, userEmail: string) => {
    await logToDiscord('New Event Created', {
      'Event ID': eventId,
      'Event Name': eventName,
      'Created By': userEmail,
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'SUCCESS')
  },

  eventView: async (eventId: string, eventName: string, userEmail?: string) => {
    await logToDiscord('Event Viewed', {
      'Event ID': eventId,
      'Event Name': eventName,
      User: userEmail || 'Anonymous',
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'INFO')
  },

  // Voting actions
  voteSubmit: async (
    eventId: string,
    categoryName: string,
    candidateName: string,
    userEmail?: string
  ) => {
    await logToDiscord('Vote Submitted', {
      'Event ID': eventId,
      Category: categoryName,
      Candidate: candidateName,
      User: userEmail || 'Anonymous',
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'USER_ACTION')
  },

  // Payment events
  paymentInitiated: async (
    planName: string,
    amount: string,
    userEmail: string,
    needInvoice: boolean
  ) => {
    await logToDiscord('Payment Initiated', {
      Plan: planName,
      Amount: amount,
      User: userEmail,
      'Invoice Required': needInvoice ? 'Yes' : 'No',
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'PAYMENT')
  },

  paymentConfirmed: async (planName: string, amount: string, userEmail: string) => {
    await logToDiscord('Payment Confirmed', {
      Plan: planName,
      Amount: amount,
      User: userEmail,
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'SUCCESS')
  },

  // Error events
  error: async (errorMessage: string, context: Record<string, any> = {}) => {
    await logToDiscord('Error Occurred', {
      Error: errorMessage,
      ...context,
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'ERROR')
  },

  // Custom event
  custom: async (
    eventName: string,
    details: Record<string, any>,
    type: keyof typeof EventColors = 'INFO'
  ) => {
    await logToDiscord(eventName, {
      ...details,
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, type)
  },
}

// Export for direct use
export default DiscordLogger
