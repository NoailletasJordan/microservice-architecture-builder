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

func (c *BoardController) CreateBoard(w http.ResponseWriter, r *http.Request) {
	var board model.Board
	if err := json.NewDecoder(r.Body).Decode(&board); err != nil {
		sendError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if err := c.service.CreateBoard(&board); err != nil {
		sendError(w, http.StatusBadRequest, err.Error())
		return
	}

	sendJSON(w, http.StatusCreated, board)
}

func (c *BoardController) GetAllBoards(w http.ResponseWriter, r *http.Request) {
	boards := c.service.GetAllBoards()
	sendJSON(w, http.StatusOK, boards)
}

func (c *BoardController) GetBoard(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	board, err := c.service.GetBoard(id)
	if err != nil {
		sendError(w, http.StatusNotFound, err.Error())
		return
	}

	sendJSON(w, http.StatusOK, board)
}

func (c *BoardController) UpdateBoard(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var board model.Board
	if err := json.NewDecoder(r.Body).Decode(&board); err != nil {
		sendError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if err := c.service.UpdateBoard(id, &board); err != nil {
		sendError(w, http.StatusBadRequest, err.Error())
		return
	}

	sendJSON(w, http.StatusOK, board)
}

func (c *BoardController) DeleteBoard(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if err := c.service.DeleteBoard(id); err != nil {
		sendError(w, http.StatusNotFound, err.Error())
		return
	}

	sendJSON(w, http.StatusOK, map[string]string{"message": "Board deleted successfully"})
}
