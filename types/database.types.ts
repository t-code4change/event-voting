export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          name: string
          description: string | null
          start_time: string
          end_time: string
          voting_close_time: string
          is_active: boolean
          auth_settings: Json
          max_votes_per_voter: number
          allow_edit_before_deadline: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          start_time: string
          end_time: string
          voting_close_time: string
          is_active?: boolean
          auth_settings?: Json
          max_votes_per_voter?: number
          allow_edit_before_deadline?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          start_time?: string
          end_time?: string
          voting_close_time?: string
          is_active?: boolean
          auth_settings?: Json
          max_votes_per_voter?: number
          allow_edit_before_deadline?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          event_id: string
          name: string
          description: string | null
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          name: string
          description?: string | null
          order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          name?: string
          description?: string | null
          order?: number
          created_at?: string
          updated_at?: string
        }
      }
      candidates: {
        Row: {
          id: string
          category_id: string
          name: string
          photo_url: string | null
          description: string | null
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          photo_url?: string | null
          description?: string | null
          order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          name?: string
          photo_url?: string | null
          description?: string | null
          order?: number
          created_at?: string
          updated_at?: string
        }
      }
      voters: {
        Row: {
          id: string
          email: string | null
          phone: string | null
          verified_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email?: string | null
          phone?: string | null
          verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          phone?: string | null
          verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          voter_id: string
          event_id: string
          category_id: string
          candidate_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          voter_id: string
          event_id: string
          category_id: string
          candidate_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          voter_id?: string
          event_id?: string
          category_id?: string
          candidate_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      otp_verifications: {
        Row: {
          id: string
          email: string
          otp_code: string
          expires_at: string
          verified: boolean
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          otp_code: string
          expires_at: string
          verified?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          otp_code?: string
          expires_at?: string
          verified?: boolean
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          company_name: string | null
          role: string
          avatar_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          company_name?: string | null
          role?: string
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          company_name?: string | null
          role?: string
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      packages: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          price: number
          currency: string
          billing_period: string
          max_events: number | null
          max_participants_per_event: number | null
          max_categories_per_event: number | null
          max_candidates_per_category: number | null
          features: Json
          is_active: boolean
          is_popular: boolean
          is_highlighted: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          price: number
          currency?: string
          billing_period?: string
          max_events?: number | null
          max_participants_per_event?: number | null
          max_categories_per_event?: number | null
          max_candidates_per_category?: number | null
          features?: Json
          is_active?: boolean
          is_popular?: boolean
          is_highlighted?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          price?: number
          currency?: string
          billing_period?: string
          max_events?: number | null
          max_participants_per_event?: number | null
          max_categories_per_event?: number | null
          max_candidates_per_category?: number | null
          features?: Json
          is_active?: boolean
          is_popular?: boolean
          is_highlighted?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          package_id: string
          status: string
          amount_paid: number
          currency: string
          start_date: string
          end_date: string | null
          events_used: number
          events_limit: number | null
          requires_invoice: boolean
          invoice_id: string | null
          notes: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          package_id: string
          status?: string
          amount_paid: number
          currency?: string
          start_date?: string
          end_date?: string | null
          events_used?: number
          events_limit?: number | null
          requires_invoice?: boolean
          invoice_id?: string | null
          notes?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          package_id?: string
          status?: string
          amount_paid?: number
          currency?: string
          start_date?: string
          end_date?: string | null
          events_used?: number
          events_limit?: number | null
          requires_invoice?: boolean
          invoice_id?: string | null
          notes?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          subscription_id: string
          user_id: string
          invoice_number: string
          invoice_date: string
          due_date: string | null
          company_name: string
          company_tax_code: string
          company_address: string
          company_email: string | null
          company_phone: string | null
          items: Json
          subtotal: number
          vat_rate: number
          vat_amount: number
          total_amount: number
          currency: string
          payment_status: string
          payment_method: string | null
          payment_date: string | null
          payment_reference: string | null
          pdf_url: string | null
          notes: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subscription_id: string
          user_id: string
          invoice_number: string
          invoice_date?: string
          due_date?: string | null
          company_name: string
          company_tax_code: string
          company_address: string
          company_email?: string | null
          company_phone?: string | null
          items: Json
          subtotal: number
          vat_rate?: number
          vat_amount: number
          total_amount: number
          currency?: string
          payment_status?: string
          payment_method?: string | null
          payment_date?: string | null
          payment_reference?: string | null
          pdf_url?: string | null
          notes?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          subscription_id?: string
          user_id?: string
          invoice_number?: string
          invoice_date?: string
          due_date?: string | null
          company_name?: string
          company_tax_code?: string
          company_address?: string
          company_email?: string | null
          company_phone?: string | null
          items?: Json
          subtotal?: number
          vat_rate?: number
          vat_amount?: number
          total_amount?: number
          currency?: string
          payment_status?: string
          payment_method?: string | null
          payment_date?: string | null
          payment_reference?: string | null
          pdf_url?: string | null
          notes?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          subscription_id: string | null
          invoice_id: string | null
          transaction_type: string
          amount: number
          currency: string
          payment_method: string | null
          payment_gateway: string | null
          payment_gateway_transaction_id: string | null
          status: string
          description: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subscription_id?: string | null
          invoice_id?: string | null
          transaction_type: string
          amount: number
          currency?: string
          payment_method?: string | null
          payment_gateway?: string | null
          payment_gateway_transaction_id?: string | null
          status?: string
          description?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subscription_id?: string | null
          invoice_id?: string | null
          transaction_type?: string
          amount?: number
          currency?: string
          payment_method?: string | null
          payment_gateway?: string | null
          payment_gateway_transaction_id?: string | null
          status?: string
          description?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      subscription_history: {
        Row: {
          id: string
          subscription_id: string
          user_id: string
          action: string
          old_package_id: string | null
          new_package_id: string | null
          old_status: string | null
          new_status: string | null
          description: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          subscription_id: string
          user_id: string
          action: string
          old_package_id?: string | null
          new_package_id?: string | null
          old_status?: string | null
          new_status?: string | null
          description?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          subscription_id?: string
          user_id?: string
          action?: string
          old_package_id?: string | null
          new_package_id?: string | null
          old_status?: string | null
          new_status?: string | null
          description?: string | null
          metadata?: Json
          created_at?: string
        }
      }
      guests: {
        Row: {
          id: string
          event_id: string
          full_name: string
          email: string | null
          phone: string | null
          company: string | null
          job_title: string | null
          guest_type: string
          table_number: string | null
          seat_number: string | null
          check_in_status: string
          check_in_time: string | null
          check_in_method: string | null
          notes: string | null
          custom_fields: Json
          qr_code_data: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          full_name: string
          email?: string | null
          phone?: string | null
          company?: string | null
          job_title?: string | null
          guest_type?: string
          table_number?: string | null
          seat_number?: string | null
          check_in_status?: string
          check_in_time?: string | null
          check_in_method?: string | null
          notes?: string | null
          custom_fields?: Json
          qr_code_data?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          full_name?: string
          email?: string | null
          phone?: string | null
          company?: string | null
          job_title?: string | null
          guest_type?: string
          table_number?: string | null
          seat_number?: string | null
          check_in_status?: string
          check_in_time?: string | null
          check_in_method?: string | null
          notes?: string | null
          custom_fields?: Json
          qr_code_data?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      check_in_configs: {
        Row: {
          id: string
          event_id: string
          form_fields: Json
          enable_qr_check_in: boolean
          enable_manual_check_in: boolean
          enable_self_check_in: boolean
          qr_url_template: string
          success_message: string
          success_redirect_url: string | null
          show_on_led: boolean
          led_display_duration: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          form_fields?: Json
          enable_qr_check_in?: boolean
          enable_manual_check_in?: boolean
          enable_self_check_in?: boolean
          qr_url_template?: string
          success_message?: string
          success_redirect_url?: string | null
          show_on_led?: boolean
          led_display_duration?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          form_fields?: Json
          enable_qr_check_in?: boolean
          enable_manual_check_in?: boolean
          enable_self_check_in?: boolean
          qr_url_template?: string
          success_message?: string
          success_redirect_url?: string | null
          show_on_led?: boolean
          led_display_duration?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      waiting_screen_configs: {
        Row: {
          id: string
          event_id: string
          slides: Json
          slide_duration: number
          is_playing: boolean
          current_quote: string | null
          quote_list: Json
          show_event_logo: boolean
          event_logo_url: string | null
          background_color: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          slides?: Json
          slide_duration?: number
          is_playing?: boolean
          current_quote?: string | null
          quote_list?: Json
          show_event_logo?: boolean
          event_logo_url?: string | null
          background_color?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          slides?: Json
          slide_duration?: number
          is_playing?: boolean
          current_quote?: string | null
          quote_list?: Json
          show_event_logo?: boolean
          event_logo_url?: string | null
          background_color?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      welcome_led_configs: {
        Row: {
          id: string
          event_id: string
          welcome_message: string
          sub_message: string | null
          animation_type: string
          animation_speed: string
          background_type: string
          background_color: string
          gradient_colors: Json
          background_image_url: string | null
          text_color: string
          logo_url: string | null
          logo_position: string
          auto_show: boolean
          show_duration: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          welcome_message?: string
          sub_message?: string | null
          animation_type?: string
          animation_speed?: string
          background_type?: string
          background_color?: string
          gradient_colors?: Json
          background_image_url?: string | null
          text_color?: string
          logo_url?: string | null
          logo_position?: string
          auto_show?: boolean
          show_duration?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          welcome_message?: string
          sub_message?: string | null
          animation_type?: string
          animation_speed?: string
          background_type?: string
          background_color?: string
          gradient_colors?: Json
          background_image_url?: string | null
          text_color?: string
          logo_url?: string | null
          logo_position?: string
          auto_show?: boolean
          show_duration?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      result_led_configs: {
        Row: {
          id: string
          event_id: string
          display_mode: string
          refresh_interval: number
          show_vote_count: boolean
          show_percentage: boolean
          show_photos: boolean
          enable_confetti: boolean
          enable_award_animation: boolean
          enable_sound_effects: boolean
          theme: string
          background_image_url: string | null
          selected_categories: Json | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          display_mode?: string
          refresh_interval?: number
          show_vote_count?: boolean
          show_percentage?: boolean
          show_photos?: boolean
          enable_confetti?: boolean
          enable_award_animation?: boolean
          enable_sound_effects?: boolean
          theme?: string
          background_image_url?: string | null
          selected_categories?: Json | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          display_mode?: string
          refresh_interval?: number
          show_vote_count?: boolean
          show_percentage?: boolean
          show_photos?: boolean
          enable_confetti?: boolean
          enable_award_animation?: boolean
          enable_sound_effects?: boolean
          theme?: string
          background_image_url?: string | null
          selected_categories?: Json | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      mini_games: {
        Row: {
          id: string
          event_id: string
          name: string
          description: string | null
          game_type: string
          config: Json
          winners: Json
          is_active: boolean
          start_time: string | null
          end_time: string | null
          max_participants: number | null
          participants_count: number
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          name: string
          description?: string | null
          game_type: string
          config?: Json
          winners?: Json
          is_active?: boolean
          start_time?: string | null
          end_time?: string | null
          max_participants?: number | null
          participants_count?: number
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          name?: string
          description?: string | null
          game_type?: string
          config?: Json
          winners?: Json
          is_active?: boolean
          start_time?: string | null
          end_time?: string | null
          max_participants?: number | null
          participants_count?: number
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      event_settings: {
        Row: {
          id: string
          event_id: string
          voting_settings: Json
          display_settings: Json
          email_settings: Json
          analytics_settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          voting_settings?: Json
          display_settings?: Json
          email_settings?: Json
          analytics_settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          voting_settings?: Json
          display_settings?: Json
          email_settings?: Json
          analytics_settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export interface AuthSettings {
  require_email: boolean
  require_phone: boolean
  require_otp: boolean
  otp_method?: 'email' | 'sms'
}

// Export Tables type for easy access
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]
