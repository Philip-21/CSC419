package database

import (
	"errors"
	"fmt"
	"infosystem/models"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func GetAllAppointment(db *gorm.DB) ([]models.Appointment, error) {
	var appointments []models.Appointment
	err := db.Find(&appointments).Error

	if err != nil {
		return nil, fmt.Errorf("unable to find appointments %s", err)
	}
	return appointments, nil
}

func GetAllAppointmentByDoctor(db *gorm.DB, doctorUUID string) ([]models.Appointment, error) {
	var appointments []models.Appointment
	err := db.Where("doctor_uuid = ?", doctorUUID).Find(&appointments).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, fmt.Errorf("query DB: %s", err)
	}
	return appointments, nil
}

func BookAppointment(db *gorm.DB, doctorID, patientID int, doctorUUID string, patientUUID string, appoint *models.AppointmentRequest) (*models.Appointment, error) {
	appointment := &models.Appointment{
		PatientID:          patientID,
		DoctorID:           doctorID,
		PatientUUID:        patientUUID,
		DoctorUUID:         doctorUUID,
		AppointmentDate:    appoint.AppointmentDate,
		AppointmentTime:    appoint.AppointmentTime,
		AppointmentDetails: appoint.AppointmentDetails,
		AppointmentUUID:    uuid.NewString(),
		CreatedAt:          time.Now(),
	}
	err := db.Create(appointment).Error
	if err != nil {
		return nil, fmt.Errorf("unable to create user")
	}
	return appointment, nil
}

func UpdateAppointment(db *gorm.DB, patientUUID, doctorUUID string, appointmentTime, appointmentDetails string) (*models.Appointment, error) {
	var appointment *models.Appointment
	err := db.Where("patient_uuid = ? AND doctor_uuid = ?", patientUUID, doctorUUID).Error
	if err != nil {
		return nil, fmt.Errorf("unable to get appointment %s", err)
	}
	if appointmentTime != "" {
		appointment.AppointmentTime = appointmentTime
	}
	if appointmentDetails != "" {
		appointment.AppointmentDetails = appointmentDetails
	}
	err = db.Save(&appointment).Error
	if err != nil {
		return nil, fmt.Errorf("unable to update appointment : %s ", err)
	}
	return appointment, nil
}

func DeleteApppointment(db *gorm.DB, appoinmentUUID string) error {
	err := db.Where("appointment_uuid = ?", appoinmentUUID).Delete(&models.Appointment{}).Error
	if err != nil {
		return fmt.Errorf("unable to delete appointment : %s", err)
	}
	return nil
}

func DeleteAllAppointment(db *gorm.DB, pateintUUID string) error {
	var appointments []models.Appointment
	err := db.Where("patient_uuid = ?", pateintUUID).Delete(&appointments).Error
	if err != nil {
		return fmt.Errorf("unable to delete appointments : %s", err)
	}
	return nil
}

func GetAppointment(db *gorm.DB, appoinmentUUID string) (*models.Appointment, error) {
	var appointment models.Appointment
	err := db.Where("appointment_uuid = ?", appoinmentUUID).First(&appointment).Error
	if err != nil {
		return nil, fmt.Errorf("unable to get appointment")
	}
	return &appointment, nil
}
