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
      appointments: {
        Row: {
          id: string
          patient_id: string
          doctor_id: string
          service_id: string
          date: string
          time: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          doctor_id: string
          service_id: string
          date: string
          time: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          doctor_id?: string
          service_id?: string
          date?: string
          time?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      doctors: {
        Row: {
          id: string
          user_id: string
          specialty: string
          experience_years: number
          education: string
          bio: string | null
          rating: number
          total_reviews: number
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          specialty: string
          experience_years: number
          education: string
          bio?: string | null
          rating?: number
          total_reviews?: number
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          specialty?: string
          experience_years?: number
          education?: string
          bio?: string | null
          rating?: number
          total_reviews?: number
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      patients: {
        Row: {
          id: string
          user_id: string
          date_of_birth: string
          gender: string
          blood_type: string | null
          allergies: string[] | null
          medical_conditions: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date_of_birth: string
          gender: string
          blood_type?: string | null
          allergies?: string[] | null
          medical_conditions?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date_of_birth?: string
          gender?: string
          blood_type?: string | null
          allergies?: string[] | null
          medical_conditions?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          role: string
          avatar_url: string | null
          phone: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          role?: string
          avatar_url?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          role?: string
          avatar_url?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          description: string
          duration: number
          price: number
          category: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          duration: number
          price: number
          category: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          duration?: number
          price?: number
          category?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 