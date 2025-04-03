import React, { useState } from 'react';
import { DoctorResp } from '../types';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { DoctorsTable } from '../components/DoctorsTable';
import { DoctorDetailModal } from '../components/DoctorDetailModal';

const DoctorList: React.FC = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorResp | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleViewDoctorDetails = (doctor: DoctorResp) => {
    setSelectedDoctor(doctor);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="flex h-screen w-full flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-muted/40 p-6">
          <div className="mx-auto max-w-6xl space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Our Doctors</h1>
              <p className="text-muted-foreground">
                Browse our team of experienced healthcare professionals
              </p>
            </div>
            <DoctorsTable onViewDetails={handleViewDoctorDetails} />
          </div>
        </main>
      </div>

      {selectedDoctor && (
        <DoctorDetailModal
          doctor={selectedDoctor}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}
    </div>
  );
};

export default DoctorList;
