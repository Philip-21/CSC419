import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location =  useLocation();
   const first_name = localStorage.getItem("first_name");
   const last_name = localStorage.getItem("last_name");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const initials = `${first_name?.charAt(0) ?? ""}${
    last_name?.charAt(0) ?? ""
  }`;

  const isLoggedIn = !!first_name;
  const hideLoggedInUI =
      location.pathname === "/login" || location.pathname === "/signin" || location.pathname === "/";

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-blue-500">
            Hospital Management System
          </span>
        </div>
        {isLoggedIn && !hideLoggedInUI && (
          <div className="flex items-center">
            <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 uppercase font-bold">
              {initials}
            </div>
            <span className="mr-4 capitalize text-gray-600 font-medium">
              {first_name} {last_name}
            </span>
            <button
              onClick={handleLogout}
              className="bg-white-500 text-red-700 px-4 py-2 rounded border border-red-600 hover:bg-red-800 hover:text-white transition duration-300"
            >
              Log out
            </button>
          </div>
        )}
        {/* <div className="flex space-x-6">
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
        </div> */}
      </div>
    </nav>
  );
};

export default Navbar;
