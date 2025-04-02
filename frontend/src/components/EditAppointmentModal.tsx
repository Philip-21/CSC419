import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { AppointmentRequest, AppointmentResponse } from '../types';

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
import { toast } from "react-toastify"; 

interface EditAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentResponse;
}

const EditAppointmentModal = ({
  isOpen,
  onClose,
  appointment,
}: EditAppointmentModalProps) => {
  const { appointmentid } = useParams();
  const [form, setForm] = useState<AppointmentRequest>({
    doctor_email: appointment.doctor_email,
    appointment_details: appointment.appointment_details,
    appointment_time: appointment.appointment_time,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    try {
      await API.put(`/appointment/${appointmentid}`, form);
      toast.success("Appointment updated successfully");
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
                <Label htmlFor="date">Time</Label>
                <Input
                  type="datetime-local"
                  name="appointment_time"
                  value={form.appointment_time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctor_email">Doctor Email</Label>
              <Input
                type="email"
                name="doctor_email"
                value={form.doctor_email}
                onChange={handleChange}
                required
              />
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
          {error && <p className="text-red-500 my-4">{error}</p>}
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
