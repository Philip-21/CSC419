import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-blue-500">
            Hospital Info System
          </span>
        </div>
        <div className="flex space-x-6">
          <Link to="/dashboard" className="text-gray-700 hover:text-blue-500">
            Dashboard
          </Link>
          <Link
            to="/appointments"
            className="text-gray-700 hover:text-blue-500"
          >
            My Appointments
          </Link>
          <Link to="/doctors" className="text-gray-700 hover:text-blue-500">
            Doctors
          </Link>
          <Link to="/" className="text-gray-700 hover:text-blue-500">
            Patient Login
          </Link>
          <Link to="/signup" className="text-gray-700 hover:text-blue-500">
            Patient Signup
          </Link>
          <Link
            to="/login/doctor"
            className="text-gray-700 hover:text-blue-500"
          >
            Doctor Login
          </Link>
          <Link
            to="/signup/doctor"
            className="text-gray-700 hover:text-blue-500"
          >
            Doctor Signup
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
