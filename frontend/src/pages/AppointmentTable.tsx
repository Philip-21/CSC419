import { useState } from "react";
import React from "react";
import { AppointmentResponse } from "../types";

interface AppointmentTableProps {
  appointments: AppointmentResponse[];
  handleDelete: (appointmentUUID: string) => Promise<void>;
  deleteModalOpen: boolean;
  setDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const formatAppointmentDateTime = (isoString: string) => {
  const dateObj = new Date(isoString);

  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const formattedTime = dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return { formattedDate, formattedTime };
};


 

const AppointmentTable: React.FC<AppointmentTableProps> = ({
  appointments, handleDelete, deleteModalOpen, setDeleteModalOpen
}) => {
     const [appointmentToDelete, setAppointmentToDelete] = useState<
       string | null
     >(null);

     const cancelDelete = () => {
       setDeleteModalOpen(false);
       setAppointmentToDelete(null);
     };

     const checkDelete = (appointmentUUID: string) => {
       setAppointmentToDelete(appointmentUUID);
       setDeleteModalOpen(true);
     };


  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-600">
              Doctor
            </th>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-600">
              Date
            </th>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-600">
              Time
            </th>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-600">
              Details
            </th>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {appointments.map((appt) => {
            const { formattedDate, formattedTime } = formatAppointmentDateTime(
              appt.appointment_time
            );
            return (
              <tr key={appt.appointment_uuid}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  Dr {appt.doctor_email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formattedDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formattedTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                  {appt.appointment_details}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-left">
                  <button
                    onClick={() => checkDelete(appt.appointment_uuid)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {deleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-600">
              Confirm Delete
            </h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to cancel your appointment?
            </p>
            <div className="flex justify-end">
              <button
                onClick={cancelDelete}
                className="mr-4 px-8 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-100 transition"
              >
                No
              </button>
              <button
                onClick={() =>
                  appointmentToDelete && handleDelete(appointmentToDelete)
                }
                className="px-8 py-2 bg-red-700 text-white rounded hover:bg-red-800 transition"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentTable;
