'use client';

import { useState, useEffect } from 'react';
import { Doctor, AppointmentType, TimeSlot } from '@/types';
import { format } from 'date-fns';

interface BookingFormProps {
  doctors: Doctor[];
  appointmentTypes: AppointmentType[];
  onSubmit: (data: {
    doctorId: string;
    appointmentTypeId: string;
    date: string;
    startTime: string;
    notes?: string;
  }) => void;
}

export const BookingForm = ({
  doctors,
  appointmentTypes,
  onSubmit,
}: BookingFormProps) => {
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Generate dates for the next 30 days
  const availableDates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return format(date, 'yyyy-MM-dd');
  });

  useEffect(() => {
    async function fetchAvailableSlots() {
      if (!selectedDoctor || !selectedDate) {
        setAvailableSlots([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/slots?doctorId=${selectedDoctor}&date=${selectedDate}`
        );
        if (!response.ok) throw new Error('Failed to fetch slots');
        const slots = await response.json();
        setAvailableSlots(slots);
      } catch (error) {
        console.error('Error fetching slots:', error);
        setAvailableSlots([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAvailableSlots();
  }, [selectedDoctor, selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      doctorId: selectedDoctor,
      appointmentTypeId: selectedType,
      date: selectedDate,
      startTime: selectedTime,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div>
        <label htmlFor="appointmentType" className="block text-sm font-medium text-gray-700">
          Appointment Type
        </label>
        <select
          id="appointmentType"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Select type</option>
          {appointmentTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name} ({type.duration} minutes)
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">
          Select Doctor
        </label>
        <select
          id="doctor"
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Select doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              Dr. {doctor.full_name} - {doctor.specialization}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Select Date
        </label>
        <select
          id="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Select date</option>
          {availableDates.map((date) => (
            <option key={date} value={date}>
              {format(new Date(date), 'MMMM d, yyyy')}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="time" className="block text-sm font-medium text-gray-700">
          Select Time
        </label>
        <select
          id="time"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          disabled={isLoading || !selectedDoctor || !selectedDate}
        >
          <option value="">
            {isLoading
              ? 'Loading available slots...'
              : !selectedDoctor || !selectedDate
              ? 'Select doctor and date first'
              : 'Select time'}
          </option>
          {availableSlots.map((slot) => (
            <option key={slot.start_time} value={slot.start_time}>
              {format(new Date(`2000-01-01T${slot.start_time}`), 'h:mm a')}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes (Optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Any additional information for the doctor..."
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Book Appointment'}
      </button>
    </form>
  );
}; 