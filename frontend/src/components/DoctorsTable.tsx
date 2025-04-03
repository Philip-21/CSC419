'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import API from '../api';
import { toast } from 'react-toastify';
import { DoctorResp } from '../types';

interface DoctorsTableProps {
  onViewDetails: (doctor: DoctorResp) => void;
}

export function DoctorsTable({ onViewDetails }: DoctorsTableProps) {
  const [doctors, setDoctors] = useState<DoctorResp[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    API.get('/doctors/all')
      .then((res) => setDoctors(res.data || []))
      .catch((err) =>
        toast.error(err.response?.data?.error || 'Failed to fetch doctors')
      )
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search doctors by name, specialty..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter by Department
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[200px]"
          ></DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-6 w-[150px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-[100px]" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-9 w-[80px] ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : doctors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No doctors found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              doctors.map((doctor) => (
                <TableRow key={doctor.doctor_uuid}>
                  <TableCell className="font-medium capitalize">
                    {doctor.first_name} {doctor.last_name}
                  </TableCell>
                  <TableCell>{doctor.doctor_email}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" onClick={() => onViewDetails(doctor)}>
                      View Profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
