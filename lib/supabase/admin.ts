/**
 * Supabase Admin Helper Functions
 * Direct database access for admin operations
 * Using Supabase Client (no API routes needed)
 */

import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'

type Tables = Database['public']['Tables']

// =============================================
// EVENTS
// =============================================

export const adminEvents = {
  /**
   * Get all events
   */
  async getAll() {
    const supabase = createClient()
    return await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })
  },

  /**
   * Get event by ID
   */
  async getById(id: string) {
    const supabase = createClient()
    return await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()
  },

  /**
   * Create new event
   */
  async create(data: Tables['events']['Insert']) {
    const supabase = createClient()
    return await supabase
      .from('events')
      .insert(data)
      .select()
      .single()
  },

  /**
   * Update event
   */
  async update(id: string, data: Tables['events']['Update']) {
    const supabase = createClient()
    return await supabase
      .from('events')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  },

  /**
   * Delete event
   */
  async delete(id: string) {
    const supabase = createClient()
    return await supabase
      .from('events')
      .delete()
      .eq('id', id)
  },

  /**
   * Toggle active status
   */
  async toggleActive(id: string) {
    const supabase = createClient()
    const { data: event } = await supabase
      .from('events')
      .select('is_active')
      .eq('id', id)
      .single()

    if (!event) return { data: null, error: new Error('Event not found') }

    return await supabase
      .from('events')
      .update({ is_active: !event.is_active })
      .eq('id', id)
      .select()
      .single()
  },
}

// =============================================
// CATEGORIES
// =============================================

export const adminCategories = {
  /**
   * Get all categories
   */
  async getAll() {
    const supabase = createClient()
    return await supabase
      .from('categories')
      .select('*, events(*)')
      .order('order', { ascending: true })
  },

  /**
   * Get categories by event
   */
  async getByEvent(eventId: string) {
    const supabase = createClient()
    return await supabase
      .from('categories')
      .select('*')
      .eq('event_id', eventId)
      .order('order', { ascending: true })
  },

  /**
   * Get category by ID
   */
  async getById(id: string) {
    const supabase = createClient()
    return await supabase
      .from('categories')
      .select('*, events(*)')
      .eq('id', id)
      .single()
  },

  /**
   * Create category
   */
  async create(data: Tables['categories']['Insert']) {
    const supabase = createClient()
    return await supabase
      .from('categories')
      .insert(data)
      .select()
      .single()
  },

  /**
   * Update category
   */
  async update(id: string, data: Tables['categories']['Update']) {
    const supabase = createClient()
    return await supabase
      .from('categories')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  },

  /**
   * Delete category
   */
  async delete(id: string) {
    const supabase = createClient()
    return await supabase
      .from('categories')
      .delete()
      .eq('id', id)
  },

  /**
   * Reorder categories
   */
  async reorder(updates: { id: string; order: number }[]) {
    const supabase = createClient()
    const promises = updates.map(({ id, order }) =>
      supabase.from('categories').update({ order }).eq('id', id)
    )
    return await Promise.all(promises)
  },
}

// =============================================
// CANDIDATES
// =============================================

export const adminCandidates = {
  /**
   * Get all candidates with category info
   */
  async getAll() {
    const supabase = createClient()
    return await supabase
      .from('candidates')
      .select(`
        *,
        categories!inner (
          id,
          name,
          event_id,
          events!inner (
            id,
            name,
            is_active
          )
        )
      `)
      .order('created_at', { ascending: false })
  },

  /**
   * Get candidates by category
   */
  async getByCategory(categoryId: string) {
    const supabase = createClient()
    return await supabase
      .from('candidates')
      .select('*')
      .eq('category_id', categoryId)
      .order('order', { ascending: true })
  },

  /**
   * Get candidate by ID
   */
  async getById(id: string) {
    const supabase = createClient()
    return await supabase
      .from('candidates')
      .select('*, categories(*)')
      .eq('id', id)
      .single()
  },

  /**
   * Create candidate
   */
  async create(data: Tables['candidates']['Insert']) {
    const supabase = createClient()
    return await supabase
      .from('candidates')
      .insert(data)
      .select()
      .single()
  },

  /**
   * Update candidate
   */
  async update(id: string, data: Tables['candidates']['Update']) {
    const supabase = createClient()
    return await supabase
      .from('candidates')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  },

  /**
   * Delete candidate
   */
  async delete(id: string) {
    const supabase = createClient()
    return await supabase
      .from('candidates')
      .delete()
      .eq('id', id)
  },

  /**
   * Reorder candidates
   */
  async reorder(updates: { id: string; order: number }[]) {
    const supabase = createClient()
    const promises = updates.map(({ id, order }) =>
      supabase.from('candidates').update({ order }).eq('id', id)
    )
    return await Promise.all(promises)
  },
}

