package data

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"microservice-architecture-builder/backend/model"
)

type SupabaseStore struct {
	httpClient *http.Client
}

const (
	supabaseApiKeyEnv = "SUPABASE_PUBLIC_ANON_KEY"
	supabaseUrlEnv    = "SUPABASE_URL"
)

func NewSupabaseStore() *SupabaseStore {
	return &SupabaseStore{httpClient: &http.Client{}}
}

func getSupabaseApiKey() string {
	return os.Getenv(supabaseApiKeyEnv)
}

func getSupabaseUrl() string {
	return os.Getenv(supabaseUrlEnv)
}

func (s *SupabaseStore) headers() http.Header {
	h := http.Header{}
	h.Set("apikey", getSupabaseApiKey())
	h.Set("Authorization", "Bearer "+getSupabaseApiKey())
	h.Set("Content-Type", "application/json")
	h.Set("Prefer", "return=representation")
	return h
}

type SupabaseError struct {
	StatusCode int
	Message    string
}

func (e *SupabaseError) Error() string { return e.Message }

// Helper to normalize error messages by status code
func normalizeErrorMessage(statusCode int) string {
	switch statusCode {
	case 404:
		return "board not found"
	case 400:
		return "bad request"
	case 401:
		return "unauthorized"
	case 403:
		return "forbidden"
	default:
		return "internal server error"
	}
}

// Helper to perform HTTP request and normalize errors
func (s *SupabaseStore) doRequest(method, url string, headers http.Header, body []byte) (*http.Response, error) {
	var req *http.Request
	var err error
	if body != nil {
		req, err = http.NewRequest(method, url, bytes.NewBuffer(body))
	} else {
		req, err = http.NewRequest(method, url, nil)
	}
	if err != nil {
		return nil, &SupabaseError{StatusCode: 500, Message: err.Error()}
	}
	if headers != nil {
		req.Header = headers
	}
	resp, err := s.httpClient.Do(req)
	if err != nil {
		return nil, &SupabaseError{StatusCode: 500, Message: err.Error()}
	}
	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		msg := normalizeErrorMessage(resp.StatusCode)
		resp.Body.Close()
		return nil, &SupabaseError{StatusCode: resp.StatusCode, Message: msg}
	}
	return resp, nil
}

func (s *SupabaseStore) Create(board *model.Board) error {
	// Prepare payload
	payload, err := json.Marshal(board)
	if err != nil {
		return err
	}

	supabaseUrl := getSupabaseUrl()

	req, err := http.NewRequest("POST", supabaseUrl, bytes.NewBuffer(payload))
	if err != nil {
		return err
	}
	req.Header = s.headers()

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return &SupabaseError{StatusCode: resp.StatusCode, Message: fmt.Sprintf("failed to create board: %s", string(body))}
	}

	// Parse the returned board from the response
	var boards []model.Board
	if err := json.NewDecoder(resp.Body).Decode(&boards); err == nil && len(boards) > 0 {
		*board = boards[0]
	}
	return nil
}

func (s *SupabaseStore) GetAll() []*model.Board {
	supabaseUrl := getSupabaseUrl()
	supabaseProjectID := os.Getenv("SUPABASE_PROJECT_ID")

	if supabaseUrl == "" || supabaseProjectID == "" {
		return nil
	}

	req, err := http.NewRequest("GET", supabaseUrl+"?deleted=is.null", nil)
	if err != nil {
		return nil
	}
	req.Header = s.headers()
	resp, err := s.httpClient.Do(req)
	if err != nil {
		return nil
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil
	}
	var boards []*model.Board
	if err := json.NewDecoder(resp.Body).Decode(&boards); err != nil {
		return nil
	}
	return boards
}

func (s *SupabaseStore) GetByID(id string) (*model.Board, error) {
	url := getSupabaseUrl() + fmt.Sprintf("?id=eq.%s&deleted=is.null", id)
	resp, err := s.doRequest("GET", url, s.headers(), nil)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var boards []*model.Board
	if err := json.NewDecoder(resp.Body).Decode(&boards); err != nil {
		return nil, err
	}
	if len(boards) == 0 {
		return nil, &SupabaseError{StatusCode: 404, Message: "board not found"}
	}
	return boards[0], nil
}

func (s *SupabaseStore) Update(id string, updatedBoard *model.Board) error {
	url := getSupabaseUrl() + fmt.Sprintf("?id=eq.%s", id)

	payload, err := json.Marshal(updatedBoard)
	if err != nil {
		return err
	}

	resp, err := s.doRequest("PATCH", url, s.headers(), payload)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	return nil
}

func (s *SupabaseStore) Delete(id string) error {
	// Check if board exists before attempting delete
	_, err := s.GetByID(id)
	if err != nil {
		return err
	}
	patch := map[string]interface{}{"deleted": time.Now().UTC()}
	payload, _ := json.Marshal(patch)
	url := getSupabaseUrl() + fmt.Sprintf("?id=eq.%s", id)
	resp, err := s.doRequest("PATCH", url, s.headers(), payload)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	// Debug logging: print status code and response body
	body, _ := io.ReadAll(resp.Body)
	log.Printf("SupabaseStore.Delete: HTTP %d, response: %s", resp.StatusCode, string(body))

	var boards []model.Board
	if err := json.Unmarshal(body, &boards); err == nil {
		if len(boards) == 0 {
			log.Printf("SupabaseStore.Delete: board not found for id=%s", id)
			return &SupabaseError{StatusCode: 404, Message: "board not found"}
		}
		// If the board is returned (even with Deleted set), treat as success
	}
	return nil
}
