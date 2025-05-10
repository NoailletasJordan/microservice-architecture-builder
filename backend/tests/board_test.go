package tests

import (
	"encoding/json"
	"net/http"
	"os"
	"strings"
	"testing"

	"microservice-architecture-builder/backend/data"
	"microservice-architecture-builder/backend/model"
)

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
			errorContains: model.ErrorMessages.BoardNotFound,
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
				if errMsg, ok := errResp["error"]; !ok || !strings.Contains(errMsg, tt.errorContains) {
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
				"data":  `{"example": "data"}`,
			},
			expectedCode: http.StatusOK,
			expectError:  false,
		},
		{
			name:    "Invalid JSON Data",
			boardID: board.ID,
			updates: map[string]string{
				"title": "Test Title",
				"data":  `{"BROKENSJSON": "da`,
			},
			expectedCode:  http.StatusBadRequest,
			expectError:   true,
			errorContains: model.ErrorMessages.DataMustBeValidJSON,
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
				"data":  `{"example": "data"}`,
			},
			expectedCode:  http.StatusNotFound,
			expectError:   true,
			errorContains: model.ErrorMessages.BoardNotFound,
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
				if errMsg, ok := errResp["error"]; !ok || !strings.Contains(errMsg, tt.errorContains) {
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
		raw := map[string]string{
			"title": "Updated Title",
			"data":  `{"example":"data"}`,
			"foo":   "123",
			"bar":   "baz",
		}
		rr := makeRequest(t, ts, "PATCH", "/api/board/"+board.ID, raw)
		if rr.Code != http.StatusBadRequest {
			t.Errorf("Expected 400 for extra keys, got %d", rr.Code)
		}
		var errResp map[string]string
		if err := json.NewDecoder(rr.Body).Decode(&errResp); err != nil {
			t.Fatalf("Failed to decode error response: %v", err)
		}
		if errMsg, ok := errResp["error"]; !ok || !(strings.Contains(errMsg, "foo") || strings.Contains(errMsg, "bar")) {
			t.Errorf("Expected error listing extra keys, got '%s'", errMsg)
		}
	})

	// Extra: test PATCH with none of the allowed fields
	t.Run("PATCH with no allowed fields", func(t *testing.T) {
		raw := map[string]string{
			"owner": "should not be allowed",
		}
		rr := makeRequest(t, ts, "PATCH", "/api/board/"+board.ID, raw)
		if rr.Code != http.StatusBadRequest {
			t.Errorf("Expected 400 for missing allowed fields, got %d", rr.Code)
		}
		var errResp map[string]string
		if err := json.NewDecoder(rr.Body).Decode(&errResp); err != nil {
			t.Fatalf("Failed to decode error response: %v", err)
		}
		if errMsg, ok := errResp["error"]; !ok || !strings.Contains(errMsg, "at least one of title, data, password is required") {
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
			errorContains: model.ErrorMessages.BoardNotFound,
		},
		{
			name:          "Already DeletedAt Board",
			boardID:       board.ID,
			expectedCode:  http.StatusNotFound,
			expectError:   true,
			errorContains: model.ErrorMessages.BoardNotFound,
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
				if errMsg, ok := errResp["error"]; !ok || !strings.Contains(errMsg, tt.errorContains) {
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

	cleanupTestBoards()

	// Test that GET /api/board/ returns an empty array when there are no boards
	rr := makeRequest(t, ts, "GET", "/api/board/", nil)
	if rr.Code != http.StatusOK {
		t.Errorf("Expected status code %d, got %d", http.StatusOK, rr.Code)
	}
	if strings.TrimSpace(rr.Body.String()) != "[]" {
		t.Errorf("Expected response body to be an empty array ([]), got: %q", rr.Body.String())
	}
	var boards []*model.Board
	if err := json.NewDecoder(strings.NewReader(rr.Body.String())).Decode(&boards); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}
	if len(boards) != 0 {
		t.Errorf("Expected 0 boards, got %d", len(boards))
	}

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

	rr = makeRequest(t, ts, "GET", "/api/board/", nil)

	if rr.Code != http.StatusOK {
		t.Errorf("Expected status code %d, got %d", http.StatusOK, rr.Code)
	}

	var responseBoards []*model.Board
	if err := json.NewDecoder(rr.Body).Decode(&responseBoards); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	expectedBoards := 2
	if len(responseBoards) != expectedBoards {
		t.Errorf("Expected %d boards, got %d", expectedBoards, len(responseBoards))
		for _, b := range responseBoards {
			t.Logf("Board ID: %s, Title: %s, DeletedAt: %v", b.ID, b.Title, b.DeletedAt)
		}
		return
	}

	// Verify our test boards are in the response
	found1, found2 := false, false
	for _, board := range responseBoards {
		if board.DeletedAt != nil {
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

func TestMain(m *testing.M) {
	var testDSN = os.Getenv("POSTGRES_TEST_DSN")
	store, err := data.NewPostgresStore(testDSN)
	if err != nil {
		panic(err)
	}
	defer store.DB().Close()

	cleanupTestBoards() // Clean before tests
	code := m.Run()
	cleanupTestBoards() // Clean after tests
	os.Exit(code)
}
