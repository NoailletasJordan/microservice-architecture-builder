package tests

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"math/big"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	"microservice-architecture-builder/backend/controller"
	"microservice-architecture-builder/backend/data"
	"microservice-architecture-builder/backend/model"
	"microservice-architecture-builder/backend/server"
	"microservice-architecture-builder/backend/service"

	"crypto/rand"

	"github.com/go-chi/chi/v5"
	"github.com/golang-jwt/jwt/v5"
	_ "github.com/lib/pq"
)

type BoardTestResources struct {
	Service *service.BoardService
}

type UserTestResources struct {
	Data *data.UserStore
}

type TestServer struct {
	Server *httptest.Server
	Router *chi.Mux
	Board  BoardTestResources
	User   UserTestResources
}

func NewTestServer() *TestServer {
	var testDSN = os.Getenv("POSTGRES_TEST_DSN")

	db, err := server.NewPostgresDB(testDSN)
	if err != nil {
		log.Fatalf("Failed to connect to PostgreSQL: %v", err)
		panic(err)
	}

	userStore := data.NewUserStore(db)
	userService := service.NewUserService(userStore)
	userController := controller.NewUserController(userService)

	boardStore := data.NewBoardStore(db)
	boardService := service.NewBoardService(boardStore, userService)
	boardController := controller.NewBoardController(boardService)

	r := server.NewServer(boardController, userController, userService)

	ts := httptest.NewServer(r)

	return &TestServer{
		Server: ts,
		Router: r,
		Board: BoardTestResources{
			Service: boardService,
		},
		User: UserTestResources{
			Data: userStore,
		},
	}
}

func (ts *TestServer) Close() {
	ts.Server.Close()
}

func createTestUser(t *testing.T, ts *TestServer) *model.User {
	randomID := "test_user_" + generateRandomStringOfLength(10)
	randomUsername := "user_" + generateRandomStringOfLength(8)
	user := model.User{
		ID:        randomID,
		Username:  randomUsername,
		Provider:  "google",
		CreatedAt: time.Now(),
	}

	err := ts.User.Data.Create(&user)
	if err != nil {
		t.Fatalf("Failed to create test user: %v", err)
	}
	return &user
}

// Helper function to create a test board
func createTestBoard(t *testing.T, ts *TestServer, userID string) *model.Board {
	board := map[string]string{
		"title": "Test Board",
		"data":  `{"example": "data"}`,
	}

	rr := makeRequest(t, ts, "POST", "/api/board/", board, &userID)
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
func makeRequest(t *testing.T, ts *TestServer, method, path string, body any, userID *string) *httptest.ResponseRecorder {
	var reqBody []byte
	var err error

	if body != nil {
		reqBody, err = json.Marshal(body)
		if err != nil {
			t.Fatalf("Failed to marshal request body: %v", err)
		}
	}

	req := httptest.NewRequest(method, path, bytes.NewBuffer(reqBody))
	if userID != nil {
		jwtSecret := os.Getenv("JWT_SECRET")
		if jwtSecret == "" {
			t.Fatalf("JWT_SECRET not set in environment")
		}
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"id": *userID,
		})
		signedToken, err := token.SignedString([]byte(jwtSecret))
		if err != nil {
			t.Fatalf("Failed to sign JWT: %v", err)
		}
		req.Header.Set("Authorization", "Bearer "+signedToken)
	}
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	ts.Router.ServeHTTP(rr, req)

	return rr
}

func cleanupTestOnTables() {
	testDSN := os.Getenv("POSTGRES_TEST_DSN")
	store, err := server.NewPostgresDB(testDSN)
	if err != nil {
		panic(err)
	}
	defer store.Close()

	tables := []string{"boards", "users"}
	for _, table := range tables {
		_, err = store.Exec(fmt.Sprintf("DELETE FROM %s", table))
		if err != nil {
			panic(err)
		}
	}
}

// Helper function to generate a random string of a given length
func generateRandomStringOfLength(length int) string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	result := make([]byte, length)
	for i := range result {
		num, err := rand.Int(rand.Reader, big.NewInt(int64(len(charset))))
		if err != nil {
			result[i] = 'a'
			continue
		}
		result[i] = charset[num.Int64()]
	}
	return string(result)
}
