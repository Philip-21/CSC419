import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-500 py-12">
        <h1 className="text-center text-white text-4xl font-bold">
          Welcome to the Hospital Info System
        </h1>
        <p className="mt-4 text-center text-blue-100">
          Manage your appointments and access doctor information easily.
        </p>
      </div>

      {/* Action Cards */}
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/appointment/book"
          className="bg-white rounded-lg shadow p-6 hover:shadow-xl transition"
        >
          <h2 className="text-xl font-bold text-blue-500 mb-2">
            Book Appointment
          </h2>
          <p className="text-gray-600">
            Schedule a new appointment with your preferred doctor.
          </p>
        </Link>
        <Link
          to="/appointments"
          className="bg-white rounded-lg shadow p-6 hover:shadow-xl transition"
        >
          <h2 className="text-xl font-bold text-blue-500 mb-2">
            My Appointments
          </h2>
          <p className="text-gray-600">
            View and manage your upcoming appointments.
          </p>
        </Link>
        <Link
          to="/doctors"
          className="bg-white rounded-lg shadow p-6 hover:shadow-xl transition"
        >
          <h2 className="text-xl font-bold text-blue-500 mb-2">Doctors List</h2>
          <p className="text-gray-600">
            Browse the list of available doctors and view their details.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
