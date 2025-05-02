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
		board         model.Board
		expectedCode  int
		expectError   bool
		errorContains string
	}{
		{
			name: "Valid Board",
			board: model.Board{
				Title: "Test Board",
				Owner: "test_owner",
				Data:  `{"test": "data"}`,
			},
			expectedCode: http.StatusCreated,
			expectError:  false,
		},
		{
			name: "Missing Title",
			board: model.Board{
				Owner: "test_owner",
				Data:  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			expectError:   true,
			errorContains: "title is required",
		},
		{
			name: "Missing Owner",
			board: model.Board{
				Title: "Test Board",
				Data:  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			expectError:   true,
			errorContains: "owner is required",
		},
		{
			name: "Invalid JSON Data",
			board: model.Board{
				Title: "Test Board",
				Owner: "test_owner",
				Data:  `{invalid json}`,
			},
			expectedCode:  http.StatusBadRequest,
			expectError:   true,
			errorContains: "data must be valid JSON",
		},
		{
			name: "With Optional Password",
			board: model.Board{
				Title:    "Test Board",
				Owner:    "test_owner",
				Data:     `{"test": "data"}`,
				Password: stringPtr("secret123"),
			},
			expectedCode: http.StatusCreated,
			expectError:  false,
		},
		{
			name: "Very Long Title",
			board: model.Board{
				Title: generateLongString(1000),
				Owner: "test_owner",
				Data:  `{"test": "data"}`,
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
		updates       model.Board
		expectedCode  int
		expectError   bool
		errorContains string
	}{
		{
			name:    "Valid Update",
			boardID: board.ID,
			updates: model.Board{
				Title: "Updated Title",
				Owner: "updated_owner",
				Data:  `{"updated": "data"}`,
			},
			expectedCode: http.StatusOK,
			expectError:  false,
		},
		{
			name:    "Invalid JSON Data",
			boardID: board.ID,
			updates: model.Board{
				Title: "Test Title",
				Owner: "test_owner",
				Data:  `{invalid json}`,
			},
			expectedCode:  http.StatusBadRequest,
			expectError:   true,
			errorContains: "data must be valid JSON",
		},
		{
			name:    "Missing Required Fields",
			boardID: board.ID,
			updates: model.Board{
				Title: "",
				Owner: "",
				Data:  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			expectError:   true,
			errorContains: "title is required",
		},
		{
			name:    "Non-existent Board",
			boardID: "non-existent-id",
			updates: model.Board{
				Title: "Updated Title",
				Owner: "updated_owner",
				Data:  `{"updated": "data"}`,
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
				if responseBoard.Title != tt.updates.Title {
					t.Errorf("Expected title %s, got %s", tt.updates.Title, responseBoard.Title)
				}
			}
		})
	}
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
