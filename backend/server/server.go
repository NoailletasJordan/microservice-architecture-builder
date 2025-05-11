package server

import (
	"microservice-architecture-builder/backend/controller"

	"net/http"

	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
	httpSwagger "github.com/swaggo/http-swagger"
)

const maxBodySize = 3 << 20 // 3MB

// MaxBodySizeMiddleware enforces a hard limit on the size of incoming request bodies.
// If the body exceeds maxBodySize, it responds with 413 and closes the connection.
func MaxBodySizeMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost, http.MethodPut, http.MethodPatch:
			r.Body = http.MaxBytesReader(w, r.Body, maxBodySize)
		}
		next.ServeHTTP(w, r)
	})
}

// NewServer creates a new chi.Mux with all middleware and routes registered.
func NewServer(boardController *controller.BoardController) *chi.Mux {
	r := chi.NewRouter()

	r.Use(chimiddleware.Logger)
	r.Use(chimiddleware.Recoverer)
	r.Use(MaxBodySizeMiddleware)

	r.Route("/api/board", func(r chi.Router) {
		r.Post("/", boardController.CreateBoard)
		r.Get("/", boardController.GetAllBoards)
		r.Get("/{id}", boardController.GetBoard)
		r.Get("/{id}/sharefragment", boardController.GetBoardShareFragment)
		r.Patch("/{id}", boardController.UpdateBoard)
		r.Delete("/{id}", boardController.DeleteBoard)
	})

	r.Get("/docs/*", httpSwagger.WrapHandler)

	return r
}
