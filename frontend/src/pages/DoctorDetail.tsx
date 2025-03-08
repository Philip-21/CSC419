import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { DoctorResp } from '../types';

const DoctorDetail: React.FC = () => {
  const { doctorid } = useParams();
  const [doctor, setDoctor] = useState<DoctorResp | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get(`/doctors/${doctorid}`)
      .then((res) => setDoctor(res.data))
      .catch((err) =>
        setError(err.response?.data?.error || 'Failed to fetch doctor details')
      );
  }, [doctorid]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!doctor) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-2xl mb-4">Doctor Details</h2>
      <p>
        <strong>Name:</strong> {doctor.first_name} {doctor.last_name}
      </p>
      <p>
        <strong>Email:</strong> {doctor.doctor_email}
      </p>
      {/* Additional details can be added here */}
    </div>
  );
};

export default DoctorDetail;
