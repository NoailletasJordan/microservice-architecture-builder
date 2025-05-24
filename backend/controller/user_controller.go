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

// GetMe godoc
// @Summary Get current user
// @Description Get the details of the currently authenticated user
// @Tags users
// @Accept json
// @Produce json
// @Security Bearer
// @Param Authorization header string true "Bearer token"
// @Success 200 {object} model.User
// @Failure 401 {object} ErrorResponse "Unauthorized"
// @Router /users/me [get]
func (uc *UserController) GetMe(w http.ResponseWriter, r *http.Request) {
	user, ok := r.Context().Value(UserContextKey).(*model.User)
	if !ok || user == nil {
		sendError(w, http.StatusUnauthorized, helpers.ErrorMessages.Unauthorized)
		return
	}
	sendJSON(w, http.StatusOK, user)
}