// =============================================
// GUESTS
// =============================================

export const adminGuests = {
  /**
   * Get all guests for an event
   */
  async getByEvent(eventId: string) {
    const supabase = createClient()
    return await supabase
      .from('guests')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false })
  },

  /**
   * Get guest by ID
   */
  async getById(id: string) {
    const supabase = createClient()
    return await supabase
      .from('guests')
      .select('*')
      .eq('id', id)
      .single()
  },

  /**
   * Create guest
   */
  async create(data: Omit<Tables['guests']['Insert'], 'qr_code_data'>) {
    const supabase = createClient()
    // QR code will be auto-generated by trigger
    return await supabase
      .from('guests')
      .insert(data)
      .select()
      .single()
  },

  /**
   * Update guest
   */
  async update(id: string, data: Tables['guests']['Update']) {
    const supabase = createClient()
    return await supabase
      .from('guests')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  },

  /**
   * Delete guest
   */
  async delete(id: string) {
    const supabase = createClient()
    return await supabase
      .from('guests')
      .delete()
      .eq('id', id)
  },

  /**
   * Check-in guest
   */
  async checkIn(id: string, method: 'qr' | 'manual' | 'self' = 'manual') {
    const supabase = createClient()
    return await supabase
      .from('guests')
      .update({
        check_in_status: 'checked_in',
        check_in_time: new Date().toISOString(),
        check_in_method: method,
      })
      .eq('id', id)
      .select()
      .single()
  },

  /**
   * Get check-in stats
   */
  async getStats(eventId: string) {
    const supabase = createClient()
    const { data: guests } = await supabase
      .from('guests')
      .select('check_in_status')
      .eq('event_id', eventId)

    if (!guests) return { total: 0, checkedIn: 0, pending: 0 }

    return {
      total: guests.length,
      checkedIn: guests.filter((g) => g.check_in_status === 'checked_in').length,
      pending: guests.filter((g) => g.check_in_status === 'pending').length,
    }
  },
}

// =============================================
// CHECK-IN CONFIGS
// =============================================

export const adminCheckInConfigs = {
  /**
   * Get config for event
   */
  async getByEvent(eventId: string) {
    const supabase = createClient()
    return await supabase
      .from('check_in_configs')
      .select('*')
      .eq('event_id', eventId)
      .single()
  },

  /**
   * Update config
   */
  async update(eventId: string, data: Partial<Tables['check_in_configs']['Update']>) {
    const supabase = createClient()
    // Try update first
    const { data: existing } = await supabase
      .from('check_in_configs')
      .select('id')
      .eq('event_id', eventId)
      .single()

    if (existing) {
      return await supabase
        .from('check_in_configs')
        .update(data)
        .eq('event_id', eventId)
        .select()
        .single()
    } else {
      // If not exists, create
      return await supabase
        .from('check_in_configs')
        .insert({ event_id: eventId, ...data })
        .select()
        .single()
    }
  },
}

// =============================================
// WAITING SCREEN CONFIGS
// =============================================

export const adminWaitingScreenConfigs = {
  /**
   * Get config for event
   */
  async getByEvent(eventId: string) {
    const supabase = createClient()
    return await supabase
      .from('waiting_screen_configs')
      .select('*')
      .eq('event_id', eventId)
      .single()
  },

  /**
   * Update config
   */
  async update(eventId: string, data: Partial<Tables['waiting_screen_configs']['Update']>) {
    const supabase = createClient()
    const { data: existing } = await supabase
      .from('waiting_screen_configs')
      .select('id')
      .eq('event_id', eventId)
      .single()

    if (existing) {
      return await supabase
        .from('waiting_screen_configs')
        .update(data)
        .eq('event_id', eventId)
        .select()
        .single()
    } else {
      return await supabase
        .from('waiting_screen_configs')
        .insert({ event_id: eventId, ...data })
        .select()
        .single()
    }
  },
}

