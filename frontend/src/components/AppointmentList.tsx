import { useState } from 'react';
import { AppointmentResponse } from '../types';
import {
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

const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  // Adjust formatting as needed; this will use the user's locale.
  return date.toLocaleString();
};

interface AppointmentListProps {
  onEdit: (appointment: AppointmentResponse) => void;
  onDelete: (appointment: AppointmentResponse) => void;
  appointments: AppointmentResponse[]
}

const AppointmentList = ({ appointments, onEdit, onDelete }: AppointmentListProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">Scheduled</Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600">Cancelled</Badge>
        );
      case 'no-show':
        return <Badge className="bg-red-500 hover:bg-red-600">No Show</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
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
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead className="hidden md:table-cell">ID</TableHead>
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
              <TableHead className="hidden md:table-cell">Doctor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No appointments found.
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((appointment) => (
                <TableRow key={appointment.appointment_uuid}>
                  <TableCell className="font-medium">
                    {appointment.patient_name}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {appointment.patient_uuid}
                  </TableCell>
                  <TableCell>{appointment.appointment_date}</TableCell>
                  <TableCell>{appointment.appointment_time}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {appointment.doctor_email}
                  </TableCell>
                  <TableCell>{getStatusBadge('completed')}</TableCell>
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AppointmentList;
