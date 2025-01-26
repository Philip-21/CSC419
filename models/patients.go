package models

import "time"

type Patient struct {
	PatientID   int       `gorm:"column:patient_id;primary_key"`
	Password    string    `gorm:"column:password"`
	PatientUUID string    `gorm:"column:patient_uuid"`
	Email       string    `gorm:"uniqueIndex;column:email;" `
	FirstName   string    `gorm:"column:first_name"`
	LastName    string    `gorm:"column:last_name"`
	Role        string    `gorm:"column:role;"`
	CreatedAt   time.Time `gorm:"column:created_at"`
	UpdatedAt   time.Time `gorm:"column:updated_at"`
}
