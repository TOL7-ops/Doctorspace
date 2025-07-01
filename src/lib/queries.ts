'use client'

import { supabase } from './supabase';
import type { User, Doctor, Appointment, Message } from '@/types';

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('patients')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    console.error('No profile found for user:', user.id);
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    ...profile
  };
}

export async function getUpcomingAppointments(userId: string) {
  const { data: appointments, error } = await supabase
    .from('appointments')
    .select(`
      *,
      doctor:doctors(*),
      appointment_type:appointment_types(*)
    `)
    .eq('patient_id', userId)
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }

  return appointments;
}

export async function getPastAppointments(userId: string) {
  const { data: appointments, error } = await supabase
    .from('appointments')
    .select(`
      *,
      doctor:doctors(*),
      appointment_type:appointment_types(*)
    `)
    .eq('patient_id', userId)
    .lt('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: false })
    .order('start_time', { ascending: true })
    .limit(10);

  if (error) {
    console.error('Error fetching past appointments:', error);
    return [];
  }

  return appointments;
}

export async function getMessages(userId: string) {
  const { data: messages, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:users(*)
    `)
    .eq('recipient_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  return messages;
}

export async function getTopDoctors() {
  const { data: doctors, error } = await supabase
    .from('doctors')
    .select(`
      *,
      users!inner(*),
      appointments(count)
    `)
    .order('appointments_count', { ascending: false })
    .limit(6);

  if (error) {
    console.error('Error fetching top doctors:', error);
    return [];
  }

  return doctors;
}

export async function getPromotions() {
  const { data: promotions, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('active', true)
    .lte('start_date', new Date().toISOString())
    .gte('end_date', new Date().toISOString())
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching promotions:', error);
    return [];
  }

  return promotions;
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: 'confirmed' | 'cancelled' | 'completed' | 'pending'
) {
  const { error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', appointmentId);

  if (error) {
    throw new Error(`Failed to update appointment status: ${error.message}`);
  }
}

export async function markMessageAsRead(messageId: string) {
  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('id', messageId);

  if (error) {
    throw new Error(`Failed to mark message as read: ${error.message}`);
  }
}

export async function getUserProfile(userId: string) {
  try {
    // First try to get from profiles table (if it exists)
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!profileError && profileData) {
      console.log('Profile found in profiles table:', profileData);
      // Get user email from auth
      const { data: { user } } = await supabase.auth.getUser();
      return {
        id: profileData.id,
        full_name: profileData.full_name,
        email: user?.email || 'N/A',
        role: 'patient', // Default role since profiles table doesn't have role
        phone: profileData.phone,
        avatar_url: profileData.avatar_url,
        address: profileData.address
      };
    }

    console.log('Profile not found in profiles table, trying patients table...');
    
    // Fallback to patients table (current structure)
    const { data: patientData, error: patientError } = await supabase
      .from('patients')
      .select('*')
      .eq('id', userId)
      .single();

    if (patientError) {
      console.error('Error fetching from patients table:', patientError);
      return null;
    }

    if (!patientData) {
      console.error('No profile found for user:', userId);
      return null;
    }

    console.log('Profile found in patients table:', patientData);
    
    // Get user email from auth
    const { data: { user } } = await supabase.auth.getUser();
    
    return {
      id: patientData.id,
      full_name: patientData.full_name,
      email: user?.email || 'N/A',
      role: 'patient', // Default role for patients
      phone_number: patientData.phone_number,
      date_of_birth: patientData.date_of_birth,
      medical_history: patientData.medical_history
    };

  } catch (error) {
    console.error('Unexpected error fetching user profile:', error);
    return null;
  }
} 