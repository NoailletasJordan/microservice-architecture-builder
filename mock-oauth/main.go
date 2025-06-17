package main

import (
	"encoding/json"
	"fmt"
	"hash/fnv"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strings"
)

// GoogleUserResponse matches the structure expected by the main app
// This is a subset of what Google returns, but only includes fields we need
// to match the main app's expectations

type GoogleUserResponse struct {
	IDToken      string `json:"id_token"`
	AccessToken  string `json:"access_token"`
	ExpiresIn    int    `json:"expires_in"`
	TokenType    string `json:"token_type"`
	Scope        string `json:"scope"`
	RefreshToken string `json:"refresh_token"`
}

// UserInfoResponse matches what Google returns for /userinfo endpoint
type UserInfoResponse struct {
	IDToken       string `json:"id_token"`
	Sub           string `json:"sub"`
	Email         string `json:"email"`
	EmailVerified bool   `json:"email_verified"`
	Name          string `json:"name"`
	Picture       string `json:"picture"`
	GivenName     string `json:"given_name"`
	FamilyName    string `json:"family_name"`
	Locale        string `json:"locale"`
}

const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

func main() {
	// _ = godotenv.Load("../.env")
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	http.HandleFunc("/o/oauth2/v2/auth", createCodeAndRedirect)
	http.HandleFunc("/token", findUser)

	log.Printf("Mock OAuth service starting on port %s", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func createCodeAndRedirect(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	code := fmt.Sprint(rand.Int63())
	redirectURL := os.Getenv("OAUTH_GOOGLE_REDIRECT_URI") + "?code=" + code
	if redirectURL == "" {
		http.Error(w, "Missing OAUTH_GOOGLE_REDIRECT_URI environment variable", http.StatusInternalServerError)
		return
	}
	http.Redirect(w, r, redirectURL, http.StatusFound)
}

func findUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	auth := r.Header.Get("Authorization")
	if auth == "" || !strings.HasPrefix(auth, "Bearer ") {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Verify the token matches our mock token
	token := strings.TrimPrefix(auth, "Bearer ")

	// Generate deterministic user info
	response := UserInfoResponse{
		IDToken:       deterministicRandomString(token, 7),
		Sub:           deterministicRandomString(token, 10),
		Email:         fmt.Sprintf("%s@%s", deterministicRandomString(token, 16), "yahoo.com"),
		EmailVerified: true,
		Name:          fmt.Sprintf("User %s", token[:8]),
		GivenName:     fmt.Sprintf("User %s", token[:8]),
		FamilyName:    "OAuth",
		Locale:        "en",
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Failed to encode response: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
	}
}

// deterministicRandomString returns a random string of given length based on a seed.
func deterministicRandomString(seed string, length int) string {
	h := fnv.New64a()
	h.Write([]byte(seed))
	seedFromString := int64(h.Sum64())

	r := rand.New(rand.NewSource(seedFromString))
	b := make([]byte, length)
	for i := range b {
		b[i] = charset[r.Intn(len(charset))]
	}
	return string(b)
}
