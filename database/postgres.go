package database

import (
	"context"
	"infosystem/models"
	"log"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectToDB(dsn string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("error connecting to db:%v", err)
		return nil, err
	}
	err = db.AutoMigrate(&models.Appointment{}, &models.Doctor{}, &models.Patient{})
	if err != nil {
		log.Fatalf("error in migration : %s", err)
		return nil, err
	}
	err = AlterTables(db)
	if err != nil {
		return nil, err
	}
	sqlDB, err := db.DB()
	if err != nil {
		log.Println("error in getting sql connection:", err)
		return nil, err
	}
	err = sqlDB.Ping()
	if err != nil {
		log.Fatal("Error in connection", err)
		return nil, err
	}
	return db, nil

}

func AlterTables(db *gorm.DB) error {
	query := 
	`
	ALTER TABLE appointments ADD FOREIGN KEY (doctor_id)  REFERENCES doctors(doctor_id);
	ALTER TABLE appointments ADD FOREIGN KEY (patient_id) REFERENCES patients(patient_id);
	`
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	err := db.Exec(query).WithContext(ctx).Error
	if err != nil {
		log.Println("unable to alter users table :", err)
		return err
	}
	return nil
}
