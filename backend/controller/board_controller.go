package controller

import (
	"database/sql"
	"encoding/json"
	"io"
	"net/http"

	"microservice-architecture-builder/backend/model"
	"microservice-architecture-builder/backend/service"

	"errors"

	"github.com/go-chi/chi/v5"
)

type ContextKey string

const UserContextKey ContextKey = "user"

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

// CreateBoardRequest is used for board creation requests (Swagger/docs only)
type CreateBoardRequest struct {
	Title    string  `json:"title" example:"My Board"`
	Owner    string  `json:"owner"`
	Data     string  `json:"data" example:"{\"nodes\":[],\"edges\":[]}"`
	Password *string `json:"password,omitempty" example:"secret"`
}

// CreateBoard godoc
// @Summary Create a new board
// @Description Create a new board. Allowed fields in the request body:
//   - title (string, required): Board title, 2-100 Latin characters, not only whitespace
//   - owner (string, required): Board owner, 2-50 Latin characters, not only whitespace
//   - data (string, required): Board data (must be valid JSON string), not only whitespace
//   - password (string, optional): Board password, not only whitespace
//
// No other fields are allowed. Extra fields will result in a 400 error.
// @Tags boards
// @Accept json
// @Produce json
// @Param board body controller.CreateBoardRequest true "Board creation payload"
// @Success 201 {object} model.Board
// @Failure 400 {object} ErrorResponse "Bad Request. Example: {\"error\": \"unexpected fields: [foo, bar]\"}"
// @Router /board/ [post]
func (c *BoardController) CreateBoard(w http.ResponseWriter, r *http.Request) {
	requestUser, ok := r.Context().Value(UserContextKey).(*model.User)
	if !ok {
		sendError(w, http.StatusUnauthorized, model.ErrorMessages.Unauthorized)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		var maxBytesErr *http.MaxBytesError
		if errors.As(err, &maxBytesErr) {
			sendError(w, http.StatusRequestEntityTooLarge, "request body too large")
			return
		}
		sendError(w, http.StatusBadRequest, model.ErrorMessages.InvalidRequestBody)
		return
	}
	var raw map[string]interface{}
	if err := json.Unmarshal(body, &raw); err != nil {
		sendError(w, http.StatusBadRequest, model.ErrorMessages.InvalidRequestBody)
		return
	}
	// Define rules for POST
	rules := map[string]any{
		"title":    "required,type-string,min=2,max=100,isLatinOnly,notOnlyWhitespace",
		"data":     "required,type-string,isLatinOnly,notOnlyWhitespace",
		"password": "omitnil,type-string,isLatinOnly,notOnlyWhitespace",
	}

	// Check for unknown keys
	if err := model.ValidateMapCustom(model.GetValidator(), raw, rules); err != nil {
		sendError(w, http.StatusBadRequest, err.Error())
		return
	}

	// Validate the data field as JSON
	if !isValidJSON(raw["data"].(string)) {
		sendError(w, http.StatusBadRequest, model.ErrorMessages.DataMustBeValidJSON)
		return
	}

	board, err := c.service.CreateBoard(&raw, requestUser.ID)
	if err != nil {
		if err.Error() == model.ErrorMessages.OwnerNotFound {
			sendError(w, http.StatusBadRequest, err.Error())
			return
		}

		sendError(w, http.StatusInternalServerError, err.Error())
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
	if _, ok := r.Context().Value(UserContextKey).(*model.User); !ok {
		sendError(w, http.StatusUnauthorized, model.ErrorMessages.Unauthorized)
		return
	}

	boards, err := c.service.GetAllBoards()
	if err != nil {
		sendError(w, http.StatusInternalServerError, err.Error())
		return
	}
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
	requestUser, ok := r.Context().Value(UserContextKey).(*model.User)
	if !ok {
		sendError(w, http.StatusUnauthorized, model.ErrorMessages.Unauthorized)
		return
	}

	id := chi.URLParam(r, "id")
	board, err := c.service.GetBoard(id, requestUser.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			sendError(w, http.StatusNotFound, model.ErrorMessages.NotFound)
			return
		}
		if err.Error() == model.ErrorMessages.Forbidden {
			sendError(w, http.StatusForbidden, err.Error())
			return
		}
		sendError(w, http.StatusInternalServerError, err.Error())
		return
	}

	sendJSON(w, http.StatusOK, board)
}

type UpdateBoardRequest struct {
	Title    *string `json:"title,omitempty" example:"Updated Board"`
	Data     *string `json:"data,omitempty" example:"{\"nodes\":[],\"edges\":[]}"`
	Password *string `json:"password,omitempty" example:"newsecret"`
}

