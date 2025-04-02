import React, { useEffect, useState } from 'react';
import API from '../api';
import { AppointmentResponse } from '../types';
import { useNavigate } from 'react-router-dom';
import AppointmentTable from './AppointmentTable';
import { toast } from "react-toastify";



const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const navigate = useNavigate();
  const userUUID = localStorage.getItem('userUUID');
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (userUUID) {
      const patientRoute = `/appointment/pat-all/${userUUID}`;
      const doctorRoute = `/appointment/doc-all`;
      const isPatient = role === 'patient';
      API.get(isPatient ? patientRoute : doctorRoute)
        .then((res) => {
          console.log(res, 'res');
          
          setAppointments((isPatient ? res.data : res.data.details) || []);
        })
        .catch((err) =>
          setError(err.response?.data?.error || 'Failed to fetch appointments')
        );
    }
    setLoading(false);
  }, [userUUID, role]);

  const handleDelete = async (appointmentUUID: string) => {
    try {
      await API.delete(`/delete/${appointmentUUID}`);
      setAppointments(
        appointments.filter((a) => a.appointment_uuid !== appointmentUUID)
      );
      toast.success("Appointment deleted successfully");
      setDeleteModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to delete appointment");
      setDeleteModalOpen(false);
    }
  };


  const handleUpdate = (appointmentUUID: string) => {
    navigate(`/appointment/update/${appointmentUUID}`);
  };


  return (
    <div className="container bg-white w-[90%] mx-auto mt-10 max-w-6xl rounded-lg shadow p-6 hover:shadow-xl transition p-8">
      <h2 className="text-lg mb-2 font-bold text-gray-600">
        Your Appointments
      </h2>
      <div className="mb-4">
        <hr />
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading...</p>}
      {!loading && !error && appointments.length === 0 && (
        <p>No appointments found.</p>
      )}
      {!loading && !error && appointments.length > 0 && (
        <AppointmentTable
          appointments={appointments}
          handleDelete={handleDelete}
          deleteModalOpen={deleteModalOpen}
          setDeleteModalOpen={setDeleteModalOpen}
        />
      )}
    </div>
  );
};

export default AppointmentList;
