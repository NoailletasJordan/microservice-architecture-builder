package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
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
	Service    *service.BoardService
	Controller *controller.BoardController
}

func NewTestServer() *TestServer {
	store := data.NewSupabaseStore()
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
		Service:    boardService,
		Controller: boardController,
	}
}

func (ts *TestServer) Close() {
	ts.Server.Close()
}

// Helper function to create a test board
func createTestBoard(t *testing.T, ts *TestServer) *model.Board {
	board := map[string]string{
		"title": "Test Board",
		"owner": "test_owner",
		"data":  `{"example": "data"}`,
	}

	rr := makeRequest(t, ts, "POST", "/api/board/", board)
	if rr.Code != http.StatusCreated {
		t.Fatalf("Failed to create test board: status %d, body %s", rr.Code, rr.Body.String())
	}
	var created model.Board
	if err := json.NewDecoder(rr.Body).Decode(&created); err != nil {
		t.Fatalf("Failed to decode created board: %v", err)
	}
	return &created
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

// Clean up all boards in Supabase after each test run
func cleanupSupabaseBoards() {
	client := &http.Client{}
	url := os.Getenv("SUPABASE_URL")
	key := os.Getenv("SUPABASE_PUBLIC_ANON_KEY")
	if url == "" || key == "" {
		panic("SUPABASE_URL and SUPABASE_PUBLIC_ANON_KEY must be set in environment")
	}
	// Only delete boards with id > 0 (id number trick)
	req, _ := http.NewRequest("DELETE", url+"?id=gt.0", nil)
	req.Header.Set("apikey", key)
	req.Header.Set("Authorization", "Bearer "+key)
	req.Header.Set("Prefer", "return=minimal")
	client.Do(req)
}
