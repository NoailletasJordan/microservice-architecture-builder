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
		board         model.Board
		expectedCode  int
		errorContains string
	}{
		// Title validation tests
		{
			name: "Missing Title",
			board: model.Board{
				Owner: "test_owner",
				Data:  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "title is required",
		},
		{
			name: "Title Too Short",
			board: model.Board{
				Title: "a",
				Owner: "test_owner",
				Data:  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "title must be between 2 and 100 characters",
		},
		{
			name: "Title Too Long",
			board: model.Board{
				Title: generateLongString(101),
				Owner: "test_owner",
				Data:  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "title must be between 2 and 100 characters",
		},
		{
			name: "Valid Title",
			board: model.Board{
				Title: "Valid Title",
				Owner: "test_owner",
				Data:  `{"test": "data"}`,
			},
			expectedCode: http.StatusCreated,
		},

		// Owner validation tests
		{
			name: "Missing Owner",
			board: model.Board{
				Title: "Test Board",
				Data:  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "owner is required",
		},
		{
			name: "Owner Too Short",
			board: model.Board{
				Title: "Test Board",
				Owner: "a",
				Data:  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "owner must be between 2 and 50 characters",
		},
		{
			name: "Owner Too Long",
			board: model.Board{
				Title: "Test Board",
				Owner: generateLongString(51),
				Data:  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "owner must be between 2 and 50 characters",
		},
		{
			name: "Valid Owner",
			board: model.Board{
				Title: "Test Board",
				Owner: "valid_owner",
				Data:  `{"test": "data"}`,
			},
			expectedCode: http.StatusCreated,
		},

		// Data validation tests
		{
			name: "Missing Data",
			board: model.Board{
				Title: "Test Board",
				Owner: "test_owner",
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "data is required",
		},
		{
			name: "Invalid JSON Data",
			board: model.Board{
				Title: "Test Board",
				Owner: "test_owner",
				Data:  `{invalid json}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "data must be valid JSON",
		},
		{
			name: "Valid JSON Data",
			board: model.Board{
				Title: "Test Board",
				Owner: "test_owner",
				Data:  `{"valid": "json"}`,
			},
			expectedCode: http.StatusCreated,
		},

		// Combined validation tests
		{
			name:          "All Fields Missing",
			board:         model.Board{},
			expectedCode:  http.StatusBadRequest,
			errorContains: "title is required",
		},
		{
			name: "All Fields Invalid",
			board: model.Board{
				Title: "a",
				Owner: "b",
				Data:  `{invalid}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "title must be between 2 and 100 characters",
		},
		{
			name: "All Fields Valid",
			board: model.Board{
				Title: "Valid Title",
				Owner: "valid_owner",
				Data:  `{"valid": "json"}`,
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
				Owner: "test_owner",
				Data:  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			expectError:   true,
			errorContains: "title is required",
		},
		{
			name: "Update Title Too Short",
			updates: model.Board{
				Title: "a",
				Owner: "test_owner",
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
				Owner: "test_owner",
				Data:  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			expectError:   true,
			errorContains: "title must be between 2 and 100 characters",
		},

		// Owner validation
		{
			name: "Update with Empty Owner",
			updates: model.Board{
				Title: "Test Board",
				Data:  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			expectError:   true,
			errorContains: "owner is required",
		},
		{
			name: "Update Owner Too Short",
			updates: model.Board{
				Title: "Test Board",
				Owner: "a",
				Data:  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			expectError:   true,
			errorContains: "owner must be between 2 and 50 characters",
		},

		// Data validation
		{
			name: "Update with Invalid JSON Data",
			updates: model.Board{
				Title: "Test Board",
				Owner: "test_owner",
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
				Owner: "updated_owner",
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
}
