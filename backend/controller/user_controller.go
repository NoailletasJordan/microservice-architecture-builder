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

// GetUserByID handles GET /users/{id}
func (uc *UserController) GetUserByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	user, err := uc.service.GetUserByID(id)
	if err != nil {
		sendError(w, http.StatusNotFound, model.ErrorMessages.NotFound)
		return
	}
	sendJSON(w, http.StatusOK, user)
}
