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

func CreateDoctor(db *gorm.DB, firstName, lastName, email, password string) (*models.Doctor, error) {
	hashPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	doc := &models.Doctor{
		DoctorUUID: uuid.NewString(),
		FirstName:  firstName,
		LastName:   lastName,
		Email:      email,
		Password:   string(hashPassword),
		Role:       "doctor",
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
	}
	err = db.Create(doc).Error
	if err != nil {
		return nil, err
	}
	return doc, nil
}

func AuthenticateDoctor(db *gorm.DB, email, password string) (*models.Doctor, error) {
	var doc *models.Doctor
	err := db.Where("email = ?", email).First(&doc).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		return nil, fmt.Errorf("unable to find email: %w", err)
	}
	err = bcrypt.CompareHashAndPassword([]byte(doc.Password), []byte(password))
	if err == bcrypt.ErrMismatchedHashAndPassword {
		log.Println("Password mismatch")
		return nil, errors.New("incorrect password")
	} else if err != nil {
		return nil, fmt.Errorf("unable to validate password: %w", err)
	}
	return doc, nil
}

func CheckDoctorEmailExist(db *gorm.DB, email string) error {
	var count int64
	err := db.
		Model(&models.Doctor{}).
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

func GetDoctor(db *gorm.DB, email string) (*models.Doctor, error) {
	var doc *models.Doctor

	err := db.Where("email = ?", email).First(&doc).Error
	if err != nil {
		return nil, fmt.Errorf("unable to get doctor by mail %s", err)
	}
	return doc, nil
}

func GetDoctorByUUID(db *gorm.DB, doctorUUID string) (*models.Doctor, error) {
	var doc *models.Doctor

	err := db.Where("doctor_uuid = ?", doctorUUID).First(&doc).Error
	if err != nil {
		return nil, fmt.Errorf("unable to get doctor details : %s ", doctorUUID)
	}
	return doc, nil
}

func GetAllDoctors(db *gorm.DB) ([]models.DoctorResp, error) {
	var allDoc []models.DoctorResp
	var doctors []models.Doctor

	err := db.Find(&doctors).Error
	if err != nil {
		return nil, fmt.Errorf("unable to get doctors : %s", err)
	}
	for _, doctor := range doctors {
		allDoc = append(allDoc, models.DoctorResp{
			DoctorEmail: doctor.Email,
			FirstName:   doctor.FirstName,
			LastName:    doctor.LastName,
			DoctorUUID:  doctor.DoctorUUID,
		})
	}
	return allDoc, nil
}
