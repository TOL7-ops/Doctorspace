import { getServerSupabase } from './supabase';
import { Doctor, AppointmentType, TimeSlot, Appointment, AppointmentWithRelations } from '@/types';

export async function getDoctors(): Promise<Doctor[]> {
  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from('doctors')
      .select('*, users!inner(*)');

    if (error) {
      console.error('Error fetching doctors:', error);
      return [];
    }

    if (!data) {
      console.log('No doctors found');
      return [];
    }

    return data.map(doctor => ({
      ...doctor,
      ...doctor.users,
      role: 'doctor' as const
    }));
  } catch (error) {
    console.error('Error in getDoctors:', error);
    return [];
  }
}

export async function getAppointmentTypes(): Promise<AppointmentType[]> {
  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from('appointment_types')
      .select('*');

    if (error) {
      console.error('Error fetching appointment types:', error);
      return [];
    }

    if (!data) {
      console.log('No appointment types found');
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error in getAppointmentTypes:', error);
    return [];
  }
}

export async function getAvailableSlots(doctorId: string, date: string): Promise<TimeSlot[]> {
  try {
    const supabase = getServerSupabase();
    
    // First, get the doctor's available hours
    const { data: doctorData, error: doctorError } = await supabase
      .from('doctors')
      .select('available_hours')
      .eq('id', doctorId)
      .single();

    if (doctorError) {
      console.error('Error fetching doctor data:', doctorError);
      return [];
    }

    if (!doctorData) {
      console.log('No doctor found with ID:', doctorId);
      return [];
    }

    // Get existing appointments for the doctor on the given date
    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('*, appointment_types(*)')
      .eq('doctor_id', doctorId)
      .eq('date', date)
      .neq('status', 'cancelled');

    if (appointmentsError) {
      console.error('Error fetching appointments:', appointmentsError);
      return [];
    }

    // Generate all possible time slots from doctor's available hours
    const slots: TimeSlot[] = doctorData.available_hours.map((hour: string) => ({
      date,
      start_time: hour,
      is_available: true
    }));

    // Mark slots as unavailable if they overlap with existing appointments
    appointments?.forEach(appointment => {
      const appointmentStart = new Date(`${date}T${appointment.start_time}`);
      const appointmentEnd = new Date(appointmentStart.getTime() + appointment.appointment_types.duration * 60000);

      slots.forEach(slot => {
        const slotStart = new Date(`${date}T${slot.start_time}`);
        if (slotStart >= appointmentStart && slotStart < appointmentEnd) {
          slot.is_available = false;
        }
      });
    });

    return slots.filter(slot => slot.is_available);
  } catch (error) {
    console.error('Error in getAvailableSlots:', error);
    return [];
  }
}

export async function getAllAppointments(): Promise<AppointmentWithRelations[]> {
  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        doctor:doctors(*),
        patient:patients(*),
        appointmentType:appointment_types(*)
      `)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }

    if (!data) {
      console.log('No appointments found');
      return [];
    }

    return data as AppointmentWithRelations[];
  } catch (error) {
    console.error('Error in getAllAppointments:', error);
    return [];
  }
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: Appointment['status']
): Promise<boolean> {
  try {
    const supabase = getServerSupabase();
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', appointmentId);

    if (error) {
      console.error('Error updating appointment status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateAppointmentStatus:', error);
    return false;
  }
} 