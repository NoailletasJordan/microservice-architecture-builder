package tests

import (
	"encoding/json"
	"net/http"
	"strings"
	"testing"

	"microservice-architecture-builder/backend/helpers"
	"microservice-architecture-builder/backend/model"
)

func TestGetBoard(t *testing.T) {
	ts, _ := NewTestServer(t)
	defer ts.Close()

	user := createTestUser(t, ts)
	anotherUser := createTestUser(t, ts)

	// Create a test board
	board := createTestBoard(t, ts, user.ID)
	boardFromAnotherUser := createTestBoard(t, ts, anotherUser.ID)

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
			errorContains: helpers.ErrorMessages.NotFound,
		},
		{
			name:          "Board from another user",
			boardID:       boardFromAnotherUser.ID,
			expectedCode:  http.StatusForbidden,
			expectError:   true,
			errorContains: helpers.ErrorMessages.Forbidden,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			rr := makeRequest(t, ts, "GET", "/api/board/"+tt.boardID, nil, &user.ID)

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

	// Unauthorized test: missing user ID
	t.Run("Unauthorized - missing user ID", func(t *testing.T) {
		rr := makeRequest(t, ts, "GET", "/api/board/"+board.ID, nil, nil)
		if rr.Code != http.StatusUnauthorized {
			t.Errorf("Expected 401 Unauthorized when user ID is missing, got %d", rr.Code)
		}
	})
}

func TestUpdateBoard(t *testing.T) {
	ts, _ := NewTestServer(t)
	defer ts.Close()

	user := createTestUser(t, ts)
	anotherUser := createTestUser(t, ts)
	// Create a test board
	board := createTestBoard(t, ts, user.ID)
	boardFromAnotherUser := createTestBoard(t, ts, anotherUser.ID)

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
			errorContains: helpers.ErrorMessages.DataMustBeValidJSON,
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
			errorContains: helpers.ErrorMessages.NotFound,
		},
		{
			name:    "Board from another user",
			boardID: boardFromAnotherUser.ID,
			updates: map[string]string{
				"title": "Updated Title",
				"data":  `{"example": "data"}`,
			},
			expectedCode:  http.StatusForbidden,
			expectError:   true,
			errorContains: helpers.ErrorMessages.Forbidden,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			rr := makeRequest(t, ts, "PATCH", "/api/board/"+tt.boardID, tt.updates, &user.ID)

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
		rr := makeRequest(t, ts, "PATCH", "/api/board/"+board.ID, raw, &user.ID)
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
		rr := makeRequest(t, ts, "PATCH", "/api/board/"+board.ID, raw, &user.ID)
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

	// Unauthorized test: missing user ID
	t.Run("Unauthorized - missing user ID", func(t *testing.T) {
		rr := makeRequest(t, ts, "PATCH", "/api/board/"+board.ID, map[string]string{"title": "Should Fail"}, nil)
		if rr.Code != http.StatusUnauthorized {
			t.Errorf("Expected 401 Unauthorized when user ID is missing, got %d", rr.Code)
		}
	})
}

func TestDeleteBoard(t *testing.T) {
	ts, _ := NewTestServer(t)
	defer ts.Close()

	// Create a test board
	user := createTestUser(t, ts)
	anotherUser := createTestUser(t, ts)
	board := createTestBoard(t, ts, user.ID)
	boardFromAnotherUser := createTestBoard(t, ts, anotherUser.ID)

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
			errorContains: helpers.ErrorMessages.NotFound,
		},
		{
			name:          "Already DeletedAt Board",
			boardID:       board.ID,
			expectedCode:  http.StatusNotFound,
			expectError:   true,
			errorContains: helpers.ErrorMessages.NotFound,
		},
		{
			name:          "Board from another user",
			boardID:       boardFromAnotherUser.ID,
			expectedCode:  http.StatusForbidden,
			expectError:   true,
			errorContains: helpers.ErrorMessages.Forbidden,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			rr := makeRequest(t, ts, "DELETE", "/api/board/"+tt.boardID, nil, &user.ID)

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

	// Unauthorized test: missing user ID
	t.Run("Unauthorized - missing user ID", func(t *testing.T) {
		rr := makeRequest(t, ts, "DELETE", "/api/board/"+board.ID, nil, nil)
		if rr.Code != http.StatusUnauthorized {
			t.Errorf("Expected 401 Unauthorized when user ID is missing, got %d", rr.Code)
		}
	})
}

