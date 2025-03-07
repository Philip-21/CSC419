package handlers

import (
	"infosystem/database"
	"infosystem/middleware"
	"infosystem/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type HandlerService struct {
	DB *gorm.DB
}

func NewHandlerService(db *gorm.DB) *HandlerService {
	return &HandlerService{
		DB: db,
	}
}
func (h *HandlerService) HealthCheck(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"message": "Hospital Management System is running"})
}

// @Summary      Register as a Patient
// @Param        user body models.SignUpRequest true "payload"
// @Success      201 {object} models.SignUpResponse
// @Router       /signup/patient [post]
// @Tags         Authentication Handlers
func (h *HandlerService) RegisterPatient(ctx *gin.Context) {
	var req *models.SignUpRequest
	if err := ctx.BindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := database.CheckPatientEmailExist(h.DB, req.Email)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	resp, err := database.CreatePatient(h.DB, req.FirstName, req.LastName, req.Email, req.Password)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	token, err := middleware.GenerateToken(req.Email)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Successfully SignedUp",
		"details": &models.SignUpResponse{
			UserUUID:  resp.PatientUUID,
			Email:     resp.Email,
			FirstName: resp.FirstName,
			LastName:  resp.LastName,
			Role:      resp.Role,
			Token:     token,
		}})
}

// @Summary      Register as a Doctor
// @Param        user body models.SignUpRequest true "payload"
// @Success      201 {object} models.SignUpResponse
// @Router       /signup/doctor [post]
// @Tags         Authentication Handlers
func (h *HandlerService) RegisterDoctor(ctx *gin.Context) {
	var req *models.SignUpRequest
	if err := ctx.BindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := database.CheckDoctorEmailExist(h.DB, req.Email)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	resp, err := database.CreateDoctor(h.DB, req.FirstName, req.LastName, req.Email, req.Password)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	token, err := middleware.GenerateToken(req.Email)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Successfully SignedUp",
		"details": &models.SignUpResponse{
			UserUUID:  resp.DoctorUUID,
			Email:     resp.Email,
			FirstName: resp.FirstName,
			LastName:  resp.LastName,
			Role:      resp.Role,
			Token:     token,
		}})
}

// @Summary      Login as a Doctor
// @Param        user body models.LoginRequest true "payload"
// @Success      201 {object} models.LoginResponse
// @Router       /signin/doctor [post]
// @Tags         Authentication Handlers
func (h *HandlerService) LoginDoctor(ctx *gin.Context) {
	var req *models.LoginRequest
	if err := ctx.BindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	resp, err := database.AuthenticateDoctor(h.DB, req.Email, req.Password)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid credentials"})
		return
	}
	token, err := middleware.GenerateToken(req.Email)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": "Authenticated",
		"details": &models.LoginResponse{
			UserUUID:  resp.DoctorUUID,
			Email:     resp.Email,
			FirstName: resp.FirstName,
			LastName:  resp.LastName,
			Role:      resp.Role,
			Token:     token,
		},
	})
}

// @Summary      Login as a Patient
// @Param        user body models.LoginRequest true "payload"
// @Success      201 {object} models.LoginResponse
// @Router       /signin/patient [post]
// @Tags         Authentication Handlers
func (h *HandlerService) LoginPatient(ctx *gin.Context) {
	var req *models.LoginRequest
	if err := ctx.BindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	resp, err := database.AuthenticatePatient(h.DB, req.Email, req.Password)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid credentials"})
		return
	}
	token, err := middleware.GenerateToken(req.Email)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": "Authenticated",
		"details": &models.LoginResponse{
			UserUUID:  resp.PatientUUID,
			Email:     resp.Email,
			FirstName: resp.FirstName,
			LastName:  resp.LastName,
			Role:      resp.Role,
			Token:     token,
		},
	})

}
