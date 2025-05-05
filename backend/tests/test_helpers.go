package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"microservice-architecture-builder/backend/controller"
	"microservice-architecture-builder/backend/data"
	"microservice-architecture-builder/backend/model"
	"microservice-architecture-builder/backend/server"
	"microservice-architecture-builder/backend/service"

	"io/ioutil"
	"strings"

	"github.com/go-chi/chi/v5"
)

type TestServer struct {
	Server     *httptest.Server
	Router     *chi.Mux
	Service    *service.BoardService
	Controller *controller.BoardController
}

func NewTestServerWithDSN(dsn string) *TestServer {
	ensureTestTable(dsn)
	store, err := data.NewPostgresStore(dsn)
	if err != nil {
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

func NewTestServer() *TestServer {
	testDSN := os.Getenv("POSTGRES_TEST_DSN")
	if testDSN == "" {
		testDSN = "host=localhost port=5432 user=postgres password=postgres dbname=mas_test sslmode=disable"
	}
	return NewTestServerWithDSN(testDSN)
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

// Clean up all boards in the database after each test run
func cleanupBoardsWithDSN(dsn string) {
	store, err := data.NewPostgresStore(dsn)
	if err != nil {
		panic(err)
	}
	store.DB().Exec("DELETE FROM tests")
}

func cleanupBoards() {
	testDSN := os.Getenv("POSTGRES_TEST_DSN")
	if testDSN == "" {
		testDSN = "host=localhost port=5432 user=postgres password=postgres dbname=mas_test sslmode=disable"
	}
	cleanupBoardsWithDSN(testDSN)
}

// Ensure the 'tests' table exists with the same schema as 'boards'
func ensureTestTable(dsn string) {
	store, err := data.NewPostgresStore(dsn)
	if err != nil {
		panic(err)
	}
	sqlBytes, err := ioutil.ReadFile("../../postgres/init-db.sql")
	if err != nil {
		panic(err)
	}
	sqlStr := strings.ReplaceAll(string(sqlBytes), "boards", "tests")
	_, err = store.DB().Exec(sqlStr)
	if err != nil {
		panic(err)
	}
}
