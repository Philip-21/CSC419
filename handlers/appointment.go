package handlers

import (
	"fmt"
	"infosystem/database"
	"infosystem/middleware"
	"infosystem/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// @Summary      Patient books an appointment
// @Param        user body models.AppointmentRequest true "payload"
// @Success      201 {object} models.AppointmentResponse
// @Router       /appointment/book [post]
// @Tags         Appointment Handlers
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

// @Summary      Doctor gets all his appointments
// @Success      200 {object} []models.AppointmentResponse
// @Router       /appointment/doc-all [get]
// @Tags         Appointment Handlers
func (h *HandlerService) GetAllAppointmentByDoctor(ctx *gin.Context) {
	email, _, err := middleware.ExtractEmailUserCreds(ctx)
	if err != nil {
		return
	}
	doctor, err := database.GetDoctor(h.DB, email)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	Appointments, err := database.GetAllAppointmentByDoctor(h.DB, doctor.DoctorUUID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	for _, appointment := range Appointments {
		Patient, err := database.GetPatientByUUID(h.DB, appointment.PatientUUID)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		Doctor, err := database.GetDoctorByUUID(h.DB, appointment.DoctorUUID)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		obtainedAppointment := models.AppointmentResponse{
			DoctorEmail:        Doctor.Email,
			AppointmentDetails: appointment.AppointmentDetails,
			AppointmentTime:    appointment.AppointmentTime,
			PatientName:        Patient.FirstName,
			PatientEmail:       Patient.Email,
			AppointmentUUID:    appointment.AppointmentUUID,
		}
		ctx.JSON(http.StatusOK, gin.H{"details": obtainedAppointment})
	}
}

// @Summary      Get an appointment, Doctor or Patient views an appointment
// @Success      201 {object} models.AppointmentResponse
// @Router       /appointment/{appointmentid} [get]
// @Param        appointmentid path string true "Apointment UUID"
// @Tags         Appointment Handlers
func (h *HandlerService) GetAppointment(ctx *gin.Context) {
	appointmentUUID := ctx.Param("appointmentid")

	appointment, err := database.GetAppointment(h.DB, appointmentUUID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	Patient, err := database.GetPatientByUUID(h.DB, appointment.PatientUUID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	Doctor, err := database.GetDoctorByUUID(h.DB, appointment.DoctorUUID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	obtainedAppointment := models.AppointmentResponse{
		DoctorEmail:        Doctor.Email,
		AppointmentDetails: appointment.AppointmentDetails,
		AppointmentTime:    appointment.AppointmentTime,
		PatientName:        Patient.FirstName,
		PatientEmail:       Patient.Email,
		AppointmentUUID:    appointment.AppointmentUUID,
	}
	ctx.JSON(http.StatusOK, gin.H{"details": obtainedAppointment})
}

// @Summary      Delete an appointment by a Doctor or Patient
// @Success      200  "Appointment deleted successfully"
// @Router       /delete/{appointmentid} [delete]
// @Param        appointmentid path string true "Apointment UUID"
// @Tags         Appointment Handlers
func (h *HandlerService) DeleteApppointment(ctx *gin.Context) {
	appointmentUUID := ctx.Param("appointmentid")
	err := database.DeleteApppointment(h.DB, appointmentUUID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, "Appointment deleted successfully")
}

// @Summary      Delete all appointment by a Doctor or Patient
// @Success      200 "All appointments deleted successfully"
// @Router       /delete-all/{patientid} [delete]
// @Param        appointmentid path string true "Apointment UUID"
// @Tags         Appointment Handlers
func (h *HandlerService) DeleteAllAppointment(ctx *gin.Context) {
	patientID := ctx.Param("pateintid")
	err := database.DeleteAllAppointment(h.DB, patientID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, "All appointments deleted successfully")
}

// @Summary      Patient gets all his appointments
// @Success      200 {object} []models.AppointmentResponse
// @Router       /appointment/pat-all [get]
// @Tags         Appointment Handlers
func (h *HandlerService) PatientGetAllAppointment(ctx *gin.Context) {
	patientID := ctx.Param("pateintid")

	appointmentRsp, err := database.GetPatientAppointments(h.DB, patientID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, appointmentRsp)
}
