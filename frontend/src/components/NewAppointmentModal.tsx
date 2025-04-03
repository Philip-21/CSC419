'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { AppointmentRequest, DoctorResp } from '../types';
import API from '../api';
import { toast } from 'react-toastify';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: AppointmentRequest) => Promise<void>;
  loading: boolean;
}

export function NewAppointmentModal({
  isOpen,
  onClose,
  onSave,
  loading,
}: NewAppointmentModalProps) {
  const [formData, setFormData] = useState<AppointmentRequest>({
    doctor_email: '',
    appointment_details: '',
    appointment_time: '',
    appointment_date: '',
  });

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
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
    setFormData({
      doctor_email: '',
      appointment_details: '',
      appointment_time: '',
      appointment_date: '',
    });
  };

  const isFormValid = () => {
    return (
      formData.doctor_email.trim() !== '' &&
      formData.appointment_date.trim() !== '' &&
      formData.appointment_time.trim() !== ''
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule New Appointment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
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
                  value={formData.doctor_email}
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
              <Label htmlFor="notes">Appointment Details</Label>
              <Textarea
                name="appointment_details"
                value={formData.appointment_details}
                onChange={handleChange}
                rows={3}
                placeholder="Enter appointment reason and any relevant details"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appointment_date">Date</Label>
                <Input
                  id="appointment_date"
                  name="appointment_date"
                  type="date"
                  value={formData.appointment_date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="appointment_time">Time</Label>
                <Input
                  id="appointment_time"
                  name="appointment_time"
                  type="time"
                  value={formData.appointment_time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid() || isLoadingDoctors || loading}
            >
              {loading ? 'Scheduling...' : 'Schedule Appointment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
