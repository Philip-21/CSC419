import { useEffect, useState } from 'react';
import { AppointmentRequest, AppointmentResponse } from '../types';
import { Sidebar } from '../components/Sidebar';
import AppointmentList from '../components/AppointmentList';
import { Header } from '../components/Header';
import EditAppointmentModal from '../components/EditAppointmentModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import API from '../api';
import { toast } from 'react-toastify';
import { NewAppointmentModal } from '../components/NewAppointmentModal';
import { CancelAllConfirmationDialog } from '../components/CancelAllConfirmationDialog';
import { AppointmentStats } from '../components/AppointmentStats';

const Dashboard: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] =
    useState(false);
  const [isCancelAllDialogOpen, setIsCancelAllDialogOpen] = useState(false);

  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentResponse | null>(null);
  const userUUID = localStorage.getItem('userUUID');
  const role = localStorage.getItem('role');
  const [loading, setLoading] = useState(true);

  const handleEdit = (appointment: AppointmentResponse) => {
    setSelectedAppointment(appointment);
    setIsEditModalOpen(true);
  };

  const handleDelete = (appointment: AppointmentResponse) => {
    setSelectedAppointment(appointment);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteAppointment = async () => {
    const appointmentUUID = selectedAppointment?.appointment_uuid;
    try {
      await API.delete(`/delete/${appointmentUUID}`);
      setAppointments(
        appointments.filter((a) => a.appointment_uuid !== appointmentUUID)
      );
      toast.success('Appointment deleted successfully');
      setIsDeleteDialogOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete appointment');
      setIsDeleteDialogOpen(false);
    }
  };

  const handleCreateAppointment = async (form: AppointmentRequest) => {
    setLoading(true);
    try {
      const result = await API.post('/appointment/book', form);
      toast.success('Appointment booked successfully!');
      setAppointments((prev) => [...prev, result.data.details]);
      setIsNewAppointmentModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAllAppointments = async () => {
    try {
      await API.delete(`/delete-all/${userUUID}`);
      setAppointments([]);
      toast.success('All appointments cancelled successfully');
      setIsDeleteDialogOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to cancel appointments');
      setIsDeleteDialogOpen(false);
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      if (userUUID) {
        const patientRoute = `/appointment/pat-all/${userUUID}`;
        const doctorRoute = `/appointment/doc-all`;
        const isPatient = role === 'patient';
        API.get(isPatient ? patientRoute : doctorRoute)
          .then((res) => {
            setAppointments((isPatient ? res.data : res.data.details) || []);
          })
          .catch((err) =>
            toast.error(
              err.response?.data?.error || 'Failed to fetch appointments'
            )
          )
          .finally(() => setLoading(false));
      }
    };
    fetchAppointments();
  }, [userUUID, role]);

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
                {role === 'patient'
                  ? 'Manage your appointments and access doctor information'
                  : 'Manage patient appointments and schedules'}
              </p>
            </div>
            <AppointmentStats appointments={appointments} />

            <AppointmentList
              appointments={appointments}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onNewAppointment={() => setIsNewAppointmentModalOpen(true)}
              onCancelAllAppointments={() => setIsCancelAllDialogOpen(true)}
            />
          </div>
        </main>
      </div>
      {selectedAppointment && (
        <>
          {isEditModalOpen && (
            <EditAppointmentModal
              isOpen={isEditModalOpen}
              onClose={async () =>
                setTimeout(() => setIsEditModalOpen(false), 200)
              }
              appointment={selectedAppointment}
            />
          )}
          {isDeleteDialogOpen && (
            <DeleteConfirmationModal
              isOpen={isDeleteDialogOpen}
              onClose={async () =>
                setTimeout(() => setIsDeleteDialogOpen(false), 200)
              }
              onConfirm={handleDeleteAppointment}
              patientName={selectedAppointment.patient_name}
              appointmentId={selectedAppointment.appointment_uuid}
            />
          )}
        </>
      )}
      {isNewAppointmentModalOpen && (
        <NewAppointmentModal
          isOpen={isNewAppointmentModalOpen}
          onClose={async () =>
            setTimeout(() => setIsNewAppointmentModalOpen(false), 200)
          }
          loading={loading}
          onSave={handleCreateAppointment}
        />
      )}
      <CancelAllConfirmationDialog
        isOpen={isCancelAllDialogOpen}
        onClose={() => setIsCancelAllDialogOpen(false)}
        onConfirm={handleCancelAllAppointments}
        appointmentCount={appointments.length}
      />
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
