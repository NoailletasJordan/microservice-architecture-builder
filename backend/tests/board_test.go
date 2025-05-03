package tests

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"
	"testing"

	"microservice-architecture-builder/backend/model"

	"github.com/joho/godotenv"
)

func TestCreateBoard(t *testing.T) {
	ts := NewTestServer()
	defer ts.Close()

	tests := []struct {
		name          string
		board         map[string]string
		expectedCode  int
		expectError   bool
		errorContains string
	}{
		{
			name: "Valid Board",
			board: map[string]string{
				"title": "Test Board",
				"owner": "test_owner",
				"data":  `{\"example\": \"data\"}`,
			},
			expectedCode: http.StatusCreated,
			expectError:  false,
		},
		{
			name: "Missing Title",
			board: map[string]string{
				"owner": "test_owner",
				"data":  `{\"example\": \"data\"}`,
			},
			expectedCode:  http.StatusBadRequest,
			expectError:   true,
			errorContains: "validation error on field",
		},
		{
			name: "Missing Owner",
			board: map[string]string{
				"title": "Test Board",
				"data":  `{\"example\": \"data\"}`,
			},
			expectedCode:  http.StatusBadRequest,
			expectError:   true,
			errorContains: "validation error on field",
		},
		{
			name: "Invalid JSON Data",
			board: map[string]string{
				"title": "Test Board",
				"owner": "test_owner",
				"data":  `{\"example\": \"data\"}`,
			},
			expectedCode:  http.StatusBadRequest,
			expectError:   true,
			errorContains: "data must be valid JSON",
		},
		{
			name: "With Optional Password",
			board: map[string]string{
				"title":    "Test Board",
				"owner":    "test_owner",
				"data":     `{\"example\": \"data\"}`,
				"password": "secret123",
			},
			expectedCode: http.StatusCreated,
			expectError:  false,
		},
		{
			name: "Very Long Title",
			board: map[string]string{
				"title": "Test Board",
				"owner": "test_owner",
				"data":  `{\"example\": \"data\"}`,
			},
			expectedCode:  http.StatusBadRequest,
			expectError:   true,
			errorContains: "title must be between 2 and 100 characters",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			rr := makeRequest(t, ts, "POST", "/api/board/", tt.board)

			if tt.expectError {
				if rr.Code != tt.expectedCode {
					t.Errorf("Expected error status code %d, got %d", tt.expectedCode, rr.Code)
				}
				var errResp map[string]string
				if err := json.NewDecoder(rr.Body).Decode(&errResp); err != nil {
					t.Fatalf("Failed to decode error response: %v", err)
				}
				if errMsg, ok := errResp["error"]; !ok || !contains(errMsg, tt.errorContains) {
					t.Errorf("Expected error containing '%s', got '%s'", tt.errorContains, errMsg)
				}
			} else {
				if rr.Code != tt.expectedCode {
					t.Errorf("Expected status code %d, got %d", tt.expectedCode, rr.Code)
				}
				var board model.Board
				if err := json.NewDecoder(rr.Body).Decode(&board); err != nil {
					t.Fatalf("Failed to decode response: %v", err)
				}
				if board.ID == "" {
					t.Error("Expected board ID to be set")
				}
				if board.CreatedAt.IsZero() {
					t.Error("Expected CreatedAt to be set")
				}
			}
		})
	}

	// Extra: test POST with extra keys
	t.Run("Extra Keys in POST", func(t *testing.T) {
		raw := `{"title":"Test Board","owner":"test_owner","data":"{\"test\":\"data\"}","foo":123,"bar":"baz"}`
		rr := makeRawRequest(t, ts, "POST", "/api/board/", raw)
		if rr.Code != http.StatusBadRequest {
			t.Errorf("Expected 400 for extra keys, got %d", rr.Code)
		}
		var errResp map[string]string
		if err := json.NewDecoder(rr.Body).Decode(&errResp); err != nil {
			t.Fatalf("Failed to decode error response: %v", err)
		}
		if errMsg, ok := errResp["error"]; !ok || !contains(errMsg, "unexpected fields") || !contains(errMsg, "foo") || !contains(errMsg, "bar") {
			t.Errorf("Expected error listing extra keys, got '%s'", errMsg)
		}
	})
}

