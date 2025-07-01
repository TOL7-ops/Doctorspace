import { Database } from './database.types';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'patient' | 'doctor';
  created_at: string;
  updated_at: string;
}

export interface Patient {
  id: string;
  user_id: string;
  full_name: string;
  phone_number: string;
  date_of_birth: string;
  medical_history?: string;
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  id: string;
  full_name: string;
  specialization: string;
  qualification: string;
  years_of_experience: number;
  available_days: string[];
  available_hours: string[];
  image_url?: string;
  created_at: string;
  updated_at: string;
  appointments_count?: number;
  rating?: number;
}

export interface AppointmentType {
  id: string;
  name: string;
  duration: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_type_id: string;
  date: string;
  start_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  created_at: string;
  updated_at: string;
  doctor?: Doctor;
  appointment_type?: AppointmentType;
}

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