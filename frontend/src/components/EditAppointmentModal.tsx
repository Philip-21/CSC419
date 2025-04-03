import React, { useEffect, useState } from 'react';
import API from '../api';
import { AppointmentRequest, AppointmentResponse, DoctorResp } from '../types';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'react-toastify';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Loader2 } from 'lucide-react';

interface EditAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentResponse;
  setAppointments: React.Dispatch<React.SetStateAction<AppointmentResponse[]>>;
}

const EditAppointmentModal = ({
  isOpen,
  onClose,
  appointment,
  setAppointments,
}: EditAppointmentModalProps) => {
  const [form, setForm] = useState<AppointmentRequest>({
    doctor_email: appointment.doctor_email,
    appointment_details: appointment.appointment_details,
    appointment_time: appointment.appointment_time,
    appointment_date: appointment.appointment_date,
  });
  const [loading, setLoading] = useState(false);

  const [doctors, setDoctors] = useState<DoctorResp[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);

  // Simulate async fetching of doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      await API.get('/doctors/all')
        .then((res) => setDoctors(res.data || []))
        .catch((err) =>
          toast.error(err.response?.data?.error || 'Failed to fetch doctors')
        )
        .finally(() => {
          setIsLoadingDoctors(false);
        });
    };
    fetchDoctors();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSelectChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    try {
      await API.put(`/appointment/${appointment.appointment_uuid}`, form);
      setAppointments((prev) => {
        const index = prev.findIndex(
          (a) => a.appointment_uuid === appointment.appointment_uuid
        );
        prev[index] = { ...prev[index], ...form };
        return prev;
      });
      toast.success('Appointment updated successfully');
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Appointment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  type="date"
                  name="appointment_date"
                  value={form.appointment_date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  type="time"
                  name="appointment_time"
                  value={form.appointment_time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctor">Doctor</Label>
              {isLoadingDoctors ? (
                <div className="flex h-10 items-center justify-center rounded-md border border-input bg-background px-3">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Loading doctors...
                  </span>
                </div>
              ) : (
                <Select
                  value={form.doctor_email}
                  onValueChange={(value) =>
                    handleSelectChange('doctor_email', value)
                  }
                >
                  <SelectTrigger className="capitalize">
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem
                        key={doctor.doctor_uuid}
                        value={doctor.doctor_email}
                        className="capitalize"
                      >
                        {doctor.first_name} {doctor.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Details</Label>
              <Textarea
                name="appointment_details"
                value={form.appointment_details}
                onChange={handleChange}
                required
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAppointmentModal;
