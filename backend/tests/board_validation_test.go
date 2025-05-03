package tests

import (
	"encoding/json"
	"net/http"
	"strings"
	"testing"

	"microservice-architecture-builder/backend/model"
)

func TestBoardValidation(t *testing.T) {
	ts := NewTestServer()
	defer ts.Close()

	tests := []struct {
		name          string
		board         map[string]string
		expectedCode  int
		errorContains string
	}{
		// Title validation tests
		{
			name: "Missing Title",
			board: map[string]string{
				"owner": "test_owner",
				"data":  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "validation error on field",
		},
		{
			name: "Title Too Short",
			board: map[string]string{
				"title": "a",
				"owner": "test_owner",
				"data":  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "title must be between 2 and 100 characters",
		},
		{
			name: "Title Too Long",
			board: map[string]string{
				"title": generateLongString(101),
				"owner": "test_owner",
				"data":  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "title must be between 2 and 100 characters",
		},
		{
			name: "Valid Title",
			board: map[string]string{
				"title": "Valid Title",
				"owner": "test_owner",
				"data":  `{"test": "data"}`,
			},
			expectedCode: http.StatusCreated,
		},

		// Owner validation tests
		{
			name: "Missing Owner",
			board: map[string]string{
				"title": "Test Board",
				"data":  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "owner is required",
		},
		{
			name: "Owner Too Short",
			board: map[string]string{
				"title": "Test Board",
				"owner": "a",
				"data":  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "owner must be between 2 and 50 characters",
		},
		{
			name: "Owner Too Long",
			board: map[string]string{
				"title": "Test Board",
				"owner": generateLongString(51),
				"data":  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "owner must be between 2 and 50 characters",
		},
		{
			name: "Valid Owner",
			board: map[string]string{
				"title": "Test Board",
				"owner": "valid_owner",
				"data":  `{"test": "data"}`,
			},
			expectedCode: http.StatusCreated,
		},

		// Data validation tests
		{
			name: "Missing Data",
			board: map[string]string{
				"title": "Test Board",
				"owner": "test_owner",
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "data is required",
		},
		{
			name: "Invalid JSON Data",
			board: map[string]string{
				"title": "Test Board",
				"owner": "test_owner",
				"data":  `{invalid json}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "data must be valid JSON",
		},
		{
			name: "Valid JSON Data",
			board: map[string]string{
				"title": "Test Board",
				"owner": "test_owner",
				"data":  `{"valid": "json"}`,
			},
			expectedCode: http.StatusCreated,
		},

		// Combined validation tests
		{
			name:          "All Fields Missing",
			board:         map[string]string{},
			expectedCode:  http.StatusBadRequest,
			errorContains: "validation error on field",
		},
		{
			name: "All Fields Invalid",
			board: map[string]string{
				"title": "a",
				"owner": "b",
				"data":  `{invalid}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "title must be between 2 and 100 characters",
		},
		{
			name: "All Fields Valid",
			board: map[string]string{
				"title": "Valid Title",
				"owner": "valid_owner",
				"data":  `{"valid": "json"}`,
			},
			expectedCode: http.StatusCreated,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			rr := makeRequest(t, ts, "POST", "/api/board/", tt.board)

			if tt.errorContains != "" {
				if rr.Code != tt.expectedCode {
					t.Errorf("Expected status code %d, got %d", tt.expectedCode, rr.Code)
				}
				var errResp map[string]string
				if err := json.NewDecoder(rr.Body).Decode(&errResp); err != nil {
					t.Fatalf("Failed to decode error response: %v", err)
				}
				if errMsg, ok := errResp["error"]; !ok || errMsg != tt.errorContains {
					t.Errorf("Expected error '%s', got '%s'", tt.errorContains, errMsg)
				}
			} else {
				if rr.Code != tt.expectedCode {
					t.Errorf("Expected status code %d, got %d", tt.expectedCode, rr.Code)
				}
			}
		})
	}
}

func TestBoardUpdateValidation(t *testing.T) {
	ts := NewTestServer()
	defer ts.Close()

	// Create a test board for update tests
	board := createTestBoard(t, ts)

	tests := []struct {
		name          string
		updates       model.Board
		expectedCode  int
		expectError   bool
		errorContains string
	}{
		// Title validation
		{
			name: "Update with Empty Title",
			updates: model.Board{
				Title: "",
				Data:  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			expectError:   true,
			errorContains: "validation error on field",
		},
		{
			name: "Update Title Too Short",
			updates: model.Board{
				Title: "a",
				Data:  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			expectError:   true,
			errorContains: "title must be between 2 and 100 characters",
		},
		{
			name: "Update Title Too Long",
			updates: model.Board{
				Title: strings.Repeat("a", 101),
				Data:  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			expectError:   true,
			errorContains: "title must be between 2 and 100 characters",
		},
		// Data validation
		{
			name: "Update with Invalid JSON Data",
			updates: model.Board{
				Title: "Test Board",
				Data:  `{"key":}`,
			},
			expectedCode:  http.StatusBadRequest,
			expectError:   true,
			errorContains: "data must be valid JSON",
		},
		// Valid update
		{
			name: "Valid Update All Fields",
			updates: model.Board{
				Title: "Updated Board",
				Data:  `{"updated": "data"}`,
			},
			expectedCode: http.StatusOK,
			expectError:  false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			rr := makeRequest(t, ts, "PATCH", "/api/board/"+board.ID, tt.updates)

			if tt.expectError {
				if rr.Code != tt.expectedCode {
					t.Errorf("Expected status code %d, got %d", tt.expectedCode, rr.Code)
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

	// Extra: test PATCH with forbidden field 'owner'
	t.Run("PATCH with forbidden field owner", func(t *testing.T) {
		raw := `{"owner":"should not be allowed"}`
		rr := makeRawRequest(t, ts, "PATCH", "/api/board/"+board.ID, raw)
		if rr.Code != http.StatusBadRequest {
			t.Errorf("Expected 400 for forbidden field, got %d", rr.Code)
		}
		var errResp map[string]string
		if err := json.NewDecoder(rr.Body).Decode(&errResp); err != nil {
			t.Fatalf("Failed to decode error response: %v", err)
		}
		if errMsg, ok := errResp["error"]; !ok || !contains(errMsg, "unexpected fields") || !contains(errMsg, "owner") {
			t.Errorf("Expected error for forbidden field 'owner', got '%s'", errMsg)
		}
	})
}
