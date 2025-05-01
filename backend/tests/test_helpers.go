package tests

import (
	"bytes"
	"encoding/json"
	"net/http/httptest"
	"strings"
	"testing"

	"microservice-architecture-builder/backend/controller"
	"microservice-architecture-builder/backend/data"
	"microservice-architecture-builder/backend/model"
	"microservice-architecture-builder/backend/service"

	"github.com/go-chi/chi/v5"
)

type TestServer struct {
	Server     *httptest.Server
	Router     *chi.Mux
	Store      *data.BoardStore
	Service    *service.BoardService
	Controller *controller.BoardController
}

func NewTestServer() *TestServer {
	store := data.NewBoardStore()
	boardService := service.NewBoardService(store)
	boardController := controller.NewBoardController(boardService)

	r := chi.NewRouter()
	r.Route("/api/board", func(r chi.Router) {
		r.Post("/", boardController.CreateBoard)
		r.Get("/", boardController.GetAllBoards)
		r.Get("/{id}", boardController.GetBoard)
		r.Patch("/{id}", boardController.UpdateBoard)
		r.Delete("/{id}", boardController.DeleteBoard)
	})

	ts := httptest.NewServer(r)

	return &TestServer{
		Server:     ts,
		Router:     r,
		Store:      store,
		Service:    boardService,
		Controller: boardController,
	}
}

func (ts *TestServer) Close() {
	ts.Server.Close()
}

// Helper function to create a test board
func createTestBoard(t *testing.T, ts *TestServer) *model.Board {
	board := &model.Board{
		Title: "Test Board",
		Owner: "test_owner",
		Data:  `{"test": "data"}`,
	}

	err := ts.Service.CreateBoard(board)
	if err != nil {
		t.Fatalf("Failed to create test board: %v", err)
	}

	return board
}

// Helper function to make HTTP requests
func makeRequest(t *testing.T, ts *TestServer, method, path string, body interface{}) *httptest.ResponseRecorder {
	var reqBody []byte
	var err error

	if body != nil {
		reqBody, err = json.Marshal(body)
		if err != nil {
			t.Fatalf("Failed to marshal request body: %v", err)
		}
	}

	req := httptest.NewRequest(method, path, bytes.NewBuffer(reqBody))
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	ts.Router.ServeHTTP(rr, req)

	return rr
}

// Helper function to generate a long string of specified length
func generateLongString(length int) string {
	return strings.Repeat("a", length)
}
