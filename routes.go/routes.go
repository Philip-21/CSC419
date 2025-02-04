package routes

import (
	_ "infosystem/docs"
	"infosystem/handlers"
	"infosystem/middleware"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func Routes(ctrl *handlers.HandlerService) *gin.Engine {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"},
		AllowHeaders: []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "Origin", "X-Requested-With",
			"Cache-Control", "User-Agent", "Referer", "If-Modified-Since", "If-None-Match", "Range", "Host", "X-Custom-Header",
			"Cookie", "Access-Control-Request-Method", "Access-Control-Request-Headers", "Accept-Encoding", "Connection", "Token", "X-header",
		},
		ExposeHeaders:    []string{"Link"},
		AllowCredentials: true,
		MaxAge:           24 * time.Hour,
	}))
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	router.POST("/signup/patient", ctrl.RegisterPatient)
	router.POST("/signup/doctor", ctrl.RegisterDoctor)
	router.POST("/signin/doctor", ctrl.LoginDoctor)
	router.POST("/signin/patient", ctrl.LoginPatient)

	router.Use(middleware.Auth())
	router.POST("/appointment/book", ctrl.BookAppointment)
	router.GET("/appointment/doc-all", ctrl.GetAllAppointmentByDoctor)
	router.GET("/appointment/pat-all/:patientid", ctrl.PatientGetAllAppointment)
	router.GET("/appointment/:appointmentid", ctrl.GetAppointment)
	router.DELETE("/delete/:appointmentid", ctrl.DeleteApppointment)
	router.DELETE("/delete-all/:patientid", ctrl.DeleteAllAppointment)
	router.GET("/doctors/all", ctrl.GetAllDoctors)

	return router
}
