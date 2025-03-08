import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import { AppointmentRequest, AppointmentResponse } from '../types';

const AppointmentUpdate = () => {
  const { appointmentid } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<AppointmentRequest>({
    doctor_email: '',
    appointment_details: '',
    appointment_time: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/appointment/${appointmentid}`)
      .then((res) => {
        const data: AppointmentResponse = res.data.details;
        setForm({
          doctor_email: data.doctor_email,
          appointment_details: data.appointment_details,
          appointment_time: data.appointment_time,
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err.response?.data?.error || 'Failed to fetch appointment details'
        );
        setLoading(false);
      });
  }, [appointmentid]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.put(`/appointment/${appointmentid}`, form);
      navigate('/appointments');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update appointment');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-2xl mb-4">Update Appointment</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Doctor Email:</label>
          <input
            type="email"
            name="doctorEmail"
            value={form.doctor_email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Appointment Details:</label>
          <input
            type="text"
            name="appointmentDetails"
            value={form.appointment_details}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Appointment Time:</label>
          <input
            type="text"
            name="appointmentTime"
            value={form.appointment_time}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded"
        >
          Update Appointment
        </button>
      </form>
    </div>
  );
};

export default AppointmentUpdate;
