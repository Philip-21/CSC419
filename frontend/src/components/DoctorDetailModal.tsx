'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { DoctorResp } from '../types';

interface DoctorDetailModalProps {
  doctor: DoctorResp;
  isOpen: boolean;
  onClose: () => void;
}

export function DoctorDetailModal({
  doctor,
  isOpen,
  onClose,
}: DoctorDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Doctor Information</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold capitalize">
              {doctor.first_name} {doctor.last_name}
            </h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <a
                href={`mailto:${doctor.doctor_email}`}
                className="text-blue-600 hover:underline"
              >
                {doctor.doctor_email}
              </a>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
