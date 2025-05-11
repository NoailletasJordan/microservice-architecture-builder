package controller

import (
	"microservice-architecture-builder/backend/model"
	"microservice-architecture-builder/backend/service"
	"net/http"

	"github.com/go-chi/chi/v5"
)

type UserController struct {
	service *service.UserService
}

func NewUserController(service *service.UserService) *UserController {
	return &UserController{service: service}
}

// CreateUser handles POST /users
func (uc *UserController) CreateUser(w http.ResponseWriter, r *http.Request) {
	sendError(w, http.StatusNotImplemented, "not implemented")
}

// GetUserByID handles GET /users/{id}
func (uc *UserController) GetUserByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	user, err := uc.service.GetUserByID(id)
	if err != nil {
		sendError(w, http.StatusNotFound, model.ErrorMessages.BoardNotFound) // Use a user-specific error if you add one
		return
	}
	sendJSON(w, http.StatusOK, user)
}

// UpdateUser handles PATCH /users/{id}
func (uc *UserController) UpdateUser(w http.ResponseWriter, r *http.Request) {
	sendError(w, http.StatusNotImplemented, "not implemented")
}

// DeleteUser handles DELETE /users/{id}
func (uc *UserController) DeleteUser(w http.ResponseWriter, r *http.Request) {
	sendError(w, http.StatusNotImplemented, "not implemented")
}
