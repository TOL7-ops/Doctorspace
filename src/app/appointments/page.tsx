import React from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { BottomNavigation } from '@/components/BottomNavigation';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { getCurrentUser, getUpcomingAppointments, getPastAppointments } from '@/lib/queries';
import { redirect } from 'next/navigation';
import Image from 'next/image';

export default async function AppointmentsPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }

  const [upcomingAppointments, pastAppointments] = await Promise.all([
    getUpcomingAppointments(user.id),
    getPastAppointments(user.id),
  ]);

  return (
    <div className="pb-20 max-w-lg mx-auto bg-white min-h-screen">
      <DashboardHeader userName={user.patients?.full_name?.split(' ')[0] || 'User'} />
      
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">My Appointments</h1>
        
        {upcomingAppointments.length > 0 && (
          <>
            <h2 className="text-lg font-semibold mb-4">Upcoming</h2>
            <div className="space-y-4 mb-8">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 relative rounded-full bg-gray-200 overflow-hidden">
                      {appointment.doctor.image_url ? (
                        <Image
                          src={appointment.doctor.image_url}
                          alt={appointment.doctor.full_name}
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
                      <h3 className="font-medium">{appointment.doctor.full_name}</h3>
                      <p className="text-sm text-gray-600">{appointment.doctor.specialization}</p>
                    </div>
                    <span 
                      className={`text-sm font-medium capitalize px-3 py-1 rounded-full ${
                        appointment.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800'
                          : appointment.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                  
                  <div className="mt-4 flex space-x-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon className="h-5 w-5 mr-2" />
                      {appointment.start_time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      {appointment.date}
                    </div>
                  </div>
                  
                  {appointment.status !== 'cancelled' && (
                    <div className="mt-4 flex space-x-3">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700">
                        Reschedule
                      </button>
                      <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {pastAppointments.length > 0 && (
          <>
            <h2 className="text-lg font-semibold mb-4">Past Appointments</h2>
            <div className="space-y-4">
              {pastAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 relative rounded-full bg-gray-200 overflow-hidden">
                      {appointment.doctor.image_url ? (
                        <Image
                          src={appointment.doctor.image_url}
                          alt={appointment.doctor.full_name}
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
                      <h3 className="font-medium">{appointment.doctor.full_name}</h3>
                      <p className="text-sm text-gray-600">{appointment.doctor.specialization}</p>
                    </div>
                    <span 
                      className={`text-sm font-medium capitalize px-3 py-1 rounded-full ${
                        appointment.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                  
                  <div className="mt-4 flex space-x-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon className="h-5 w-5 mr-2" />
                      {appointment.start_time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      {appointment.date}
                    </div>
                  </div>
                  
                  <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700">
                    Book Follow-up
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {upcomingAppointments.length === 0 && pastAppointments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No appointments found</p>
            <button className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg text-sm font-medium hover:bg-blue-700">
              Book an Appointment
            </button>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
} 