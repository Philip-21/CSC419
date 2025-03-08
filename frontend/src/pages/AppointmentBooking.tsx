import React, { useState } from 'react';
import API from '../api';
import { AppointmentRequest } from '../types';

const AppointmentBooking: React.FC = () => {
  const [form, setForm] = useState<AppointmentRequest>({
    doctor_email: '',
    appointment_details: '',
    appointment_time: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/appointment/book', form);
      setMessage('Appointment booked successfully!');
      setError('');
      setForm({
        doctor_email: '',
        appointment_details: '',
        appointment_time: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to book appointment');
      setMessage('');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-2xl mb-4">Book an Appointment</h2>
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
            placeholder="HH:MM"
            value={form.appointment_time}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {message && <p className="text-green-500">{message}</p>}
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded"
        >
          Book Appointment
        </button>
      </form>
    </div>
  );
};

export default AppointmentBooking;
