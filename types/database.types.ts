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
          category_id: string
          candidate_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          voter_id: string
          category_id: string
          candidate_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          voter_id?: string
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
    }
  }
}

export interface AuthSettings {
  require_email: boolean
  require_phone: boolean
  require_otp: boolean
  otp_method?: 'email' | 'sms'
}