func TestGetBoard(t *testing.T) {
	ts := NewTestServer()
	defer ts.Close()

	// Create a test board
	board := createTestBoard(t, ts)

	tests := []struct {
		name          string
		boardID       string
		expectedCode  int
		expectError   bool
		errorContains string
	}{
		{
			name:         "Valid Board ID",
			boardID:      board.ID,
			expectedCode: http.StatusOK,
			expectError:  false,
		},
		{
			name:          "Non-existent Board ID",
			boardID:       "non-existent-id",
			expectedCode:  http.StatusNotFound,
			expectError:   true,
			errorContains: "board not found",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			rr := makeRequest(t, ts, "GET", "/api/board/"+tt.boardID, nil)

			if tt.expectError {
				if rr.Code != tt.expectedCode {
					t.Errorf("Expected error status code %d, got %d", tt.expectedCode, rr.Code)
				}
				var errResp map[string]string
				if err := json.NewDecoder(rr.Body).Decode(&errResp); err != nil {
					t.Fatalf("Failed to decode error response: %v", err)
				}
				if errMsg, ok := errResp["error"]; !ok || !contains(errMsg, tt.errorContains) {
					t.Errorf("Expected error containing '%s', got '%s'", tt.errorContains, errMsg)
				}
			} else {
				if rr.Code != tt.expectedCode {
					t.Errorf("Expected status code %d, got %d", tt.expectedCode, rr.Code)
				}
				var responseBoard model.Board
				if err := json.NewDecoder(rr.Body).Decode(&responseBoard); err != nil {
					t.Fatalf("Failed to decode response: %v", err)
				}
				if responseBoard.ID != board.ID {
					t.Errorf("Expected board ID %s, got %s", board.ID, responseBoard.ID)
				}
			}
		})
	}
}