func TestListBoards(t *testing.T) {
	ts, _ := NewTestServer(t)
	defer ts.Close()

	user := createTestUser(t, ts)

	// Test that GET /api/board/ returns an empty array when there are no boards
	rr := makeRequest(t, ts, "GET", "/api/board/", nil, &user.ID)
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
	board1 := createTestBoard(t, ts, user.ID)
	board2 := createTestBoard(t, ts, user.ID)
	board3 := createTestBoard(t, ts, user.ID)

	t.Logf("Created boards: %s, %s, %s", board1.ID, board2.ID, board3.ID)

	// NEW: Check if board3 exists before deletion
	fetched, err := ts.Board.Service.GetBoard(board3.ID, user.ID)
	if err != nil {
		t.Fatalf("Board3 not found immediately after creation: %v", err)
	}
	t.Logf("Fetched board3 before deletion: %+v", fetched)

	// Delete one board to test it's not returned
	if err := ts.Board.Service.DeleteBoard(board3.ID, user.ID); err != nil {
		t.Fatalf("Failed to delete test board: %v", err)
	}

	// Verify the board is not found after deletion
	_, err = ts.Board.Service.GetBoard(board3.ID, user.ID)
	if err == nil {
		t.Errorf("Expected error when getting deleted board")
	}

	rr = makeRequest(t, ts, "GET", "/api/board/", nil, &user.ID)

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

	// Create a second user and boards for them
	anotherUser := createTestUser(t, ts)
	_ = createTestBoard(t, ts, anotherUser.ID)
	_ = createTestBoard(t, ts, anotherUser.ID)

	// Test that another user cannot see boards from the first user
	t.Run("Another user cannot see boards from others", func(t *testing.T) {
		rr := makeRequest(t, ts, "GET", "/api/board/", nil, &anotherUser.ID)
		if rr.Code != http.StatusOK {
			t.Errorf("Expected status code %d, got %d", http.StatusOK, rr.Code)
		}
		var boards []*model.Board
		if err := json.NewDecoder(rr.Body).Decode(&boards); err != nil {
			t.Fatalf("Failed to decode response: %v", err)
		}
		if len(boards) != 2 {
			t.Errorf("Expected 2 boards for another user, got %d", len(boards))
		}
		for _, b := range boards {
			if b.Owner != anotherUser.ID {
				t.Errorf("User should not see boards from other users. Got board with owner %s", b.Owner)
			}
		}
	})

	// Unauthorized test: missing user ID
	t.Run("Unauthorized - missing user ID", func(t *testing.T) {
		rr := makeRequest(t, ts, "GET", "/api/board/", nil, nil)
		if rr.Code != http.StatusUnauthorized {
			t.Errorf("Expected 401 Unauthorized when user ID is missing, got %d", rr.Code)
		}
	})
}

// TestGetBoardShareFragment tests BoardService.GetBoardShareFragment
func TestGetBoardShareFragment(t *testing.T) {
	ts, _ := NewTestServer(t)
	defer ts.Close()

	user := createTestUser(t, ts)
	board := createTestBoard(t, ts, user.ID)

	// 1. Valid board: should return 200 and a non-empty share_fragment
	rr := makeRequest(t, ts, "GET", "/api/board/"+board.ID+"/sharefragment", nil, &user.ID)
	if rr.Code != http.StatusOK {
		t.Fatalf("Expected 200 OK, got %d", rr.Code)
	}
	var resp struct {
		ShareFragment *string `json:"share_fragment"`
	}
	if err := json.NewDecoder(rr.Body).Decode(&resp); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}
	if resp.ShareFragment == nil || *resp.ShareFragment == "" {
		t.Errorf("Expected non-empty share_fragment, got: %v", resp.ShareFragment)
	}

	// 2. Second call: should return the same share_fragment
	rr2 := makeRequest(t, ts, "GET", "/api/board/"+board.ID+"/sharefragment", nil, &user.ID)
	if rr2.Code != http.StatusOK {
		t.Fatalf("Expected 200 OK, got %d", rr2.Code)
	}
	var resp2 struct {
		ShareFragment *string `json:"share_fragment"`
	}
	if err := json.NewDecoder(rr2.Body).Decode(&resp2); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}
	if resp2.ShareFragment == nil || *resp2.ShareFragment != *resp.ShareFragment {
		t.Errorf("Expected same share_fragment, got: %v, want: %v", resp2.ShareFragment, resp.ShareFragment)
	}

	// 3. Non-existent board: should return 404 and error message
	rr3 := makeRequest(t, ts, "GET", "/api/board/non-existent-id/sharefragment", nil, &user.ID)
	if rr3.Code != http.StatusNotFound {
		t.Errorf("Expected 404 for non-existent board, got %d", rr3.Code)
	}
	var errResp3 map[string]string
	_ = json.NewDecoder(rr3.Body).Decode(&errResp3)
	if errMsg, ok := errResp3["error"]; !ok || !strings.Contains(errMsg, helpers.ErrorMessages.NotFound) {
		t.Errorf("Expected error containing '%s', got '%s'", helpers.ErrorMessages.NotFound, errMsg)
	}

	// 4. Forbidden: another user cannot get the share fragment of a board they do not own
	anotherUser := createTestUser(t, ts)
	rr4 := makeRequest(t, ts, "GET", "/api/board/"+board.ID+"/sharefragment", nil, &anotherUser.ID)
	if rr4.Code != http.StatusForbidden {
		t.Errorf("Expected 403 Forbidden for another user, got %d", rr4.Code)
	}
	var errResp4 map[string]string
	_ = json.NewDecoder(rr4.Body).Decode(&errResp4)
	if errMsg, ok := errResp4["error"]; !ok || !strings.Contains(errMsg, helpers.ErrorMessages.Forbidden) {
		t.Errorf("Expected error containing '%s', got '%s'", helpers.ErrorMessages.Forbidden, errMsg)
	}

	// 5. Unauthorized: should return 401 if user ID is missing
	rr5 := makeRequest(t, ts, "GET", "/api/board/"+board.ID+"/sharefragment", nil, nil)
	if rr5.Code != http.StatusUnauthorized {
		t.Errorf("Expected 401 Unauthorized when user ID is missing, got %d", rr5.Code)
	}

	// 6. Deleted board: should return 404 and error message
	if err := ts.Board.Service.DeleteBoard(board.ID, user.ID); err != nil {
		t.Fatalf("Failed to delete board: %v", err)
	}
	rr6 := makeRequest(t, ts, "GET", "/api/board/"+board.ID+"/sharefragment", nil, &user.ID)
	if rr6.Code != http.StatusNotFound {
		t.Errorf("Expected 404 for deleted board, got %d", rr6.Code)
	}
	var errResp6 map[string]string
	_ = json.NewDecoder(rr6.Body).Decode(&errResp6)
	if errMsg, ok := errResp6["error"]; !ok || !strings.Contains(errMsg, helpers.ErrorMessages.NotFound) {
		t.Errorf("Expected error containing '%s', got '%s'", helpers.ErrorMessages.NotFound, errMsg)
	}
}