// =============================================
// WELCOME LED CONFIGS
// =============================================

export const adminWelcomeLEDConfigs = {
  /**
   * Get config for event
   */
  async getByEvent(eventId: string) {
    const supabase = createClient()
    return await supabase
      .from('welcome_led_configs')
      .select('*')
      .eq('event_id', eventId)
      .single()
  },

  /**
   * Update config
   */
  async update(eventId: string, data: Partial<Tables['welcome_led_configs']['Update']>) {
    const supabase = createClient()
    const { data: existing } = await supabase
      .from('welcome_led_configs')
      .select('id')
      .eq('event_id', eventId)
      .single()

    if (existing) {
      return await supabase
        .from('welcome_led_configs')
        .update(data)
        .eq('event_id', eventId)
        .select()
        .single()
    } else {
      return await supabase
        .from('welcome_led_configs')
        .insert({ event_id: eventId, ...data })
        .select()
        .single()
    }
  },
}

// =============================================
// RESULT LED CONFIGS
// =============================================

export const adminResultLEDConfigs = {
  /**
   * Get config for event
   */
  async getByEvent(eventId: string) {
    const supabase = createClient()
    return await supabase
      .from('result_led_configs')
      .select('*')
      .eq('event_id', eventId)
      .single()
  },

  /**
   * Update config
   */
  async update(eventId: string, data: Partial<Tables['result_led_configs']['Update']>) {
    const supabase = createClient()
    const { data: existing } = await supabase
      .from('result_led_configs')
      .select('id')
      .eq('event_id', eventId)
      .single()

    if (existing) {
      return await supabase
        .from('result_led_configs')
        .update(data)
        .eq('event_id', eventId)
        .select()
        .single()
    } else {
      return await supabase
        .from('result_led_configs')
        .insert({ event_id: eventId, ...data })
        .select()
        .single()
    }
  },
}

// =============================================
// MINI GAMES
// =============================================

export const adminMiniGames = {
  /**
   * Get all games for event
   */
  async getByEvent(eventId: string) {
    const supabase = createClient()
    return await supabase
      .from('mini_games')
      .select('*')
      .eq('event_id', eventId)
      .order('display_order', { ascending: true })
  },

  /**
   * Get game by ID
   */
  async getById(id: string) {
    const supabase = createClient()
    return await supabase
      .from('mini_games')
      .select('*')
      .eq('id', id)
      .single()
  },

  /**
   * Create game
   */
  async create(data: Tables['mini_games']['Insert']) {
    const supabase = createClient()
    return await supabase
      .from('mini_games')
      .insert(data)
      .select()
      .single()
  },

  /**
   * Update game
   */
  async update(id: string, data: Tables['mini_games']['Update']) {
    const supabase = createClient()
    return await supabase
      .from('mini_games')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  },

  /**
   * Delete game
   */
  async delete(id: string) {
    const supabase = createClient()
    return await supabase
      .from('mini_games')
      .delete()
      .eq('id', id)
  },

  /**
   * Toggle active status
   */
  async toggleActive(id: string) {
    const supabase = createClient()
    const { data: game } = await supabase
      .from('mini_games')
      .select('is_active')
      .eq('id', id)
      .single()

    if (!game) return { data: null, error: new Error('Game not found') }

    return await supabase
      .from('mini_games')
      .update({ is_active: !game.is_active })
      .eq('id', id)
      .select()
      .single()
  },
}

// =============================================
// EVENT SETTINGS
// =============================================

export const adminEventSettings = {
  /**
   * Get settings for event
   */
  async getByEvent(eventId: string) {
    const supabase = createClient()
    return await supabase
      .from('event_settings')
      .select('*')
      .eq('event_id', eventId)
      .single()
  },

  /**
   * Update settings
   */
  async update(eventId: string, data: Partial<Tables['event_settings']['Update']>) {
    const supabase = createClient()
    const { data: existing } = await supabase
      .from('event_settings')
      .select('id')
      .eq('event_id', eventId)
      .single()

    if (existing) {
      return await supabase
        .from('event_settings')
        .update(data)
        .eq('event_id', eventId)
        .select()
        .single()
    } else {
      return await supabase
        .from('event_settings')
        .insert({ event_id: eventId, ...data })
        .select()
        .single()
    }
  },
}

