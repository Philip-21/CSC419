import { useState } from 'react';
import { AppointmentResponse } from '../types';
import { Sidebar } from '../components/Sidebar';
import AppointmentList from '../components/AppointmentList';
import { Header } from '../components/Header';
import EditAppointmentModal from '../components/EditAppointmentModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const Dashboard: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentResponse | null>(null);

  const handleEdit = (appointment: AppointmentResponse) => {
    setSelectedAppointment(appointment);
    setIsEditModalOpen(true);
  };

  const handleDelete = (appointment: AppointmentResponse) => {
    setSelectedAppointment(appointment);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteAppointment = () => {
    // In a real app, you would delete the appointment from your database

    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="flex h-screen w-full flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-muted/40 p-6">
          <div className="mx-auto max-w-6xl space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Appointments
              </h1>
              <p className="text-muted-foreground">
                Manage patient appointments and schedules
              </p>
            </div>
            <AppointmentList onEdit={handleEdit} onDelete={handleDelete} />
          </div>
        </main>
      </div>
      {selectedAppointment && (
        <>
          <EditAppointmentModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            appointment={selectedAppointment}
          />
          <DeleteConfirmationModal
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleDeleteAppointment}
            patientName={selectedAppointment.patient_name}
            appointmentId={selectedAppointment.appointment_uuid}
          />
        </>
      )}
    </div>
  );

  // return (
  //   <div className="min-h-screen bg-gray-50">
  //     {/* Hero Section */}
  //     <div className="bg-blue-500 py-12">
  //       <h1 className="text-center text-white text-4xl font-bold">
  //         Welcome to the Hospital Info System
  //       </h1>
  //       <p className="mt-4 text-center text-blue-100">
  //         Manage your appointments and access doctor information easily.
  //       </p>
  //     </div>

  //     {/* Action Cards */}
  //     <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
  //       {role !== 'doctor' && (
  //         <Link
  //           to="/appointment/book"
  //           className="bg-white rounded-lg shadow p-6 hover:shadow-xl transition"
  //         >
  //           <h2 className="text-xl font-bold text-blue-500 mb-2">
  //             Book Appointment
  //           </h2>
  //           <p className="text-gray-600">
  //             Schedule a new appointment with your preferred doctor.
  //           </p>
  //         </Link>
  //       )}
  //       <Link
  //         to="/appointments"
  //         className="bg-white rounded-lg shadow p-6 hover:shadow-xl transition"
  //       >
  //         <h2 className="text-xl font-bold text-blue-500 mb-2">
  //           My Appointments
  //         </h2>
  //         <p className="text-gray-600">
  //           View and manage your upcoming appointments.
  //         </p>
  //       </Link>
  //       <Link
  //         to="/doctors"
  //         className="bg-white rounded-lg shadow p-6 hover:shadow-xl transition"
  //       >
  //         <h2 className="text-xl font-bold text-blue-500 mb-2">Doctors List</h2>
  //         <p className="text-gray-600">
  //           Browse the list of available doctors and view their details.
  //         </p>
  //       </Link>
  //     </div>
  //   </div>
  // );
};

export default Dashboard;