// UpdateBoard godoc
// @Summary Update a board by ID
// @Description Update a board's details by its unique ID. Allowed fields in the request body:
//   - title (string, optional): Board title, 2-100 Latin characters, not only whitespace
//   - data (string, optional): Board data (must be valid JSON string), not only whitespace
//   - password (string, optional): Board password, not only whitespace
//
// At least one of these fields must be present. No other fields are allowed. Extra fields will result in a 400 error.
// @Tags boards
// @Accept json
// @Produce json
// @Param id path string true "Board ID"
// @Param board body UpdateBoardRequest true "Board update payload"
// @Success 200 {object} model.Board
// @Failure 400 {object} ErrorResponse "Bad Request. Example: {\"error\": \"unexpected fields: [foo, bar]\"} or {\"error\": \"at least one of title, data, password is required\"}"
// @Failure 404 {object} ErrorResponse
// @Router /board/{id} [patch]
func (c *BoardController) UpdateBoard(w http.ResponseWriter, r *http.Request) {
	requestUser, ok := r.Context().Value(UserContextKey).(*model.User)
	if !ok {
		sendError(w, http.StatusUnauthorized, model.ErrorMessages.Unauthorized)
		return
	}

	yBody, err := io.ReadAll(r.Body)
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
	if err := json.Unmarshal(yBody, &body); err != nil {
		sendError(w, http.StatusBadRequest, model.ErrorMessages.InvalidRequestBody)
		return
	}

	// Define rules for PATCH (all fields optional, but must be allowed)
	rules := map[string]any{
		"title":    "omitnil,type-string,min=2,max=100,isLatinOnly,notOnlyWhitespace",
		"data":     "omitnil,type-string,isLatinOnly,notOnlyWhitespace",
		"password": "omitnil,type-string,isLatinOnly,notOnlyWhitespace",
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
		sendError(w, http.StatusBadRequest, model.ErrorMessages.AtLeastOneFieldRequired)
		return
	}

	// Validate the data field as JSON
	if data, ok := body["data"]; ok {
		if !isValidJSON(data.(string)) {
			sendError(w, http.StatusBadRequest, model.ErrorMessages.DataMustBeValidJSON)
			return
		}
	}

	// Validate the request body against the rules
	if err := model.ValidateMapCustom(model.GetValidator(), body, rules); err != nil {
		sendError(w, http.StatusBadRequest, err.Error())
		return
	}

	id := chi.URLParam(r, "id")

	board, err := c.service.UpdateBoard(id, &body, requestUser.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			sendError(w, http.StatusNotFound, model.ErrorMessages.NotFound)
			return
		}
		if err.Error() == model.ErrorMessages.Forbidden {
			sendError(w, http.StatusForbidden, err.Error())
			return
		}
		sendError(w, http.StatusInternalServerError, err.Error())
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
	requestUser, ok := r.Context().Value(UserContextKey).(*model.User)
	if !ok {
		sendError(w, http.StatusUnauthorized, model.ErrorMessages.Unauthorized)
		return
	}

	id := chi.URLParam(r, "id")
	if err := c.service.DeleteBoard(id, requestUser.ID); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			sendError(w, http.StatusNotFound, model.ErrorMessages.NotFound)
			return
		}
		if err.Error() == model.ErrorMessages.Forbidden {
			sendError(w, http.StatusForbidden, err.Error())
			return
		}
		sendError(w, http.StatusInternalServerError, err.Error())
		return
	}

	sendJSON(w, http.StatusOK, map[string]string{"message": "Board deleted successfully"})
}

// BoardShareFragmentResponse is used for the share fragment response
// for Swagger/docs only
type BoardShareFragmentResponse struct {
	ShareFragment *string `json:"share_fragment"`
}

// GetBoardShareFragment godoc
// @Summary Get the share fragment of a board by ID
// @Description Get only the share_fragment field for a board by its unique ID
// @Tags boards
// @Accept json
// @Produce json
// @Param id path string true "Board ID"
// @Success 200 {object} controller.BoardShareFragmentResponse
// @Failure 404 {object} ErrorResponse
// @Router /board/{id}/sharefragment [get]
func (c *BoardController) GetBoardShareFragment(w http.ResponseWriter, r *http.Request) {
	if _, ok := r.Context().Value(UserContextKey).(*model.User); !ok {
		sendError(w, http.StatusUnauthorized, model.ErrorMessages.Unauthorized)
		return
	}

	id := chi.URLParam(r, "id")
	shareFragment, err := c.service.GetBoardShareFragment(id)
	if err != nil {
		sendError(w, http.StatusNotFound, model.ErrorMessages.NotFound)
		return
	}
	sendJSON(w, http.StatusOK, BoardShareFragmentResponse{ShareFragment: shareFragment})
}