func TestUpdateBoard(t *testing.T) {
	ts := NewTestServer()
	defer ts.Close()

	// Create a test board
	board := createTestBoard(t, ts)

	tests := []struct {
		name          string
		boardID       string
		updates       map[string]string
		expectedCode  int
		expectError   bool
		errorContains string
	}{
		{
			name:    "Valid Update",
			boardID: board.ID,
			updates: map[string]string{
				"title": "Updated Title",
				"data":  `{\"example\": \"data\"}`,
			},
			expectedCode: http.StatusOK,
			expectError:  false,
		},
		{
			name:    "Invalid JSON Data",
			boardID: board.ID,
			updates: map[string]string{
				"title": "Test Title",
				"data":  `{\"example\": \"data\"}`,
			},
			expectedCode:  http.StatusBadRequest,
			expectError:   true,
			errorContains: "data must be valid JSON",
		},
		{
			name:          "Missing Required Fields",
			boardID:       board.ID,
			updates:       map[string]string{},
			expectedCode:  http.StatusBadRequest,
			expectError:   true,
			errorContains: "at least one of title, data, password is required",
		},
		{
			name:    "Non-existent Board",
			boardID: "non-existent-id",
			updates: map[string]string{
				"title": "Updated Title",
				"data":  `{\"example\": \"data\"}`,
			},
			expectedCode:  http.StatusNotFound,
			expectError:   true,
			errorContains: "board not found",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			rr := makeRequest(t, ts, "PATCH", "/api/board/"+tt.boardID, tt.updates)

			if tt.expectError {
				if rr.Code != tt.expectedCode {
					t.Errorf("Expected error status code %d, got %d", tt.expectedCode, rr.Code)
				}
				var errResp map[string]string
				if err := json.NewDecoder(rr.Body).Decode(&errResp); err != nil {
					t.Fatalf("Failed to decode error response: %v", err)
				}
				if errMsg, ok := errResp["error"]; !ok || !contains(errMsg, tt.errorContains) {
					t.Errorf("Expected error containing '%s', got '%s'", tt.errorContains, errMsg)
				}
			} else {
				if rr.Code != tt.expectedCode {
					t.Errorf("Expected status code %d, got %d", tt.expectedCode, rr.Code)
				}
				var responseBoard model.Board
				if err := json.NewDecoder(rr.Body).Decode(&responseBoard); err != nil {
					t.Fatalf("Failed to decode response: %v", err)
				}
				if responseBoard.Title != tt.updates["title"] {
					t.Errorf("Expected title %s, got %s", tt.updates["title"], responseBoard.Title)
				}
			}
		})
	}

	// Extra: test PATCH with extra keys
	t.Run("Extra Keys in PATCH", func(t *testing.T) {
		raw := `{"title":"Updated Title","data":"{\"example\":\"data\"}","foo":123,"bar":"baz"}`
		rr := makeRawRequest(t, ts, "PATCH", "/api/board/"+board.ID, raw)
		if rr.Code != http.StatusBadRequest {
			t.Errorf("Expected 400 for extra keys, got %d", rr.Code)
		}
		var errResp map[string]string
		if err := json.NewDecoder(rr.Body).Decode(&errResp); err != nil {
			t.Fatalf("Failed to decode error response: %v", err)
		}
		if errMsg, ok := errResp["error"]; !ok || !contains(errMsg, "unexpected fields") || !contains(errMsg, "foo") || !contains(errMsg, "bar") {
			t.Errorf("Expected error listing extra keys, got '%s'", errMsg)
		}
	})

	// Extra: test PATCH with none of the allowed fields
	t.Run("PATCH with no allowed fields", func(t *testing.T) {
		raw := `{"owner":"should not be allowed"}`
		rr := makeRawRequest(t, ts, "PATCH", "/api/board/"+board.ID, raw)
		if rr.Code != http.StatusBadRequest {
			t.Errorf("Expected 400 for missing allowed fields, got %d", rr.Code)
		}
		var errResp map[string]string
		if err := json.NewDecoder(rr.Body).Decode(&errResp); err != nil {
			t.Fatalf("Failed to decode error response: %v", err)
		}
		if errMsg, ok := errResp["error"]; !ok || !contains(errMsg, "at least one of title, data, password is required") {
			t.Errorf("Expected error for missing allowed fields, got '%s'", errMsg)
		}
	})
}

func TestDeleteBoard(t *testing.T) {
	ts := NewTestServer()
	defer ts.Close()

	// Create a test board
	board := createTestBoard(t, ts)

	tests := []struct {
		name          string
		boardID       string
		expectedCode  int
		expectError   bool
		errorContains string
	}{
		{
			name:         "Valid Delete",
			boardID:      board.ID,
			expectedCode: http.StatusOK,
			expectError:  false,
		},
		{
			name:          "Non-existent Board",
			boardID:       "non-existent-id",
			expectedCode:  http.StatusNotFound,
			expectError:   true,
			errorContains: "board not found",
		},
		{
			name:          "Already Deleted Board",
			boardID:       board.ID,
			expectedCode:  http.StatusNotFound,
			expectError:   true,
			errorContains: "board not found",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			rr := makeRequest(t, ts, "DELETE", "/api/board/"+tt.boardID, nil)

			if tt.expectError {
				if rr.Code != tt.expectedCode {
					t.Errorf("Expected error, name: %s, status code %d, got %d", tt.name, tt.expectedCode, rr.Code)
				}
				var errResp map[string]string
				if err := json.NewDecoder(rr.Body).Decode(&errResp); err != nil {
					t.Fatalf("Failed to decode error response: %v", err)
				}
				if errMsg, ok := errResp["error"]; !ok || !contains(errMsg, tt.errorContains) {
					t.Errorf("Expected error, name: %s, containing '%s', got '%s'", tt.name, tt.errorContains, errMsg)
				}
			} else {
				var response map[string]string
				if err := json.NewDecoder(rr.Body).Decode(&response); err != nil {
					t.Fatalf("Failed to decode response: %v", err)
				}
				if msg, ok := response["message"]; !ok || msg != "Board deleted successfully" {
					t.Errorf("Expected success message, name: %s, got %v", tt.name, response)
				}
			}
		})
	}
}

