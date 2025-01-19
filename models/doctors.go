package models

import "time"

type Doctor struct {
	DoctorID   int       `gorm:"column:doctor_id;primary_key"`
	Password   string    `gorm:"column:password"`
	DoctorUUID string    `gorm:"column:doctor_uuid"`
	Email      string    `gorm:"uniqueIndex;column:email;"`
	FirstName  string    `gorm:"column:first_name"`
	LastName   string    `gorm:"column:last_name"`
	Role       string    `gorm:"column:role;"`
	CreatedAt  time.Time `gorm:"column:created_at"`
	UpdatedAt  time.Time `gorm:"column:updated_at"`
}
