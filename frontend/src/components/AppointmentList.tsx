import { useState } from 'react';
import { AppointmentResponse } from '../types';
import {
  AlertCircle,
  Calendar,
  Clock,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Skeleton } from './ui/skeleton';

interface AppointmentListProps {
  onEdit: (appointment: AppointmentResponse) => void;
  onDelete: (appointment: AppointmentResponse) => void;
  appointments: AppointmentResponse[];
  loading: boolean;
  onNewAppointment: () => void;
  onCancelAllAppointments: () => void;
}

const AppointmentList = ({
  appointments,
  loading,
  onEdit,
  onDelete,
  onNewAppointment,
  onCancelAllAppointments,
}: AppointmentListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const role = localStorage.getItem('role');

  const isAppointmentCompleted = (
    appointment: AppointmentResponse
  ): boolean => {
    const now = new Date();

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
  };

  const getStatusBadge = (appointment: AppointmentResponse) => {
    const completed = isAppointmentCompleted(appointment);

    return completed ? (
      <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
    ) : (
      <Badge className="bg-blue-500 hover:bg-blue-600">Scheduled</Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search appointments..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-col items-start sm:flex-row sm:items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          {role === 'patient' && (
            <>
              <Button size="sm" onClick={onNewAppointment}>
                <Plus className="h-4 w-4" />
                New Appointment
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={onCancelAllAppointments}
                className="flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4" />
                Cancel All Appointments
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{role === 'patient' ? 'Doctor' : 'Patient'}</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Date
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Time
                </div>
              </TableHead>
              <TableHead className="hidden md:table-cell">Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="relative">
            {loading &&
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-6 w-[150px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-[300px]" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-6 w-[120px]" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-6 w-[80px]" />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Skeleton className="h-6 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-[90px]" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-9 w-[80px] ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            {appointments.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No appointments found.
                </TableCell>
              </TableRow>
            )}{' '}
            {appointments.length > 0 &&
              !loading &&
              appointments.map((appointment) => (
                <TableRow key={appointment.appointment_uuid}>
                  <TableCell className="font-medium capitalize">
                    {role === 'patient' && 'Dr'} {role === 'patient'
                      ? appointment.doctor_name
                      : appointment.patient_name}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {role ==='doctor' ? appointment.patient_email : appointment.doctor_email}
                  </TableCell>
                  <TableCell>{appointment.appointment_date}</TableCell>
                  <TableCell>{appointment.appointment_time}</TableCell>
                  <TableCell className="hidden truncate md:table-cell">
                    {appointment.appointment_details}
                  </TableCell>
                  <TableCell>{getStatusBadge(appointment)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(appointment)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(appointment)}
                          className="text-red-600"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AppointmentList;
