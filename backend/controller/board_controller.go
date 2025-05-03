package controller

import (
	"encoding/json"
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

// CreateBoard godoc
// @Summary Create a new board
// @Description Create a new board with title, owner, and data
// @Tags boards
// @Accept json
// @Produce json
// @Param board body model.Board true "Board object"
// @Success 201 {object} model.Board
// @Failure 400 {object} ErrorResponse
// @Router /board/ [post]
func (c *BoardController) CreateBoard(w http.ResponseWriter, r *http.Request) {
	var board model.Board
	if err := json.NewDecoder(r.Body).Decode(&board); err != nil {
		sendError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

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
// @Description Update a board's details by its unique ID
// @Tags boards
// @Accept json
// @Produce json
// @Param id path string true "Board ID"
// @Param board body model.Board true "Board object"
// @Success 200 {object} model.Board
// @Failure 400 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Router /board/{id} [patch]
func (c *BoardController) UpdateBoard(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var board model.Board
	if err := json.NewDecoder(r.Body).Decode(&board); err != nil {
		sendError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

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
