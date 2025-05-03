package controller

import (
	"encoding/json"
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

// isValidJSON checks if a string is valid JSON.
func isValidJSON(s string) bool {
	var js json.RawMessage
	return json.Unmarshal([]byte(s), &js) == nil
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
	// Define rules for POST
	rules := map[string]any{
		"title":    "required,type-string,min=2,max=100",
		"owner":    "required,type-string,min=2,max=50",
		"data":     "required,type-string",
		"password": "omitempty,type-string",
	}
	// Check for unknown keys
	if err := model.ValidateMapCustom(model.GetValidator(), raw, rules); err != nil {
		sendError(w, http.StatusBadRequest, err.Error())
		return
	}

	// Validate the data field as JSON
	if !isValidJSON(raw["data"].(string)) {
		sendError(w, http.StatusBadRequest, "data must be valid JSON")
		return
	}

	board, err := c.service.CreateBoard(&raw)
	if err != nil {
		if serviceError, ok := err.(*service.SupabaseError); ok {
			sendError(w, serviceError.StatusCode, serviceError.Message)
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
	yBody, err := io.ReadAll(r.Body)
	if err != nil {
		sendError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	var body map[string]interface{}
	if err := json.Unmarshal(yBody, &body); err != nil {
		sendError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Define rules for PATCH (all fields optional, but must be allowed)
	rules := map[string]any{
		"title":    "omitempty,type-string,min=2,max=100",
		"data":     "omitempty,type-string",
		"password": "omitempty,type-string",
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
		sendError(w, http.StatusBadRequest, "at least one of title, data, password is required")
		return
	}

	// Validate the data field as JSON
	if data, ok := body["data"]; ok {
		if !isValidJSON(data.(string)) {
			sendError(w, http.StatusBadRequest, "data must be valid JSON")
			return
		}
	}

	// Validate the request body against the rules
	if err := model.ValidateMapCustom(model.GetValidator(), body, rules); err != nil {
		sendError(w, http.StatusBadRequest, err.Error())
		return
	}

	id := chi.URLParam(r, "id")

	board, err := c.service.UpdateBoard(id, &body)
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
