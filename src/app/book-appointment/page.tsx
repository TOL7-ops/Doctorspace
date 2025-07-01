import { BookingForm } from '@/components/BookingForm';
import { getDoctors, getAppointmentTypes } from '@/lib/actions';
import { getServerSupabase } from '@/lib/supabase-server';

export default async function BookAppointment() {
  const doctors = await getDoctors();
  const appointmentTypes = await getAppointmentTypes();

  async function createAppointment(data: {
    doctorId: string;
    appointmentTypeId: string;
    date: string;
    startTime: string;
    notes?: string;
  }) {
    'use server';
    
    const supabase = getServerSupabase();
    const { error } = await supabase
      .from('appointments')
      .insert({
        doctor_id: data.doctorId,
        appointment_type_id: data.appointmentTypeId,
        date: data.date,
        start_time: data.startTime,
        notes: data.notes,
        status: 'pending'
      });

    if (error) {
      throw new Error(`Failed to create appointment: ${error.message}`);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Book an Appointment
          </h2>
          <BookingForm
            doctors={doctors}
            appointmentTypes={appointmentTypes}
            onSubmit={createAppointment}
          />
        </div>
      </div>
    </div>
  );
} 