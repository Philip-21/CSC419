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
	dsn := "postgresql://postgres:philippians@localhost:5432/postgres"

	db, err := database.ConnectToDB(dsn)
	if err != nil {
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
