export interface SignUpRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  user_uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user_uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  token: string;
}

export interface AppointmentRequest {
  // doctorEmail: string;
  // appointmentDetails: string;
  // appointmentTime: string;
  doctor_email: string;
  appointment_details: string;
  appointment_time: string;
  appointment_date: string;
}

export interface AppointmentResponse {
  // doctorEmail: string;
  // patientEmail: string;
  // patientName: string;
  // patientUUID?: string;
  // appointmentDetails: string;
  // appointmentTime: string;
  // appointmentDate?: string;
  // appointmentUUID: string;

  doctor_email: string;
  doctor_name: string;
  patient_email: string;
  patient_name: string;
  patient_uuid?: string;
  appointment_details: string;
  appointment_time: string;
  appointment_date: string;
  appointment_uuid: string;
}

export interface DoctorResp {
  // doctorEmail: string;
  // firstName: string;
  // lastName: string;
  // doctorUUID: string;

  doctor_email: string;
  first_name: string;
  last_name: string;
  doctor_uuid: string;
}