// =============================================
// PACKAGES (Subscription)
// =============================================

export const adminPackages = {
  /**
   * Get all packages
   */
  async getAll() {
    const supabase = createClient()
    return await supabase
      .from('packages')
      .select('*')
      .order('display_order', { ascending: true })
  },

  /**
   * Get active packages only
   */
  async getActive() {
    const supabase = createClient()
    return await supabase
      .from('packages')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
  },

  /**
   * Get package by ID
   */
  async getById(id: string) {
    const supabase = createClient()
    return await supabase
      .from('packages')
      .select('*')
      .eq('id', id)
      .single()
  },

  /**
   * Create package
   */
  async create(data: Tables['packages']['Insert']) {
    const supabase = createClient()
    return await supabase
      .from('packages')
      .insert(data)
      .select()
      .single()
  },

  /**
   * Update package
   */
  async update(id: string, data: Tables['packages']['Update']) {
    const supabase = createClient()
    return await supabase
      .from('packages')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  },

  /**
   * Delete package
   */
  async delete(id: string) {
    const supabase = createClient()
    return await supabase
      .from('packages')
      .delete()
      .eq('id', id)
  },

  /**
   * Toggle active status
   */
  async toggleActive(id: string) {
    const supabase = createClient()
    const { data: pkg } = await supabase
      .from('packages')
      .select('is_active')
      .eq('id', id)
      .single()

    if (!pkg) return { data: null, error: new Error('Package not found') }

    return await supabase
      .from('packages')
      .update({ is_active: !pkg.is_active })
      .eq('id', id)
      .select()
      .single()
  },
}

// =============================================
// SUBSCRIPTIONS
// =============================================

export const adminSubscriptions = {
  /**
   * Get all subscriptions
   */
  async getAll() {
    const supabase = createClient()
    return await supabase
      .from('subscriptions')
      .select('*, users(*), packages(*)')
      .order('created_at', { ascending: false })
  },

  /**
   * Get subscription by ID
   */
  async getById(id: string) {
    const supabase = createClient()
    return await supabase
      .from('subscriptions')
      .select('*, users(*), packages(*)')
      .eq('id', id)
      .single()
  },

  /**
   * Create subscription
   */
  async create(data: Tables['subscriptions']['Insert']) {
    const supabase = createClient()
    return await supabase
      .from('subscriptions')
      .insert(data)
      .select()
      .single()
  },

  /**
   * Update subscription
   */
  async update(id: string, data: Tables['subscriptions']['Update']) {
    const supabase = createClient()
    return await supabase
      .from('subscriptions')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  },

  /**
   * Change subscription status
   */
  async changeStatus(id: string, status: 'pending' | 'active' | 'expired' | 'cancelled') {
    const supabase = createClient()
    return await supabase
      .from('subscriptions')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
  },
}

// =============================================
// INVOICES
// =============================================

export const adminInvoices = {
  /**
   * Get all invoices
   */
  async getAll() {
    const supabase = createClient()
    return await supabase
      .from('invoices')
      .select('*, users(*), subscriptions(*)')
      .order('invoice_date', { ascending: false })
  },

  /**
   * Get invoice by ID
   */
  async getById(id: string) {
    const supabase = createClient()
    return await supabase
      .from('invoices')
      .select('*, users(*), subscriptions(*)')
      .eq('id', id)
      .single()
  },

  /**
   * Create invoice
   */
  async create(data: Tables['invoices']['Insert']) {
    const supabase = createClient()
    return await supabase
      .from('invoices')
      .insert(data)
      .select()
      .single()
  },

  /**
   * Update invoice
   */
  async update(id: string, data: Tables['invoices']['Update']) {
    const supabase = createClient()
    return await supabase
      .from('invoices')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  },

  /**
   * Mark as paid
   */
  async markAsPaid(id: string, paymentData: {
    payment_method?: string
    payment_reference?: string
  }) {
    const supabase = createClient()
    return await supabase
      .from('invoices')
      .update({
        payment_status: 'paid',
        payment_date: new Date().toISOString(),
        ...paymentData,
      })
      .eq('id', id)
      .select()
      .single()
  },
}
