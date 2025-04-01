package main

import (
	"infosystem/database"
	"infosystem/handlers"
	"infosystem/routes.go"
	"log"
	"net/http"
)

// @title Group 14 Hospital Information System
func main() {
	serverPort := ":8080"

	dsn := "postgresql://philip:LeDpNidPhSjysDuRFHFsGKySnk29bntF@dpg-cvlppjh5pdvs73fbjlu0-a.oregon-postgres.render.com/postgresphil"
	//dsn1 := "postgresql://postgres:philippians@localhost:5432/postgres"
	db, err := database.ConnectToDB(dsn)
	if err != nil {
		log.Printf("Database connection error: %v", err)
		return
	}

	Handlers := handlers.NewHandlerService(db)

	r := routes.Routes(Handlers)
	srv := &http.Server{
		Addr:    serverPort,
		Handler: r,
	}
	err = srv.ListenAndServe()
	if err != nil && err != http.ErrServerClosed {
		log.Fatalf("Could not listen on %s: %v\n", srv.Addr, err)
	}
}
