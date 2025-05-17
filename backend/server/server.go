package server

import (
	"context"
	"database/sql"
	"microservice-architecture-builder/backend/controller"
	"microservice-architecture-builder/backend/service"

	"net/http"
	"os"
	"strings"

	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/golang-jwt/jwt/v5"
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

func grabAssociatedUserMiddleware(userService *service.UserService) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if !strings.HasPrefix(authHeader, "Bearer ") {
				next.ServeHTTP(w, r)
				return
			}
			tokenString := strings.TrimPrefix(authHeader, "Bearer ")
			jwtSecret := os.Getenv("JWT_SECRET")
			if jwtSecret == "" {
				next.ServeHTTP(w, r)
				return
			}
			token, err := jwt.Parse(tokenString, func(token *jwt.Token) (any, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, jwt.ErrSignatureInvalid
				}
				return []byte(jwtSecret), nil
			})
			if err != nil || !token.Valid {
				next.ServeHTTP(w, r)
				return
			}
			claims, ok := token.Claims.(jwt.MapClaims)
			if !ok {
				next.ServeHTTP(w, r)
				return
			}

			userId, ok := claims["id"].(string)
			if !ok || userId == "" {
				next.ServeHTTP(w, r)
				return
			}

			user, err := userService.GetUserByID(userId)
			if err != nil {
				next.ServeHTTP(w, r)
				return
			}

			ctx := r.Context()
			ctx = context.WithValue(ctx, controller.UserContextKey, user)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// NewServer creates a new chi.Mux with all middleware and routes registered.
func NewServer(boardController *controller.BoardController, userController *controller.UserController, userService *service.UserService, oauthController *controller.OauthController) *chi.Mux {
	r := chi.NewRouter()

	r.Use(chimiddleware.Logger)
	r.Use(chimiddleware.Recoverer)
	r.Use(MaxBodySizeMiddleware)
	r.Use(grabAssociatedUserMiddleware(userService))

	r.Route("/api/board", func(r chi.Router) {
		r.Post("/", boardController.CreateBoard)
		r.Get("/", boardController.GetAllBoards)
		r.Get("/{id}", boardController.GetBoard)
		r.Get("/{id}/sharefragment", boardController.GetBoardShareFragment)
		r.Patch("/{id}", boardController.UpdateBoard)
		r.Delete("/{id}", boardController.DeleteBoard)
	})

	r.Route("/api/users", func(r chi.Router) {
		r.Get("/me", userController.GetMe)
	})

	// Use OauthController for these routes
	r.Get("/auth/google/login", oauthController.GoogleLoginRedirect)
	r.Get("/auth/google/callback", oauthController.GoogleCallbackHandler)
	r.Get("/docs/*", httpSwagger.WrapHandler)

	return r
}

// NewPostgresDB creates a PostgresStore. DSN must be provided, or it panics.
func NewPostgresDB(dsn string) (*sql.DB, error) {
	if dsn == "" {
		panic("Postgres DSN must be provided to NewPostgresStore")
	}
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, err
	}
	if err := db.Ping(); err != nil {
		return nil, err
	}
	return db, nil
}