func TestListBoards(t *testing.T) {
	ts := NewTestServer()
	defer ts.Close()

	// Get initial boards count (should be 1 - the sample board)
	initialBoards := ts.Service.GetAllBoards()
	initialCount := len(initialBoards)

	// Create multiple test boards
	board1 := createTestBoard(t, ts)
	board2 := createTestBoard(t, ts)
	board3 := createTestBoard(t, ts)

	t.Logf("Created boards: %s, %s, %s", board1.ID, board2.ID, board3.ID)

	// NEW: Check if board3 exists before deletion
	fetched, err := ts.Service.GetBoard(board3.ID)
	if err != nil {
		t.Fatalf("Board3 not found immediately after creation: %v", err)
	}
	t.Logf("Fetched board3 before deletion: %+v", fetched)

	// Delete one board to test it's not returned
	if err := ts.Service.DeleteBoard(board3.ID); err != nil {
		t.Fatalf("Failed to delete test board: %v", err)
	}

	// Verify the board is not found after deletion
	_, err = ts.Service.GetBoard(board3.ID)
	if err == nil {
		t.Errorf("Expected error when getting deleted board")
	}

	rr := makeRequest(t, ts, "GET", "/api/board/", nil)

	if rr.Code != http.StatusOK {
		t.Errorf("Expected status code %d, got %d", http.StatusOK, rr.Code)
	}

	var boards []*model.Board
	if err := json.NewDecoder(rr.Body).Decode(&boards); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	// Should return initial boards + 2 new non-deleted boards
	expectedBoards := initialCount + 2
	if len(boards) != expectedBoards {
		t.Errorf("Expected %d boards, got %d", expectedBoards, len(boards))
		for _, b := range boards {
			t.Logf("Board ID: %s, Title: %s, Deleted: %v", b.ID, b.Title, b.Deleted)
		}
		return
	}

	// Verify our test boards are in the response
	found1, found2 := false, false
	for _, board := range boards {
		if board.Deleted != nil {
			t.Errorf("Found deleted board in response: %s", board.ID)
			continue
		}
		if board.ID == board1.ID {
			found1 = true
		}
		if board.ID == board2.ID {
			found2 = true
		}
		if board.ID == board3.ID {
			t.Errorf("Found deleted board in response: %s", board.ID)
		}
	}

	if !found1 || !found2 {
		t.Errorf("Not all expected boards were found. Board1 found: %v, Board2 found: %v",
			found1, found2)
	}
}

// Helper function to create a string pointer
func stringPtr(s string) *string {
	return &s
}

// Helper function to check if a string contains another string
func contains(s, substr string) bool {
	return strings.Contains(s, substr)
}

func TestMain(m *testing.M) {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatalf("Failed to load environment variables: %v", err)
	}

	// Override Supabase env vars with test values if present
	if testUrl := os.Getenv("TEST_SUPABASE_URL"); testUrl != "" {
		os.Setenv("SUPABASE_URL", testUrl)
	}
	if testKey := os.Getenv("TEST_SUPABASE_PUBLIC_ANON_KEY"); testKey != "" {
		os.Setenv("SUPABASE_PUBLIC_ANON_KEY", testKey)
	}
	if testProjectID := os.Getenv("TEST_SUPABASE_PROJECT_ID"); testProjectID != "" {
		os.Setenv("SUPABASE_PROJECT_ID", testProjectID)
	}

	cleanupSupabaseBoards() // Clean before tests
	code := m.Run()
	cleanupSupabaseBoards() // Clean after tests
	os.Exit(code)
}
