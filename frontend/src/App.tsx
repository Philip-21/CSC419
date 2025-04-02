import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPatient from './pages/SignupPatient';
import SignupDoctor from './pages/SignupDoctor';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AppointmentBooking from './pages/AppointmentBooking';
import DoctorList from './pages/DoctorList';
import DoctorDetail from './pages/DoctorDetail';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup/patient" element={<SignupPatient />} />
        <Route path="/signup/doctor" element={<SignupDoctor />} />
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointment/book"
          element={
            <ProtectedRoute>
              <AppointmentBooking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctors"
          element={
            <ProtectedRoute>
              <DoctorList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctors/:doctorid"
          element={
            <ProtectedRoute>
              <DoctorDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer position="top-right" autoClose={2000} />
    </Router>
  );
};

export default App;
