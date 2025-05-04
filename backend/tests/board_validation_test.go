// This file contains all board creation and field validation tests.
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
			errorContains: model.ErrorMessages.DataMustBeValidJSON,
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

		// Additional robust test cases
		{
			name: "Title Only Whitespace",
			board: map[string]string{
				"title": "   ",
				"owner": "test_owner",
				"data":  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "validation error on field",
		},
		{
			name: "Owner Only Whitespace",
			board: map[string]string{
				"title": "Test Board",
				"owner": "   ",
				"data":  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "validation error on field",
		},
		{
			name: "Title With Special Characters Allowed",
			board: map[string]string{
				"title": "!@#$%^&*()_+",
				"owner": "test_owner",
				"data":  `{"test": "data"}`,
			},
			expectedCode: http.StatusCreated,
		},
		{
			name: "Owner With Special Characters Allowed",
			board: map[string]string{
				"title": "Test Board",
				"owner": "!@#$%^&*()_+",
				"data":  `{"test": "data"}`,
			},
			expectedCode: http.StatusCreated,
		},
		{
			name: "Title With Unicode UNAllowed",
			board: map[string]string{
				"title": "测试测试🧪🧪",
				"owner": "test_owner",
				"data":  `{"test": "data"}`,
			},
			expectedCode: http.StatusBadRequest,
		},
		{
			name: "Owner With Unicode UNAllowed",
			board: map[string]string{
				"title": "Test Board",
				"owner": "测试测试🧪🧪",
				"data":  `{"test": "data"}`,
			},
			expectedCode: http.StatusBadRequest,
		},
		{
			name: "Title At Min Length",
			board: map[string]string{
				"title": generateLongString(2),
				"owner": "test_owner",
				"data":  `{"test": "data"}`,
			},
			expectedCode: http.StatusCreated,
		},
		{
			name: "Title At Max Length",
			board: map[string]string{
				"title": generateLongString(100),
				"owner": "test_owner",
				"data":  `{"test": "data"}`,
			},
			expectedCode: http.StatusCreated,
		},
		{
			name: "Owner At Min Length",
			board: map[string]string{
				"title": "Test Board",
				"owner": generateLongString(2),
				"data":  `{"test": "data"}`,
			},
			expectedCode: http.StatusCreated,
		},
		{
			name: "Owner At Max Length",
			board: map[string]string{
				"title": "Test Board",
				"owner": generateLongString(50),
				"data":  `{"test": "data"}`,
			},
			expectedCode: http.StatusCreated,
		},
		{
			name: "Data Field Empty Object",
			board: map[string]string{
				"title": "Test Board",
				"owner": "test_owner",
				"data":  `{}`,
			},
			expectedCode: http.StatusCreated,
		},
		{
			name: "Data Field Empty Array",
			board: map[string]string{
				"title": "Test Board",
				"owner": "test_owner",
				"data":  `[]`,
			},
			expectedCode: http.StatusCreated,
		},
		{
			name: "Data Field Large JSON",
			board: map[string]string{
				"title": "Test Board",
				"owner": "test_owner",
				"data":  strings.Repeat("x", 4*1024*1024), // 4MB of x's
			},
			expectedCode: http.StatusRequestEntityTooLarge,
		},
		{
			name: "Null Fields",
			board: map[string]string{
				"title": "",
				"owner": "",
				"data":  "",
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "validation error on field",
		},
		{
			name: "Create With Extra Unexpected Field",
			board: map[string]string{
				"title": "Test Board",
				"owner": "test_owner",
				"data":  `{"test": "data"}`,
				"extra": "should be ignored or rejected",
			},
			expectedCode: http.StatusBadRequest,
		},
		{
			name: "Title With Accented Latin Characters",
			board: map[string]string{
				"title": "Café",
				"owner": "test_owner",
				"data":  `{"test": "data"}`,
			},
			expectedCode: http.StatusCreated,
		},
		{
			name: "Title With Cyrillic Characters",
			board: map[string]string{
				"title": "Тест",
				"owner": "test_owner",
				"data":  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "validation error on field",
		},
		{
			name: "Title With Chinese Characters",
			board: map[string]string{
				"title": "测试测试测试测试",
				"owner": "test_owner",
				"data":  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "validation error on field",
		},
		{
			name: "Title With Emoji",
			board: map[string]string{
				"title": "Test 😊",
				"owner": "test_owner",
				"data":  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "validation error on field",
		},
		{
			name: "Owner With Accented Latin Characters",
			board: map[string]string{
				"title": "Test Board",
				"owner": "Renée",
				"data":  `{"test": "data"}`,
			},
			expectedCode: http.StatusCreated,
		},
		{
			name: "Owner With Cyrillic Characters",
			board: map[string]string{
				"title": "Test Board",
				"owner": "ИваИванн",
				"data":  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "validation error on field",
		},
		{
			name: "Owner With Chinese Characters",
			board: map[string]string{
				"title": "Test Board",
				"owner": "测试测试测试测试",
				"data":  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "validation error on field",
		},
		{
			name: "Owner With Emoji",
			board: map[string]string{
				"title": "Test Board",
				"owner": "😊😊😊😊",
				"data":  `{"test": "data"}`,
			},
			expectedCode:  http.StatusBadRequest,
			errorContains: "validation error on field",
		},
		{
			name: "Valid Latin Only Title and Owner",
			board: map[string]string{
				"title": "Test Board",
				"owner": "ValidOwner",
				"data":  `{"test": "data"}`,
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
			errorContains: model.ErrorMessages.DataMustBeValidJSON,
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
				"title": generateLongString(2),
				"data":  `{"test": "data"}`,
			},
			expectedCode: http.StatusOK,
			expectError:  false,
		},
		{
			name: "Update Title At Max Length",
			updates: map[string]string{
				"title": generateLongString(100),
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
			expectError:  false,
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
			errorContains: model.ErrorMessages.DataMustBeValidJSON,
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
		raw := map[string]string{
			"owner": "should not be allowed",
		}
		rr := makeRequest(t, ts, "PATCH", "/api/board/"+board.ID, raw)
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

func generateLongString(length int) string {
	return strings.Repeat("a", length)
}
