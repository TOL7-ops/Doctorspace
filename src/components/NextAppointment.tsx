import React from 'react';
import { ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface NextAppointmentProps {
  doctor: {
    name: string;
    specialty: string;
    imageUrl?: string;
  };
  time: string;
  date: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export function NextAppointment({ doctor, time, date, status }: NextAppointmentProps) {
  return (
    <div className="px-4 py-6">
      <h2 className="text-lg font-semibold mb-4">Next Appointment</h2>
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 relative rounded-full bg-gray-200 overflow-hidden">
            {doctor.imageUrl ? (
              <Image
                src={doctor.imageUrl}
                alt={doctor.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{doctor.name}</h3>
            <p className="text-sm text-gray-600">{doctor.specialty}</p>
          </div>
          <span className="text-sm font-medium text-green-600 capitalize">
            {status}
          </span>
        </div>
        <div className="mt-4 flex space-x-6">
          <div className="flex items-center text-sm text-gray-600">
            <ClockIcon className="h-5 w-5 mr-2" />
            {time}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CalendarIcon className="h-5 w-5 mr-2" />
            {date}
          </div>
        </div>
      </div>
    </div>
  );
} 