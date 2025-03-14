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
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          email: string
          transaction_password: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          email: string
          transaction_password: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          email?: string
          transaction_password?: string
          created_at?: string
          updated_at?: string
        }
      }
      holdings: {
        Row: {
          id: string
          user_id: string
          symbol: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          symbol: string
          quantity: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          symbol?: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
      payment_addresses: {
        Row: {
          id: string
          network: string
          address: string
          qr_code_url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          network: string
          address: string
          qr_code_url: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          network?: string
          address?: string
          qr_code_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      membership_transactions: {
        Row: {
          id: string
          user_id: string
          plan: string
          transaction_id: string
          network: string
          amount: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan: string
          transaction_id: string
          network: string
          amount: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan?: string
          transaction_id?: string
          network?: string
          amount?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      deposit_transactions: {
        Row: {
          id: string
          user_id: string
          asset: string
          transaction_id: string
          network: string
          amount: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          asset: string
          transaction_id: string
          network: string
          amount: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          asset?: string
          transaction_id?: string
          network?: string
          amount?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}