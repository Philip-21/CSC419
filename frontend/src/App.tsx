import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignupPatient from './pages/SignupPatient';
import SignupDoctor from './pages/SignupDoctor';
import LoginPatient from './pages/LoginPatient';
import LoginDoctor from './pages/LoginDoctor';
import Dashboard from './pages/Dashboard';
import AppointmentBooking from './pages/AppointmentBooking';
import AppointmentList from './pages/AppointmentList';
import AppointmentUpdate from './pages/AppointmentUpdate';
import DoctorList from './pages/DoctorList';
import DoctorDetail from './pages/DoctorDetail';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<SignupPatient />} />
        <Route path="/signup/doctor" element={<SignupDoctor />} />
        <Route path="/" element={<LoginPatient />} />
        <Route path="/login/doctor" element={<LoginDoctor />} />
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
          path="/appointments"
          element={
            <ProtectedRoute>
              <AppointmentList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointment/update/:appointmentid"
          element={
            <ProtectedRoute>
              <AppointmentUpdate />
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
    </Router>
  );
};

export default App;
