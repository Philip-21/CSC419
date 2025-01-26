package handlers

import (
	"fmt"
	"infosystem/database"
	"infosystem/middleware"
	"infosystem/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *HandlerService) BookAppointment(ctx *gin.Context) {
	email, _, err := middleware.ExtractEmailUserCreds(ctx)
	if err != nil {
		return
	}
	var req *models.AppointmentRequest
	if err := ctx.BindJSON(&req); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Errorf("unable to bind JSON :%s", err)})
		return
	}
	Patient, err := database.GetPatient(h.DB, email)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	Doctor, err := database.GetDoctor(h.DB, req.DoctorEmail)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	Appointment, err := database.BookAppointment(h.DB, Doctor.DoctorID, Patient.PatientID, Doctor.DoctorUUID, Patient.PatientUUID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "appoitment created",
		"details": &models.AppointmentResponse{
			DoctorEmail:        Doctor.Email,
			PatientEmail:       Patient.Email,
			PatientName:        Patient.FirstName,
			PatientUUID:        Patient.PatientUUID,
			AppointmentDetails: Appointment.AppointmentDetails,
			AppointmentTime:    Appointment.AppointmentTime,
			AppointmentUUID:    Appointment.AppointmentUUID,
		}})
}

