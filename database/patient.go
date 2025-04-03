package database

import (
	"errors"
	"fmt"
	"infosystem/models"
	"log"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"

	"gorm.io/gorm"
)

func CreatePatient(db *gorm.DB, firstName, lastName, email, password string) (*models.Patient, error) {
	hashPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	patient := &models.Patient{
		PatientUUID: uuid.NewString(),
		FirstName:   firstName,
		LastName:    lastName,
		Email:       email,
		Password:    string(hashPassword),
		Role:        "patient",
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}
	err = db.Create(patient).Error
	if err != nil {
		return nil, err
	}
	return patient, nil
}

func AuthenticatePatient(db *gorm.DB, email, password string) (*models.Patient, error) {
	var patient *models.Patient
	err := db.Where("email = ?", email).First(&patient).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		return nil, fmt.Errorf("unable to find email: %w", err)
	}
	err = bcrypt.CompareHashAndPassword([]byte(patient.Password), []byte(password))
	if err == bcrypt.ErrMismatchedHashAndPassword {
		log.Println("Password mismatch")
		return nil, errors.New("incorrect password")
	} else if err != nil {
		return nil, fmt.Errorf("unable to validate password: %w", err)
	}
	return patient, nil
}

func CheckPatientEmailExist(db *gorm.DB, email string) error {
	var count int64
	err := db.
		Model(&models.Patient{}).
		Where("email = ?", email).
		Count(&count).Error
	if err != nil {
		return errors.New("unable to check duplicacy")
	}
	if count > 0 {
		return fmt.Errorf("an account with  %s already exists", email)
	}
	return nil
}

func GetPatient(db *gorm.DB, email string) (*models.Patient, error) {
	var pateint *models.Patient

	err := db.Where("email = ?", email).First(&pateint).Error
	if err != nil {
		return nil, fmt.Errorf("unable to get patient by mail %s", err)
	}
	return pateint, nil
}

func GetPatientByUUID(db *gorm.DB, patientUUID string) (*models.Patient, error) {
	var patient *models.Patient

	err := db.Where("patient_uuid = ?", patientUUID).First(&patient).Error
	if err != nil {
		return nil, fmt.Errorf("unable get patient : %s", err)
	}
	return patient, nil
}

func GetPatientAppointments(db *gorm.DB, patientUUID string) ([]models.AppointmentResponse, error) {
	var appointments []models.Appointment
	var appointmentRsp []models.AppointmentResponse

	err := db.Where("patient_uuid = ?", patientUUID).Find(&appointments).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, fmt.Errorf("unable to handle transaction : %w", err)
	}
	for _, appointment := range appointments {
		doctor, err := GetDoctorByUUID(db, appointment.DoctorUUID)
		if err != nil {
			return nil, err
		}
		patient, err := GetPatientByUUID(db, appointment.PatientUUID)
		if err != nil {
			return nil, err
		}
		appointmentRsp = append(appointmentRsp, models.AppointmentResponse{
			DoctorEmail:        doctor.Email,
			DoctorName:         doctor.FirstName,
			AppointmentDetails: appointment.AppointmentDetails,
			AppointmentTime:    appointment.AppointmentTime,
			AppointmentDate:    appointment.AppointmentDate,
			AppointmentUUID:    appointment.AppointmentUUID,
			PatientName:        patient.FirstName,
			PatientEmail:       patient.Email,
			PatientUUID:        patient.PatientUUID,
		})
	}
	return appointmentRsp, nil
}
