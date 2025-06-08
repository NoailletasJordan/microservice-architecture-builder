package tests

import (
	"bytes"
	"context"
	"crypto/rand"
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
	"microservice-architecture-builder/backend/helpers"
	"microservice-architecture-builder/backend/model"
	"microservice-architecture-builder/backend/server"
	"microservice-architecture-builder/backend/service"

	"github.com/go-chi/chi/v5"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/testcontainers/testcontainers-go/modules/postgres"
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

func newTestPostgres(ctx context.Context) (*postgres.PostgresContainer, string, error) {
	postgresContainer, err := postgres.Run(ctx,
		"postgres:latest",
		postgres.WithInitScripts("../../postgres/init-db.sh"),
		postgres.WithDatabase("test"),
		postgres.WithUsername("postgres"),
		postgres.WithPassword("postgres"),
		postgres.BasicWaitStrategies(),
	)

	if err != nil {
		return nil, "", fmt.Errorf("failed to start container: %w", err)
	}

	connStr, err := postgresContainer.ConnectionString(ctx, "sslmode=disable")
	if err != nil {
		return nil, "", fmt.Errorf("failed to get connection string: %w", err)
	}

	return postgresContainer, connStr, nil
}

func NewTestServer(t *testing.T) (*TestServer, func()) {
	err := godotenv.Load("../../.env")
	if err != nil {
		t.Fatalf("failed to load environment variables: %v", err)
	}
	ctx := context.Background()
	container, connStr, err := newTestPostgres(ctx)
	if err != nil {
		t.Fatalf("failed to create postgres container: %v", err)
	}

	db, err := server.NewPostgresDB(connStr)
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

	oauthController := controller.NewOAuthController(GetUserStructFromGoogleMock, userService)

	r := server.NewServer(boardController, userController, userService, oauthController)

	ts := httptest.NewServer(r)

	terminateConnection := func() {
		if err := container.Terminate(ctx); err != nil {
			t.Logf("failed to terminate container: %v", err)
		}
	}
	return &TestServer{
		Server: ts,
		Router: r,
		Board: BoardTestResources{
			Service: boardService,
		},
		User: UserTestResources{
			Data: userStore,
		},
	}, terminateConnection
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
		signedToken, err := helpers.CreateAndSignJWT(jwt.MapClaims{"id": *userID})
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

// GetUserStructFromGoogleMock returns a mock GoogleUserResponse for testing purposes.
func GetUserStructFromGoogleMock(code string) (*helpers.GoogleUserResponse, error) {
	/** Temp */
	fmt.Println("HIT")
	return &helpers.GoogleUserResponse{
		IDToken:      "mock_id_token",
		AccessToken:  "mock_access_token",
		ExpiresIn:    3600,
		TokenType:    "Bearer",
		Scope:        "openid email profile",
		RefreshToken: "mock_refresh_token",
	}, nil
}
