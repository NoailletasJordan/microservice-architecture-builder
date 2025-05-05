package tests

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"microservice-architecture-builder/backend/controller"
	"microservice-architecture-builder/backend/data"
	"microservice-architecture-builder/backend/model"
	"microservice-architecture-builder/backend/server"
	"microservice-architecture-builder/backend/service"

	"github.com/go-chi/chi/v5"
	_ "github.com/lib/pq"
)

type TestServer struct {
	Server     *httptest.Server
	Router     *chi.Mux
	Service    *service.BoardService
	Controller *controller.BoardController
}

func NewTestServer() *TestServer {
	var testDSN = os.Getenv("POSTGRES_TEST_DSN")

	store, err := data.NewPostgresStore(testDSN)
	if err != nil {
		log.Fatalf("Failed to connect to PostgreSQL: %v", err)
		panic(err)
	}
	boardService := service.NewBoardService(store)
	boardController := controller.NewBoardController(boardService)

	r := server.NewServer(boardController)

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

func cleanupTestBoards() {
	testDSN := os.Getenv("POSTGRES_TEST_DSN")
	store, err := data.NewPostgresStore(testDSN)
	if err != nil {
		panic(err)
	}
	defer store.DB().Close()
	store.DB().Exec("DELETE FROM tests")
}
