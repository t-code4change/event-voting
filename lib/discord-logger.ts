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

  // Page view events - Main app pages
  pageViewHome: async (userEmail?: string) => {
    await logToDiscord('Home Page View', {
      User: userEmail || 'Anonymous',
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'INFO')
  },

  pageViewPricing: async (userEmail?: string) => {
    await logToDiscord('Pricing Page View', {
      User: userEmail || 'Anonymous',
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'INFO')
  },

  pageViewContact: async (userEmail?: string) => {
    await logToDiscord('Contact Page View', {
      User: userEmail || 'Anonymous',
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'INFO')
  },

  pageViewGuide: async (userEmail?: string) => {
    await logToDiscord('Guide Page View', {
      User: userEmail || 'Anonymous',
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'INFO')
  },

  pageViewAbout: async (userEmail?: string) => {
    await logToDiscord('About Page View', {
      User: userEmail || 'Anonymous',
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'INFO')
  },

  pageViewBlog: async (userEmail?: string, slug?: string) => {
    await logToDiscord('Blog Page View', {
      User: userEmail || 'Anonymous',
      ...(slug && { Article: slug }),
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'INFO')
  },

  pageViewFAQ: async (userEmail?: string) => {
    await logToDiscord('FAQ Page View', {
      User: userEmail || 'Anonymous',
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'INFO')
  },

  pageViewCaseStudies: async (userEmail?: string) => {
    await logToDiscord('Case Studies Page View', {
      User: userEmail || 'Anonymous',
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'INFO')
  },

  // Event pages view events
  pageViewEventWelcome: async (eventId: string, eventName: string, userEmail?: string) => {
    await logToDiscord('Event Welcome Screen View', {
      'Event ID': eventId,
      'Event Name': eventName,
      User: userEmail || 'Anonymous',
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'INFO')
  },

  pageViewEventWaiting: async (eventId: string, eventName: string, userEmail?: string) => {
    await logToDiscord('Event Waiting Room View', {
      'Event ID': eventId,
      'Event Name': eventName,
      User: userEmail || 'Anonymous',
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'INFO')
  },

  pageViewEventCheckIn: async (eventId: string, eventName: string, userEmail?: string) => {
    await logToDiscord('Event Check-in Page View', {
      'Event ID': eventId,
      'Event Name': eventName,
      User: userEmail || 'Anonymous',
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'INFO')
  },

  pageViewEventVote: async (eventId: string, eventName: string, userEmail?: string) => {
    await logToDiscord('Event Voting Page View', {
      'Event ID': eventId,
      'Event Name': eventName,
      User: userEmail || 'Anonymous',
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'INFO')
  },

  pageViewEventResults: async (eventId: string, eventName: string, userEmail?: string) => {
    await logToDiscord('Event Results Page View', {
      'Event ID': eventId,
      'Event Name': eventName,
      User: userEmail || 'Anonymous',
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'INFO')
  },

  pageViewEventLive: async (eventId: string, eventName: string, userEmail?: string) => {
    await logToDiscord('Event Live Page View', {
      'Event ID': eventId,
      'Event Name': eventName,
      User: userEmail || 'Anonymous',
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'INFO')
  },

  // Admin pages view events
  pageViewAdminDashboard: async (userEmail: string) => {
    await logToDiscord('Admin Dashboard View', {
      User: userEmail,
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'INFO')
  },

  pageViewAdminEvents: async (userEmail: string) => {
    await logToDiscord('Admin Events Page View', {
      User: userEmail,
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'INFO')
  },

  pageViewAdminCategories: async (userEmail: string) => {
    await logToDiscord('Admin Categories Page View', {
      User: userEmail,
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'INFO')
  },

  pageViewAdminCandidates: async (userEmail: string) => {
    await logToDiscord('Admin Candidates Page View', {
      User: userEmail,
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'INFO')
  },

  pageViewAdminResults: async (userEmail: string) => {
    await logToDiscord('Admin Results Page View', {
      User: userEmail,
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'INFO')
  },

  pageViewAdminSettings: async (userEmail: string) => {
    await logToDiscord('Admin Settings Page View', {
      User: userEmail,
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'INFO')
  },

  pageViewAdminAnalytics: async (userEmail: string) => {
    await logToDiscord('Admin Analytics Page View', {
      User: userEmail,
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'INFO')
  },

  pageViewAdminPackages: async (userEmail: string) => {
    await logToDiscord('Admin Packages Page View', {
      User: userEmail,
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'INFO')
  },

  pageViewAdminSubscriptions: async (userEmail: string) => {
    await logToDiscord('Admin Subscriptions Page View', {
      User: userEmail,
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'INFO')
  },

  pageViewAdminInvoices: async (userEmail: string) => {
    await logToDiscord('Admin Invoices Page View', {
      User: userEmail,
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'INFO')
  },

  // User action events - Homepage buttons
  buttonClickCreateEvent: async (userEmail?: string) => {
    await logToDiscord('Button Click: Create Event', {
      User: userEmail || 'Anonymous',
      Page: 'Home',
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'USER_ACTION')
  },

  buttonClickViewDemo: async (userEmail?: string, demoEventId?: string) => {
    await logToDiscord('Button Click: View Demo', {
      User: userEmail || 'Anonymous',
      Page: 'Home',
      ...(demoEventId && { 'Demo Event ID': demoEventId }),
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'USER_ACTION')
  },

  buttonClickJoinEvent: async (eventCode: string, userEmail?: string) => {
    await logToDiscord('Button Click: Join Event', {
      'Event Code': eventCode,
      User: userEmail || 'Anonymous',
      Page: 'Home',
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'USER_ACTION')
  },

  buttonClickViewGuide: async (userEmail?: string) => {
    await logToDiscord('Button Click: View Guide', {
      User: userEmail || 'Anonymous',
      Page: 'Home',
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'USER_ACTION')
  },

  // Contact form events
  contactFormSubmit: async (
    name: string,
    email: string,
    phone: string,
    requestType: string,
    message: string
  ) => {
    await logToDiscord('Contact Form Submitted', {
      Name: name,
      Email: email,
      Phone: phone || 'Not provided',
      'Request Type': requestType,
      Message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'USER_ACTION')
  },

  // Event actions - Check-in
  eventCheckInSuccess: async (
    eventId: string,
    eventName: string,
    guestIdentifier: string,
    authenticationType: 'phone' | 'code'
  ) => {
    await logToDiscord('Event Check-in Success', {
      'Event ID': eventId,
      'Event Name': eventName,
      'Guest': `${authenticationType}: ${guestIdentifier}`,
      'Auth Method': authenticationType,
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'SUCCESS')
  },

  // Voting actions
  voteUpdate: async (
    eventId: string,
    eventName: string,
    voterId: string,
    categoriesCount: number,
    totalVotes: number
  ) => {
    await logToDiscord('Vote Updated', {
      'Event ID': eventId,
      'Event Name': eventName,
      'Voter ID': voterId,
      'Categories': categoriesCount.toString(),
      'Total Votes': totalVotes.toString(),
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'USER_ACTION')
  },

  // Admin actions - Event management
  adminEventCreate: async (
    eventId: string,
    eventName: string,
    userEmail: string,
    eventDate?: string
  ) => {
    await logToDiscord('Admin: Event Created', {
      'Event ID': eventId,
      'Event Name': eventName,
      'Created By': userEmail,
      ...(eventDate && { 'Event Date': eventDate }),
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'SUCCESS')
  },

  adminEventUpdate: async (
    eventId: string,
    eventName: string,
    userEmail: string,
    changes: string
  ) => {
    await logToDiscord('Admin: Event Updated', {
      'Event ID': eventId,
      'Event Name': eventName,
      'Updated By': userEmail,
      Changes: changes,
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'INFO')
  },

  adminEventDelete: async (
    eventId: string,
    eventName: string,
    userEmail: string
  ) => {
    await logToDiscord('Admin: Event Deleted', {
      'Event ID': eventId,
      'Event Name': eventName,
      'Deleted By': userEmail,
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'WARNING')
  },

  // Admin actions - Category management
  adminCategoryCreate: async (
    categoryId: string,
    categoryName: string,
    eventId: string,
    userEmail: string
  ) => {
    await logToDiscord('Admin: Category Created', {
      'Category ID': categoryId,
      'Category Name': categoryName,
      'Event ID': eventId,
      'Created By': userEmail,
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'SUCCESS')
  },

  adminCategoryUpdate: async (
    categoryId: string,
    categoryName: string,
    userEmail: string
  ) => {
    await logToDiscord('Admin: Category Updated', {
      'Category ID': categoryId,
      'Category Name': categoryName,
      'Updated By': userEmail,
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'INFO')
  },

  adminCategoryDelete: async (
    categoryId: string,
    categoryName: string,
    userEmail: string
  ) => {
    await logToDiscord('Admin: Category Deleted', {
      'Category ID': categoryId,
      'Category Name': categoryName,
      'Deleted By': userEmail,
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'WARNING')
  },

  // Admin actions - Candidate management
  adminCandidateCreate: async (
    candidateId: string,
    candidateName: string,
    categoryName: string,
    userEmail: string
  ) => {
    await logToDiscord('Admin: Candidate Created', {
      'Candidate ID': candidateId,
      'Candidate Name': candidateName,
      Category: categoryName,
      'Created By': userEmail,
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'SUCCESS')
  },

  adminCandidateUpdate: async (
    candidateId: string,
    candidateName: string,
    userEmail: string
  ) => {
    await logToDiscord('Admin: Candidate Updated', {
      'Candidate ID': candidateId,
      'Candidate Name': candidateName,
      'Updated By': userEmail,
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'INFO')
  },

  adminCandidateDelete: async (
    candidateId: string,
    candidateName: string,
    userEmail: string
  ) => {
    await logToDiscord('Admin: Candidate Deleted', {
      'Candidate ID': candidateId,
      'Candidate Name': candidateName,
      'Deleted By': userEmail,
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'WARNING')
  },

  // Admin actions - Settings
  adminSettingsUpdate: async (
    settingName: string,
    newValue: string,
    userEmail: string
  ) => {
    await logToDiscord('Admin: Settings Updated', {
      Setting: settingName,
      'New Value': newValue,
      'Updated By': userEmail,
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'INFO')
  },

  // Newsletter subscription
  newsletterSubscribe: async (email: string, source?: string) => {
    await logToDiscord('Newsletter Subscription', {
      Email: email,
      Source: source || 'Unknown',
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'SUCCESS')
  },

  // Authentication - Guest login
  guestAuthSuccess: async (
    eventId: string,
    eventName: string,
    identifier: string,
    authType: 'phone' | 'code'
  ) => {
    await logToDiscord('Guest Authentication Success', {
      'Event ID': eventId,
      'Event Name': eventName,
      Identifier: identifier,
      'Auth Type': authType,
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'SUCCESS')
  },

  // Admin login/logout
  adminLogin: async (email: string) => {
    await logToDiscord('Admin Login', {
      Email: email,
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'SUCCESS')
  },

  adminLogout: async (email: string) => {
    await logToDiscord('Admin Logout', {
      Email: email,
      Timestamp: new Date().toLocaleString('vi-VN'),
    }, 'INFO')
  },
}

// Export for direct use
export default DiscordLogger
