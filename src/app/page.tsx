import { DashboardHeader } from '@/components/DashboardHeader';
import { PromotionalBanner } from '@/components/PromotionalBanner';
import { ServicesGrid } from '@/components/ServicesGrid';
import { NextAppointment } from '@/components/NextAppointment';
import { BottomNavigation } from '@/components/BottomNavigation';
import { getCurrentUserServer, getUpcomingAppointmentsServer } from '@/lib/server-queries';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await getCurrentUserServer();
  
  if (!user) {
    redirect('/login');
  }

  const upcomingAppointments = await getUpcomingAppointmentsServer(user.id);
  const nextAppointment = upcomingAppointments[0];

  return (
    <div className="pb-20 max-w-lg mx-auto bg-white min-h-screen">
      <DashboardHeader userName={user.patients?.full_name?.split(' ')[0] || 'User'} />
      <PromotionalBanner 
        title="Health Checkup Special" 
        discount="20%" 
      />
      <ServicesGrid />
      {nextAppointment && (
        <NextAppointment 
          doctor={{
            name: `Dr. ${nextAppointment.doctor.full_name}`,
            specialty: nextAppointment.doctor.specialization,
            imageUrl: nextAppointment.doctor.avatar_url
          }}
          time={nextAppointment.start_time}
          date={nextAppointment.date}
          status={nextAppointment.status}
        />
      )}
      <BottomNavigation />
    </div>
  );
}
