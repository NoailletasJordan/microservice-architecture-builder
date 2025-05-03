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
			errorContains: "validation error on field",
		},
		{
			name: "Title Too Long",
			board: map[string]string{
				"title": generateLongString(101),
				"owner": "test_owner",
				"data":  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "validation error on field",
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
			errorContains: "validation error on field",
		},
		{
			name: "Owner Too Short",
			board: map[string]string{
				"title": "Test Board",
				"owner": "a",
				"data":  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "validation error on field",
		},
		{
			name: "Owner Too Long",
			board: map[string]string{
				"title": "Test Board",
				"owner": generateLongString(51),
				"data":  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "validation error on field",
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
			errorContains: "validation error on field",
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
			errorContains: "validation error on field",
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
				if errMsg, ok := errResp["error"]; !ok || !strings.Contains(errMsg, tt.errorContains) {
					t.Errorf("Expected error containing '%s', got '%s'", tt.errorContains, errMsg)
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
		updates       map[string]string
		expectedCode  int
		expectError   bool
		errorContains string
	}{
		// Title validation
		{
			name: "Update with Empty Title",
			updates: map[string]string{
				"title": "",
				"data":  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			expectError:   true,
			errorContains: "validation error on field",
		},
		{
			name: "Update Title Too Short",
			updates: map[string]string{
				"title": "a",
				"data":  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			expectError:   true,
			errorContains: "validation error on field",
		},
		{
			name: "Update Title Too Long",
			updates: map[string]string{
				"title": strings.Repeat("a", 101),
				"data":  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			expectError:   true,
			errorContains: "validation error on field",
		},
		// Data validation
		{
			name: "Update with Invalid JSON Data",
			updates: map[string]string{
				"title": "Test Board",
				"data":  `{"key":}`,
			},
			expectedCode:  http.StatusBadRequest,
			expectError:   true,
			errorContains: "data must be valid JSON",
		},
		// Valid update
		{
			name: "Valid Update All Fields",
			updates: map[string]string{
				"title": "Updated Board",
				"data":  `{"updated": "data"}`,
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

	// Extra: test PATCH with forbidden field 'owner'
	t.Run("PATCH with forbidden field owner", func(t *testing.T) {
		raw := `{"owner":"should not be allowed"}`
		rr := makeRequest(t, ts, "PATCH", "/api/board/"+board.ID, raw)
		if rr.Code != http.StatusBadRequest {
			t.Errorf("Expected 400 for forbidden field, got %d", rr.Code)
		}
		var errResp map[string]string
		if err := json.NewDecoder(rr.Body).Decode(&errResp); err != nil {
			t.Fatalf("Failed to decode error response: %v", err)
		}
		if errMsg, ok := errResp["error"]; !ok || !strings.Contains(errMsg, "unexpected fields") || !strings.Contains(errMsg, "owner") {
			t.Errorf("Expected error for forbidden field 'owner', got '%s'", errMsg)
		}
	})
}
