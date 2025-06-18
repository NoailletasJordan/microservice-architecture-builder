package main

import (
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"hash/fnv"
	"log"
	"math/rand"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
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
	port := "8081"

	http.HandleFunc("/o/oauth2/v2/auth", createCodeAndRedirect)
	http.HandleFunc("/token", findUser)

	log.Printf("Server starting on port %s", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func createCodeAndRedirect(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	code := fmt.Sprint(rand.Int63())
	baseRedirectUrl := r.URL.Query().Get("redirect_uri")
	if baseRedirectUrl == "" {
		http.Error(w, "Missing redirect_uri", http.StatusInternalServerError)
		return
	}
	redirectURL := baseRedirectUrl + "?code=" + code
	http.Redirect(w, r, redirectURL, http.StatusFound)
}

func findUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse form data
	if err := r.ParseForm(); err != nil {
		http.Error(w, "Failed to parse form data", http.StatusBadRequest)
		return
	}

	code := r.PostForm.Get("code")

	if code == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	idToken, err := generateDeterministicJWT(code)
	if err != nil {
		http.Error(w, "Internal server error - failed to generate id_token", http.StatusInternalServerError)
		return
	}
	// Generate deterministic user info
	response := UserInfoResponse{
		IDToken:       idToken,
		Sub:           deterministicRandomString(code, 10),
		Email:         fmt.Sprintf("%s@%s", deterministicRandomString(code, 16), "yahoo.com"),
		EmailVerified: true,
		Name:          fmt.Sprintf("User %s", code[:1]),
		GivenName:     fmt.Sprintf("User %s", code[:1]),
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

// Derive a secret key from the seed using SHA-256
func deriveSecretKey(seed string) []byte {
	hash := sha256.Sum256([]byte(seed))
	return hash[:]
}

func generateDeterministicJWT(seed string) (string, error) {
	secretKey := deriveSecretKey(seed)

	claims := jwt.MapClaims{
		"sub":   seed,
		"email": fmt.Sprintf("%s@example.com", seed),
		"exp":   time.Now().Add(time.Hour * 1).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(secretKey)
}
