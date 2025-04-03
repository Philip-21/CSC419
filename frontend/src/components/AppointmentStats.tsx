import type React from 'react';
import { Calendar, CheckCircle, Clock, ClipboardList } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { AppointmentResponse } from '../types';

interface AppointmentStatsProps {
  appointments: AppointmentResponse[];
}

export function AppointmentStats({ appointments }: AppointmentStatsProps) {
  const totalAppointments = appointments.length;

  // Get current date and time
  const now = new Date();

  // Calculate completed and scheduled appointments based on date/time
  const completedAppointments = appointments.filter((appointment) => {
    // Parse appointment date and time
    const [year, month, day] = appointment.appointment_date
      .split('-')
      .map(Number);
    const [hours, minutes] = appointment.appointment_time
      .split(':')
      .map(Number);

    // Create appointment date object
    const appointmentDate = new Date(year, month - 1, day, hours, minutes);

    // Add 1 hour to appointment time (assuming each appointment takes an hour)
    const appointmentEndDate = new Date(
      appointmentDate.getTime() + 60 * 60 * 1000
    );

    // If appointment end time is in the past, it's completed
    return appointmentEndDate < now;
  }).length;

  // Scheduled appointments are those not completed
  const scheduledAppointments = totalAppointments - completedAppointments;

  // Calculate today's appointments
  const today = now.toISOString().split('T')[0];
  const todaysAppointments = appointments.filter(
    (appointment) => appointment.appointment_date === today
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Appointments"
        value={totalAppointments}
        icon={<ClipboardList className="h-5 w-5 text-teal-600" />}
        description="All appointments"
      />

      <StatCard
        title="Scheduled"
        value={scheduledAppointments}
        icon={<Calendar className="h-5 w-5 text-blue-600" />}
        description="Upcoming appointments"
      />

      <StatCard
        title="Completed"
        value={completedAppointments}
        icon={<CheckCircle className="h-5 w-5 text-green-600" />}
        description="Finished appointments"
      />

      <StatCard
        title="Today"
        value={todaysAppointments}
        icon={<Clock className="h-5 w-5 text-purple-600" />}
        description="Today's appointments"
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className="rounded-full bg-muted p-2">{icon}</div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
