package controller

import (
	"microservice-architecture-builder/backend/model"
	"microservice-architecture-builder/backend/service"
	"microservice-architecture-builder/backend/helpers"
	"net/http"
)

type UserController struct {
	service *service.UserService
}

func NewUserController(service *service.UserService) *UserController {
	return &UserController{service: service}
}

// GetMe handles GET /users/me
func (uc *UserController) GetMe(w http.ResponseWriter, r *http.Request) {
	user, ok := r.Context().Value(UserContextKey).(*model.User)
	if !ok || user == nil {
		sendError(w, http.StatusUnauthorized, helpers.ErrorMessages.Unauthorized)
		return
	}
	sendJSON(w, http.StatusOK, user)
}
