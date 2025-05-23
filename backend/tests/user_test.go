package tests

import (
	"encoding/json"
	"net/http"
	"strings"
	"testing"

	"microservice-architecture-builder/backend/model"
	"microservice-architecture-builder/backend/helpers"
	"net/http/httptest"
)

func TestGetMe_Authorized(t *testing.T) {
	ts := NewTestServer()
	defer ts.Close()

	user := createTestUser(t, ts)

	rr := makeRequest(t, ts, "GET", "/api/users/me", nil, &user.ID)
	if rr.Code != http.StatusOK {
		t.Errorf("Expected 200 OK, got %d", rr.Code)
	}
	var got model.User
	if err := json.NewDecoder(rr.Body).Decode(&got); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}
	if got.ID != user.ID {
		t.Errorf("Expected user ID %s, got %s", user.ID, got.ID)
	}
}

func TestGetMe_Unauthorized(t *testing.T) {
	ts := NewTestServer()
	defer ts.Close()

	t.Run("No Authorization header", func(t *testing.T) {
		rr := makeRequest(t, ts, "GET", "/api/users/me", nil, nil)
		if rr.Code != http.StatusUnauthorized {
			t.Errorf("Expected 401 Unauthorized, got %d", rr.Code)
		}
		var errResp map[string]string
		if err := json.NewDecoder(rr.Body).Decode(&errResp); err != nil {
			t.Fatalf("Failed to decode error response: %v", err)
		}
		if errMsg, ok := errResp["error"]; !ok || !strings.Contains(errMsg, helpers.ErrorMessages.Unauthorized) {
			t.Errorf("Expected unauthorized error, got: %s", errMsg)
		}
	})

	t.Run("Malformed Authorization header", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/api/users/me", nil)
		req.Header.Set("Authorization", "NotBearerToken")
		req.Header.Set("Content-Type", "application/json")
		rr := httptest.NewRecorder()
		ts.Router.ServeHTTP(rr, req)
		if rr.Code != http.StatusUnauthorized {
			t.Errorf("Expected 401 Unauthorized, got %d", rr.Code)
		}
		var errResp map[string]string
		if err := json.NewDecoder(rr.Body).Decode(&errResp); err != nil {
			t.Fatalf("Failed to decode error response: %v", err)
		}
		if errMsg, ok := errResp["error"]; !ok || !strings.Contains(errMsg, helpers.ErrorMessages.Unauthorized) {
			t.Errorf("Expected unauthorized error, got: %s", errMsg)
		}
	})

	t.Run("Bearer with no token", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/api/users/me", nil)
		req.Header.Set("Authorization", "Bearer ")
		req.Header.Set("Content-Type", "application/json")
		rr := httptest.NewRecorder()
		ts.Router.ServeHTTP(rr, req)
		if rr.Code != http.StatusUnauthorized {
			t.Errorf("Expected 401 Unauthorized, got %d", rr.Code)
		}
		var errResp map[string]string
		if err := json.NewDecoder(rr.Body).Decode(&errResp); err != nil {
			t.Fatalf("Failed to decode error response: %v", err)
		}
		if errMsg, ok := errResp["error"]; !ok || !strings.Contains(errMsg, helpers.ErrorMessages.Unauthorized) {
			t.Errorf("Expected unauthorized error, got: %s", errMsg)
		}
	})

	t.Run("Bearer with invalid token", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/api/users/me", nil)
		req.Header.Set("Authorization", "Bearer invalid.token.here")
		req.Header.Set("Content-Type", "application/json")
		rr := httptest.NewRecorder()
		ts.Router.ServeHTTP(rr, req)
		if rr.Code != http.StatusUnauthorized {
			t.Errorf("Expected 401 Unauthorized, got %d", rr.Code)
		}
		var errResp map[string]string
		if err := json.NewDecoder(rr.Body).Decode(&errResp); err != nil {
			t.Fatalf("Failed to decode error response: %v", err)
		}
		if errMsg, ok := errResp["error"]; !ok || !strings.Contains(errMsg, helpers.ErrorMessages.Unauthorized) {
			t.Errorf("Expected unauthorized error, got: %s", errMsg)
		}
	})

	t.Run("Authorization with wrong scheme", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/api/users/me", nil)
		req.Header.Set("Authorization", "Basic sometoken")
		req.Header.Set("Content-Type", "application/json")
		rr := httptest.NewRecorder()
		ts.Router.ServeHTTP(rr, req)
		if rr.Code != http.StatusUnauthorized {
			t.Errorf("Expected 401 Unauthorized, got %d", rr.Code)
		}
		var errResp map[string]string
		if err := json.NewDecoder(rr.Body).Decode(&errResp); err != nil {
			t.Fatalf("Failed to decode error response: %v", err)
		}
		if errMsg, ok := errResp["error"]; !ok || !strings.Contains(errMsg, helpers.ErrorMessages.Unauthorized) {
			t.Errorf("Expected unauthorized error, got: %s", errMsg)
		}
	})
}

func TestGoogleCallbackHandler_MissingCode(t *testing.T) {
	ts := NewTestServer()
	defer ts.Close()

	r := httptest.NewRequest("GET", "/auth/google/callback", nil)
	rw := httptest.NewRecorder()
	ts.Router.ServeHTTP(rw, r)

	if rw.Code != http.StatusBadRequest {
		t.Errorf("Expected 400 for missing code, got %d", rw.Code)
	}
	if !strings.Contains(rw.Body.String(), "No authorization code received") {
		t.Errorf("Expected error message, got: %s", rw.Body.String())
	}
}
