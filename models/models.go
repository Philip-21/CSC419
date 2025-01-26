package models

import "time"

type Appointment struct {
	AppointmentID      int       `gorm:"column:appointment_id;primary_key"`
	PatientID          int       `gorm:"column:patient_id"`
	DoctorID           int       `gorm:"column:doctor_id"`
	AppointmentUUID    string    `gorm:"column:appointment_uuid"`
	PatientUUID        string    `gorm:"column:patient_uuid"`
	DoctorUUID         string    `gorm:"column:doctor_uuid"`
	CreatedAt          time.Time `gorm:"column:created_at"`
	AppointmentTime    string    `gorm:"column:appointment_time"`
	AppointmentDetails string    `gorm:"column:appointment_details"`
	//UpdatedAt     time.Time `gorm:"column:updated_at"`
}

type SignUpRequest struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

type SignUpResponse struct {
	UserUUID  string `json:"user_uuid"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Role      string `json:"role"`
	Token     string `json:"token"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Token    string `json:"token"`
}

type LoginResponse struct {
	UserUUID  string `json:"user_uuid"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Role      string `json:"role"`
	Token     string `json:"token"`
}

type AppointmentRequest struct {
	DoctorEmail        string `json:"doctor_email"`
	AppointmentDetails string `json:"appointment_details"`
	AppointmentTime    string `json:"appointment_time"`
}

type UpdateAppointmentRequest struct {
	AppointmentDetails string `json:"appointment_details"`
	AppointmentTime    string `json:"appointment_time"`
}

type AppointmentResponse struct {
	DoctorEmail        string `json:"doctor_email"`
	AppointmentDetails string `json:"appointment_details"`
	AppointmentTime    string `json:"appointment_time"`
	PatientName        string `json:"patient_name"`
	PatientEmail       string `json:"patient_email"`
	PatientUUID        string `json:"patient_uuid"`
	AppointmentUUID    string `json:"appointment_uuid"`
}
