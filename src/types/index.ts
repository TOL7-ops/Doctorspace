import { Database } from './database.types';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'patient' | 'doctor';
  created_at: string;
  updated_at: string;
}

// Patient and Doctor interfaces removed to avoid conflicts with Database types

export interface AppointmentType {
  id: string;
  name: string;
  duration: number;
  description: string;
  created_at: string;
  updated_at: string;
}

// Appointment interface removed to avoid conflicts with Database types

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject?: string;
  content: string;
  read: boolean;
  created_at: string;
  updated_at: string;
  sender?: User;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  image_url?: string;
  start_date: string;
  end_date: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TimeSlot {
  date: string;
  start_time: string;
  is_available: boolean;
}

export type Appointment = Database['public']['Tables']['appointments']['Row'];
export type Doctor = Database['public']['Tables']['doctors']['Row'];
export type Patient = Database['public']['Tables']['patients']['Row'];
export type Service = Database['public']['Tables']['services']['Row'];

export type AppointmentWithRelations = Appointment & {
  doctor: Doctor;
  patient: Patient;
  service: Service;
};

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type UserProfile = Profile & {
  email: string;
};

export interface UserProfileData {
  id: string;
  full_name: string;
  email: string;
  role: string;
  phone?: string;
  phone_number?: string;
  avatar_url?: string;
  address?: string;
  date_of_birth?: string;
  medical_history?: string;
} 