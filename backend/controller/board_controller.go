package controller

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"microservice-architecture-builder/backend/model"
	"microservice-architecture-builder/backend/service"

	"github.com/go-chi/chi/v5"
)

type BoardController struct {
	service *service.BoardService
}

func NewBoardController(service *service.BoardService) *BoardController {
	return &BoardController{service: service}
}

type ErrorResponse struct {
	Error string `json:"error"`
}

func sendJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func sendError(w http.ResponseWriter, status int, message string) {
	sendJSON(w, status, ErrorResponse{Error: message})
}

// validateAllowedFields checks if the input JSON contains only allowed keys.
// It ignores system fields (id, created_at, deleted) if present.
func validateAllowedFields(body []byte, allowedFields map[string]struct{}) (extraKeys []string, err error) {
	var raw map[string]interface{}
	if err := json.Unmarshal(body, &raw); err != nil {
		return nil, fmt.Errorf("Invalid request body")
	}
	for k := range raw {
		if k == "id" || k == "created_at" || k == "deleted" {
			continue // ignore system fields
		}
		if _, ok := allowedFields[k]; !ok {
			extraKeys = append(extraKeys, k)
		}
	}
	return extraKeys, nil
}

// CreateBoard godoc
// @Summary Create a new board
// @Description Create a new board. Allowed fields: title (required), owner (required), data (required), password (optional). No other fields allowed.
// @Tags boards
// @Accept json
// @Produce json
// @Param board body model.Board true "Board object (only title, owner, data, password allowed)"
// @Success 201 {object} model.Board
// @Failure 400 {object} ErrorResponse "Bad Request. Example: {\"error\": \"unexpected fields: [foo, bar]\"}"
// @Router /board/ [post]
func (c *BoardController) CreateBoard(w http.ResponseWriter, r *http.Request) {
	allowed := map[string]struct{}{"title": {}, "owner": {}, "data": {}, "password": {}}
	body, err := io.ReadAll(r.Body)
	if err != nil {
		sendError(w, http.StatusBadRequest, "Invalid request body")
		return
	}
	extraKeys, err := validateAllowedFields(body, allowed)
	if err != nil {
		sendError(w, http.StatusBadRequest, err.Error())
		return
	}
	if len(extraKeys) > 0 {
		sendError(w, http.StatusBadRequest, fmt.Sprintf("unexpected fields: %v", extraKeys))
		return
	}
	var board model.Board
	if err := json.Unmarshal(body, &board); err != nil {
		sendError(w, http.StatusBadRequest, "Invalid request body")
		return
	}
	// Zero out fields that should not be set by the user
	board.ID = ""
	board.CreatedAt = board.CreatedAt
	board.Deleted = nil
	if err := c.service.CreateBoard(&board); err != nil {
		if se, ok := err.(*service.SupabaseError); ok {
			sendError(w, se.StatusCode, se.Message)
		} else {
			sendError(w, http.StatusInternalServerError, err.Error())
		}
		return
	}
	sendJSON(w, http.StatusCreated, board)
}

// GetAllBoards godoc
// @Summary Get all boards
// @Description Get a list of all boards
// @Tags boards
// @Accept json
// @Produce json
// @Success 200 {array} model.Board
// @Router /board/ [get]
func (c *BoardController) GetAllBoards(w http.ResponseWriter, r *http.Request) {
	boards := c.service.GetAllBoards()
	sendJSON(w, http.StatusOK, boards)
}

// GetBoard godoc
// @Summary Get a board by ID
// @Description Get a board by its unique ID
// @Tags boards
// @Accept json
// @Produce json
// @Param id path string true "Board ID"
// @Success 200 {object} model.Board
// @Failure 400 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Router /board/{id} [get]
func (c *BoardController) GetBoard(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	board, err := c.service.GetBoard(id)
	if err != nil {
		if se, ok := err.(*service.SupabaseError); ok {
			sendError(w, se.StatusCode, se.Message)
		} else {
			sendError(w, http.StatusInternalServerError, err.Error())
		}
		return
	}

	sendJSON(w, http.StatusOK, board)
}

// UpdateBoard godoc
// @Summary Update a board by ID
// @Description Update a board's details by its unique ID. Allowed fields: title, data, password. At least one must be present. No other fields allowed.
// @Tags boards
// @Accept json
// @Produce json
// @Param id path string true "Board ID"
// @Param board body model.Board true "Board object (only title, data, password allowed)"
// @Success 200 {object} model.Board
// @Failure 400 {object} ErrorResponse "Bad Request. Example: {\"error\": \"unexpected fields: [foo, bar]\"} or {\"error\": \"at least one of title, data, password is required\"}"
// @Failure 404 {object} ErrorResponse
// @Router /board/{id} [patch]
func (c *BoardController) UpdateBoard(w http.ResponseWriter, r *http.Request) {
	allowed := map[string]struct{}{"title": {}, "data": {}, "password": {}}
	body, err := io.ReadAll(r.Body)
	if err != nil {
		sendError(w, http.StatusBadRequest, "Invalid request body")
		return
	}
	var raw map[string]interface{}
	if err := json.Unmarshal(body, &raw); err != nil {
		sendError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Check for any disallowed fields
	for k := range raw {
		if _, ok := allowed[k]; !ok {
			sendError(w, http.StatusBadRequest, fmt.Sprintf("field '%s' is not allowed", k))
			return
		}
	}
	// Check if at least one allowed field is present
	hasAtLeastOneAllowed := false
	for k := range raw {
		if _, ok := allowed[k]; ok {
			hasAtLeastOneAllowed = true
			break
		}
	}
	if !hasAtLeastOneAllowed {
		sendError(w, http.StatusBadRequest, "at least one of title, data, password is required")
		return
	}

	// Zero out fields that should not be set by the user
	board.ID = ""
	board.CreatedAt = board.CreatedAt
	board.Deleted = nil
	// Only validate present fields for PATCH
	if err := board.ValidatePatch(raw); err != nil {
		sendError(w, http.StatusBadRequest, err.Error())
		return
	}
	id := chi.URLParam(r, "id")
	if err := c.service.UpdateBoard(id, &board); err != nil {
		if se, ok := err.(*service.SupabaseError); ok {
			sendError(w, se.StatusCode, se.Message)
		} else {
			sendError(w, http.StatusInternalServerError, err.Error())
		}
		return
	}
	sendJSON(w, http.StatusOK, board)
}

// DeleteBoard godoc
// @Summary Delete a board by ID
// @Description Delete a board by its unique ID
// @Tags boards
// @Accept json
// @Produce json
// @Param id path string true "Board ID"
// @Success 200 {object} map[string]string
// @Failure 400 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Router /board/{id} [delete]
func (c *BoardController) DeleteBoard(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if err := c.service.DeleteBoard(id); err != nil {
		if se, ok := err.(*service.SupabaseError); ok {
			sendError(w, se.StatusCode, se.Message)
		} else {
			sendError(w, http.StatusInternalServerError, err.Error())
		}
		return
	}

	sendJSON(w, http.StatusOK, map[string]string{"message": "Board deleted successfully"})
}
