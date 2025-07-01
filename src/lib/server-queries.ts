import { getServerSupabase } from './supabase-server'
import type { User, Doctor, Appointment, Message } from '@/types'

export async function getCurrentUserServer() {
  const supabase = getServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('patients')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    console.error('No profile found for user:', user.id)
    return null
  }

  return {
    id: user.id,
    email: user.email,
    ...profile
  }
}

export async function getUpcomingAppointmentsServer(userId: string) {
  const supabase = getServerSupabase()
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
    .order('start_time', { ascending: true })

  if (error) {
    console.error('Error fetching appointments:', error)
    return []
  }

  return appointments
}

export async function getMessagesServer(userId: string) {
  const supabase = getServerSupabase()
  const { data: messages, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:users(*)
    `)
    .eq('recipient_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Error fetching messages:', error)
    return []
  }

  return messages
} 