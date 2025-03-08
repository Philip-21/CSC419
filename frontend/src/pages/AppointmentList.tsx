import React, { useEffect, useState } from 'react';
import API from '../api';
import { AppointmentResponse } from '../types';
import { useNavigate } from 'react-router-dom';

const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  // Adjust formatting as needed; this will use the user's locale.
  return date.toLocaleString();
};

const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userUUID = localStorage.getItem('userUUID');

  useEffect(() => {
    // Assuming the logged-in user is a patient
    if (userUUID) {
      API.get(`/appointment/pat-all/${userUUID}`)
        .then((res) => setAppointments(res.data || []))
        .catch((err) =>
          setError(err.response?.data?.error || 'Failed to fetch appointments')
        );
    }
  }, [userUUID]);

  const handleDelete = async (appointmentUUID: string) => {
    try {
      await API.delete(`/delete/${appointmentUUID}`);
      setAppointments(
        appointments.filter((a) => a.appointment_uuid !== appointmentUUID)
      );
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete appointment');
    }
  };

  const handleUpdate = (appointmentUUID: string) => {
    navigate(`/appointment/update/${appointmentUUID}`);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl mb-4">Your Appointments</h2>
      {error && <p className="text-red-500">{error}</p>}
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <ul className="divide-y">
          {appointments.map((app) => (
            <li
              key={app.appointment_uuid}
              className="p-4 flex justify-between items-center"
            >
              <div>
                <p>
                  <strong>Doctor:</strong> {app.doctor_email}
                </p>
                <p>
                  <strong>Time:</strong> {formatDateTime(app.appointment_time)}
                </p>
                <p>
                  <strong>Details:</strong> {app.appointment_details}
                </p>
              </div>
              <div>
                <button
                  onClick={() => handleUpdate(app.appointment_uuid)}
                  className="mr-2 bg-yellow-500 text-white p-1 rounded"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(app.appointment_uuid)}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AppointmentList;
