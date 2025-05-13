package controller

import (
	"encoding/json"
	"errors"
	"io"
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
		sendError(w, http.StatusNotFound, model.ErrorMessages.BoardNotFound) // Use a user-specific error if you add one
		return
	}
	sendJSON(w, http.StatusOK, user)
}

// UpdateUser handles PATCH /users/{id}
func (uc *UserController) UpdateUser(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	// Read and parse request body
	bodyBytes, err := io.ReadAll(r.Body)
	if err != nil {
		var maxBytesErr *http.MaxBytesError
		if errors.As(err, &maxBytesErr) {
			sendError(w, http.StatusRequestEntityTooLarge, "request body too large")
			return
		}
		sendError(w, http.StatusBadRequest, model.ErrorMessages.InvalidRequestBody)
		return
	}

	var body map[string]interface{}
	if err := json.Unmarshal(bodyBytes, &body); err != nil {
		sendError(w, http.StatusBadRequest, model.ErrorMessages.InvalidRequestBody)
		return
	}

	// Only 'username' is allowed
	rules := map[string]any{
		"username": "omitnil,type-string,min=2,max=50,isLatinOnly,notOnlyWhitespace",
	}

	// Check if any valid keys are present
	hasAtLeastOneRuleKey := false
	for key := range body {
		if _, exists := rules[key]; exists {
			hasAtLeastOneRuleKey = true
			break
		}
	}
	if !hasAtLeastOneRuleKey {
		sendError(w, http.StatusBadRequest, "at least one of username is required")
		return
	}

	// Validate the request body against the rules
	if err := model.ValidateMapCustom(model.GetValidator(), body, rules); err != nil {
		sendError(w, http.StatusBadRequest, err.Error())
		return
	}

	user, err := uc.service.UpdateUser(id, &body)
	if err != nil {
		if err.Error() == "user not found" { // Optionally check for a more specific error
			sendError(w, http.StatusNotFound, model.ErrorMessages.BoardNotFound)
			return
		}
		sendError(w, http.StatusInternalServerError, err.Error())
		return
	}

	sendJSON(w, http.StatusOK, user)
}
