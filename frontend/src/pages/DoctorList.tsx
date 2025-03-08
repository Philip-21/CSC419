import React, { useEffect, useState } from 'react';
import API from '../api';
import { DoctorResp } from '../types';
import { Link } from 'react-router-dom';

const DoctorList: React.FC = () => {
  const [doctors, setDoctors] = useState<DoctorResp[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/doctors/all')
      .then((res) => setDoctors(res.data || []))
      .catch((err) =>
        setError(err.response?.data?.error || 'Failed to fetch doctors')
      );
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl mb-4">Available Doctors</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="divide-y">
        {doctors.map((doctor) => (
          <li
            key={doctor.doctor_uuid}
            className="p-4 flex justify-between items-center"
          >
            <div>
              <p>
                <strong>
                  {doctor.first_name} {doctor.last_name}
                </strong>
              </p>
              <p>{doctor.doctor_email}</p>
            </div>
            <Link
              to={`/doctors/${doctor.doctor_uuid}`}
              className="text-blue-500"
            >
              View Details
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorList;
