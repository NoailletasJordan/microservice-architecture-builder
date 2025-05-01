package tests

import (
	"encoding/json"
	"net/http"
	"testing"

	"microservice-architecture-builder/backend/model"
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
			expectedCode: http.StatusCreated,
			expectError:  false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			rr := makeRequest(t, ts, "POST", "/api/board/", tt.board)

			if rr.Code != tt.expectedCode {
				t.Errorf("Expected status code %d, got %d", tt.expectedCode, rr.Code)
			}

			if tt.expectError {
				var errResp map[string]string
				if err := json.NewDecoder(rr.Body).Decode(&errResp); err != nil {
					t.Fatalf("Failed to decode error response: %v", err)
				}
				if errMsg, ok := errResp["error"]; !ok || !contains(errMsg, tt.errorContains) {
					t.Errorf("Expected error containing '%s', got '%s'", tt.errorContains, errMsg)
				}
			} else {
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

			if rr.Code != tt.expectedCode {
				t.Errorf("Expected status code %d, got %d", tt.expectedCode, rr.Code)
			}

			if tt.expectError {
				var errResp map[string]string
				if err := json.NewDecoder(rr.Body).Decode(&errResp); err != nil {
					t.Fatalf("Failed to decode error response: %v", err)
				}
				if errMsg, ok := errResp["error"]; !ok || !contains(errMsg, tt.errorContains) {
					t.Errorf("Expected error containing '%s', got '%s'", tt.errorContains, errMsg)
				}
			} else {
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
			expectedCode:  http.StatusBadRequest,
			expectError:   true,
			errorContains: "board not found",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			rr := makeRequest(t, ts, "PATCH", "/api/board/"+tt.boardID, tt.updates)

			if rr.Code != tt.expectedCode {
				t.Errorf("Expected status code %d, got %d", tt.expectedCode, rr.Code)
			}

			if tt.expectError {
				var errResp map[string]string
				if err := json.NewDecoder(rr.Body).Decode(&errResp); err != nil {
					t.Fatalf("Failed to decode error response: %v", err)
				}
				if errMsg, ok := errResp["error"]; !ok || !contains(errMsg, tt.errorContains) {
					t.Errorf("Expected error containing '%s', got '%s'", tt.errorContains, errMsg)
				}
			} else {
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
			boardID:       board.ID, // Try to delete the same board again
			expectedCode:  http.StatusNotFound,
			expectError:   true,
			errorContains: "board not found",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			rr := makeRequest(t, ts, "DELETE", "/api/board/"+tt.boardID, nil)

			if rr.Code != tt.expectedCode {
				t.Errorf("Expected status code %d, got %d", tt.expectedCode, rr.Code)
			}

			if tt.expectError {
				var errResp map[string]string
				if err := json.NewDecoder(rr.Body).Decode(&errResp); err != nil {
					t.Fatalf("Failed to decode error response: %v", err)
				}
				if errMsg, ok := errResp["error"]; !ok || !contains(errMsg, tt.errorContains) {
					t.Errorf("Expected error containing '%s', got '%s'", tt.errorContains, errMsg)
				}
			} else {
				var response map[string]string
				if err := json.NewDecoder(rr.Body).Decode(&response); err != nil {
					t.Fatalf("Failed to decode response: %v", err)
				}
				if msg, ok := response["message"]; !ok || msg != "Board deleted successfully" {
					t.Errorf("Expected success message, got %v", response)
				}
			}
		})
	}
}

func TestListBoards(t *testing.T) {
	ts := NewTestServer()
	defer ts.Close()

	// Get initial boards count (should be 1 - the sample board)
	initialBoards := ts.Store.GetAll()
	initialCount := len(initialBoards)

	// Create multiple test boards
	board1 := createTestBoard(t, ts)
	board2 := createTestBoard(t, ts)
	board3 := createTestBoard(t, ts)

	t.Logf("Created boards: %s, %s, %s", board1.ID, board2.ID, board3.ID)

	// Delete one board to test it's not returned
	if err := ts.Service.DeleteBoard(board3.ID); err != nil {
		t.Fatalf("Failed to delete test board: %v", err)
	}

	// Verify the board is marked as deleted
	deletedBoard, _ := ts.Store.GetByID(board3.ID)
	if deletedBoard != nil && deletedBoard.Deleted == nil {
		t.Errorf("Board %s should be marked as deleted", board3.ID)
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
	return len(s) > 0 && len(substr) > 0 && s == substr
}
