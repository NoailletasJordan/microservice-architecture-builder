// This file contains all board creation and field validation tests.
package tests

import (
	"encoding/json"
	"net/http"
	"strings"
	"testing"

	"microservice-architecture-builder/backend/helpers"
	"microservice-architecture-builder/backend/model"
)

func TestBoardValidation(t *testing.T) {
	ts, terminateConnection := NewTestServer(t)
	defer ts.Close()
	defer terminateConnection()

	// Create a valid user for tests that require a valid owner
	validUser := createTestUser(t, ts)
	validOwner := validUser.ID

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
				"data": `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "validation error on field",
		},
		{
			name: "Title Too Short",
			board: map[string]string{
				"title": "a",
				"data":  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "validation error on field",
		},
		{
			name: "Title Too Long",
			board: map[string]string{
				"title": generateRandomStringOfLength(101),
				"data":  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "validation error on field",
		},
		{
			name: "Valid Title",
			board: map[string]string{
				"title": "Valid Title",
				"data":  `{"test": "data"}`,
			},
			expectedCode: http.StatusCreated,
		},

		// Owner field forbidden in body
		{
			name: "Owner Field Forbidden",
			board: map[string]string{
				"title": "Test Board",
				"data":  `{"test": "data"}`,
				"owner": validOwner,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "owner",
		},
		{
			name: "Non-existent Owner Field Forbidden",
			board: map[string]string{
				"title": "Test Board",
				"data":  `{"test": "data"}`,
				"owner": "00000000-0000-0000-0000-000000000000",
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "owner",
		},

		// Data validation tests
		{
			name: "Missing Data",
			board: map[string]string{
				"title": "Test Board",
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "validation error on field",
		},
		{
			name: "Invalid JSON Data",
			board: map[string]string{
				"title": "Test Board",
				"data":  `{invalid json}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: helpers.ErrorMessages.DataMustBeValidJSON,
		},
		{
			name: "Valid JSON Data",
			board: map[string]string{
				"title": "Test Board",
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
				"data":  `{invalid}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "validation error on field",
		},
		{
			name: "All Fields Valid",
			board: map[string]string{
				"title": "Valid Title",
				"data":  `{"valid": "json"}`,
			},
			expectedCode: http.StatusCreated,
		},

		// Additional robust test cases
		{
			name: "Title Only Whitespace",
			board: map[string]string{
				"title": "   ",
				"data":  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "validation error on field",
		},
		{
			name: "Title With Special Characters Allowed",
			board: map[string]string{
				"title": "!@#$%^&*()_+",
				"data":  `{"test": "data"}`,
			},
			expectedCode: http.StatusCreated,
		},
		{
			name: "Title With Unicode UNAllowed",
			board: map[string]string{
				"title": "测试测试🧪🧪",
				"data":  `{"test": "data"}`,
			},
			expectedCode: http.StatusBadRequest,
		},
		{
			name: "Title At Min Length",
			board: map[string]string{
				"title": generateRandomStringOfLength(2),
				"data":  `{"test": "data"}`,
			},
			expectedCode: http.StatusCreated,
		},
		{
			name: "Title At Max Length",
			board: map[string]string{
				"title": generateRandomStringOfLength(100),
				"data":  `{"test": "data"}`,
			},
			expectedCode: http.StatusCreated,
		},
		{
			name: "Data Field Empty Object",
			board: map[string]string{
				"title": "Test Board",
				"data":  `{}`,
			},
			expectedCode: http.StatusCreated,
		},
		{
			name: "Data Field Empty Array",
			board: map[string]string{
				"title": "Test Board",
				"data":  `[]`,
			},
			expectedCode: http.StatusCreated,
		},
		{
			name: "Data Field Large JSON",
			board: map[string]string{
				"title": "Test Board",
				"data":  strings.Repeat("x", 4*1024*1024), // 4MB of x's
			},
			expectedCode: http.StatusRequestEntityTooLarge,
		},
		{
			name: "Null Fields",
			board: map[string]string{
				"title": "",
				"data":  "",
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "validation error on field",
		},
		{
			name: "Create With Extra Unexpected Field",
			board: map[string]string{
				"title": "Test Board",
				"data":  `{"test": "data"}`,
				"extra": "should be ignored or rejected",
			},
			expectedCode: http.StatusBadRequest,
		},
		{
			name: "Title With Accented Latin Characters",
			board: map[string]string{
				"title": "Café",
				"data":  `{"test": "data"}`,
			},
			expectedCode: http.StatusCreated,
		},
		{
			name: "Title With Cyrillic Characters",
			board: map[string]string{
				"title": "Тест",
				"data":  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "validation error on field",
		},
		{
			name: "Title With Chinese Characters",
			board: map[string]string{
				"title": "测试测试测试测试",
				"data":  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "validation error on field",
		},
		{
			name: "Title With Emoji",
			board: map[string]string{
				"title": "Test 😊",
				"data":  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "validation error on field",
		},
		{
			name: "Create With shareFragment Forbidden",
			board: map[string]string{
				"title":          "Test Board",
				"data":           `{"test": "data"}`,
				"share_fragment": "not-allowed",
			},
			expectedCode: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			rr := makeRequest(t, ts, "POST", "/api/board/", tt.board, &validOwner)

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
	ts, terminateConnection := NewTestServer(t)
	defer ts.Close()
	defer terminateConnection()

	// Create a test board for update tests
	user := createTestUser(t, ts)
	board := createTestBoard(t, ts, user.ID)

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
			errorContains: helpers.ErrorMessages.DataMustBeValidJSON,
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
		// Additional robust PATCH/Update test cases
		{
			name: "Update Title Only Whitespace",
			updates: map[string]string{
				"title": "   ",
				"data":  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			expectError:   true,
			errorContains: "validation error on field",
		},
		{
			name: "Update Title With Special Characters Allowed",
			updates: map[string]string{
				"title": "!@#$%^&*()_+",
				"data":  `{"test": "data"}`,
			},
			expectedCode: http.StatusOK,
			expectError:  false,
		},
		{
			name: "Update Title With Unicode UNAllowed",
			updates: map[string]string{
				"title": "测试测试🧪🧪",
				"data":  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			expectError:   true,
			errorContains: "validation error on field",
		},
		{
			name: "Update Title At Min Length",
			updates: map[string]string{
				"title": generateRandomStringOfLength(2),
				"data":  `{"test": "data"}`,
			},
			expectedCode: http.StatusOK,
			expectError:  false,
		},
		{
			name: "Update Title At Max Length",
			updates: map[string]string{
				"title": generateRandomStringOfLength(100),
				"data":  `{"test": "data"}`,
			},
			expectedCode: http.StatusOK,
			expectError:  false,
		},
		{
			name: "Update Data Field Empty Object",
			updates: map[string]string{
				"title": "Test Board",
				"data":  `{}`,
			},
			expectedCode: http.StatusOK,
			expectError:  false,
		},
		{
			name: "Update Data Field Empty Array",
			updates: map[string]string{
				"title": "Test Board",
				"data":  `[]`,
			},
			expectedCode: http.StatusOK,
			expectError:  false,
		},
		{
			name: "Update Data Field Large JSON",
			updates: map[string]string{
				"title": "Test Board",
				"data":  strings.Repeat("x", 4*1024*1024), // 4MB of x's
			},
			expectedCode: http.StatusRequestEntityTooLarge,
			expectError:  true,
		},
		{
			name: "Update With Extra Unexpected Field",
			updates: map[string]string{
				"title": "Test Board",
				"data":  `{"test": "data"}`,
				"extra": "should be ignored or rejected",
			},
			expectedCode: http.StatusBadRequest,
			expectError:  true,
		},
		{
			name: "Update With Null Fields",
			updates: map[string]string{
				"title": "",
				"data":  "",
			},
			expectedCode:  http.StatusBadRequest,
			expectError:   true,
			errorContains: helpers.ErrorMessages.DataMustBeValidJSON,
		},
		{
			name: "PATCH With Only Forbidden Field",
			updates: map[string]string{
				"owner": "new_owner",
			},
			expectedCode:  http.StatusBadRequest,
			expectError:   true,
			errorContains: "at least one of",
		},
		{
			name:          "PATCH With No Fields",
			updates:       map[string]string{},
			expectedCode:  http.StatusBadRequest,
			expectError:   true,
			errorContains: "at least one of",
		},
		{
			name: "Update Title With Accented Latin Characters",
			updates: map[string]string{
				"title": "Café",
				"data":  `{"test": "data"}`,
			},
			expectedCode: http.StatusOK,
			expectError:  false,
		},
		{
			name: "Update Title With Cyrillic Characters",
			updates: map[string]string{
				"title": "Тест",
				"data":  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			expectError:   true,
			errorContains: "validation error on field",
		},
		{
			name: "Update Title With Chinese Characters",
			updates: map[string]string{
				"title": "测试",
				"data":  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			expectError:   true,
			errorContains: "validation error on field",
		},
		{
			name: "Update Title With Emoji",
			updates: map[string]string{
				"title": "Test 😊",
				"data":  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			expectError:   true,
			errorContains: "validation error on field",
		},
		{
			name: "Update With Valid Latin Only Title",
			updates: map[string]string{
				"title": "ValidTitle",
				"data":  `{"test": "data"}`,
			},
			expectedCode: http.StatusOK,
			expectError:  false,
		},
		{
			name: "Update With shareFragment Forbidden",
			updates: map[string]string{
				"share_fragment": "not-allowed",
			},
			expectedCode: http.StatusBadRequest,
			expectError:  true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			rr := makeRequest(t, ts, "PATCH", "/api/board/"+board.ID, tt.updates, &user.ID)

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
		raw := map[string]string{
			"owner": "should not be allowed",
		}
		rr := makeRequest(t, ts, "PATCH", "/api/board/"+board.ID, raw, &user.ID)
		if rr.Code != http.StatusBadRequest {
			t.Errorf("Expected 400 for forbidden field, got %d", rr.Code)
		}
		var errResp map[string]string
		if err := json.NewDecoder(rr.Body).Decode(&errResp); err != nil {
			t.Fatalf("Failed to decode error response: %v", err)
		}
		if errMsg, ok := errResp["error"]; !ok || !strings.Contains(errMsg, "at least one of") {
			t.Errorf("Expected: a validation error, got '%s'", errMsg)
		}
	})
}
