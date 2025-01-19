package routes

import (
	_ "infosystem/docs"
	"infosystem/handlers"

	"github.com/gin-gonic/gin"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func Routes(ctrl *handlers.HandlerService) *gin.Engine {
	router := gin.Default()

	router.POST("/signup/patient", ctrl.RegisterPatient)
	router.POST("/signup/doctor", ctrl.RegisterDoctor)
	router.POST("/signin/doctor", ctrl.LoginDoctor)
	router.POST("/signin/patient", ctrl.LoginPatient)
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	return router
}
