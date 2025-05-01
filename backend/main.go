package main

import (
	"fmt"
	"log"
	"net/http"

	"microservice-architecture-builder/backend/controller"
	"microservice-architecture-builder/backend/data"
	"microservice-architecture-builder/backend/service"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
	// Initialize dependencies
	store := data.NewBoardStore()
	boardService := service.NewBoardService(store)
	boardController := controller.NewBoardController(boardService)

	// Create router
	r := chi.NewRouter()

	// Middleware
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	// Routes
	r.Route("/api/board", func(r chi.Router) {
		r.Post("/", boardController.CreateBoard)
		r.Get("/", boardController.GetAllBoards)
		r.Get("/{id}", boardController.GetBoard)
		r.Patch("/{id}", boardController.UpdateBoard)
		r.Delete("/{id}", boardController.DeleteBoard)
	})

	// Start server
	port := ":8080"
	fmt.Printf("Server starting on port %s\n", port)
	log.Fatal(http.ListenAndServe(port, r))
}
