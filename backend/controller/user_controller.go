package controller

import (
	"encoding/json"
	"io"
	"microservice-architecture-builder/backend/model"
	"microservice-architecture-builder/backend/service"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/golang-jwt/jwt/v5"
)

type UserController struct {
	service *service.UserService
}

func NewUserController(service *service.UserService) *UserController {
	return &UserController{service: service}
}

// GetUserByID handles GET /users/{id}
func (uc *UserController) GetUserByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	user, err := uc.service.GetUserByID(id)
	if err != nil {
		sendError(w, http.StatusNotFound, model.ErrorMessages.NotFound)
		return
	}
	sendJSON(w, http.StatusOK, user)
}

// PingHandler handles GET /auth/google/login (for ping)
func (uc *UserController) PingHandler(w http.ResponseWriter, r *http.Request) {
	clientID := os.Getenv("OAUTH_GOOGLE_CLIENT_ID")
	redirectURI := os.Getenv("OAUTH_GOOGLE_REDIRECT_URI")
	if clientID == "" || redirectURI == "" {
		http.Error(w, "Google OAuth not configured", http.StatusInternalServerError)
		return
	}

	oauthURL := url.URL{
		Scheme: "https",
		Host:   "accounts.google.com",
		Path:   "/o/oauth2/v2/auth",
	}
	q := oauthURL.Query()
	q.Set("client_id", clientID)
	q.Set("redirect_uri", redirectURI)
	q.Set("response_type", "code")
	q.Set("scope", "openid email profile")
	q.Set("access_type", "offline")
	q.Set("prompt", "consent")
	oauthURL.RawQuery = q.Encode()

	http.Redirect(w, r, oauthURL.String(), http.StatusFound)
}

// GoogleLoginHandler handles GET /auth/google/login (redirects to Google OAuth)
func (uc *UserController) GoogleLoginHandler(w http.ResponseWriter, r *http.Request) {
	clientID := os.Getenv("OAUTH_GOOGLE_CLIENT_ID")
	redirectURI := os.Getenv("OAUTH_GOOGLE_REDIRECT_URI")
	if clientID == "" || redirectURI == "" {
		http.Error(w, "Google OAuth not configured", http.StatusInternalServerError)
		return
	}

	oauthURL := url.URL{
		Scheme: "https",
		Host:   "accounts.google.com",
		Path:   "/o/oauth2/v2/auth",
	}
	q := oauthURL.Query()
	q.Set("client_id", clientID)
	q.Set("redirect_uri", redirectURI)
	q.Set("response_type", "code")
	q.Set("scope", "openid email profile")
	q.Set("access_type", "offline")
	q.Set("prompt", "consent")
	oauthURL.RawQuery = q.Encode()

	http.Redirect(w, r, oauthURL.String(), http.StatusFound)
}

// GoogleCallbackHandler handles GET /auth/google/callback (Google OAuth callback)
func (uc *UserController) GoogleCallbackHandler(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	if code == "" {
		sendError(w, http.StatusBadRequest, "No authorization code received")
		return
	}

	tokenURL := url.URL{
		Scheme: "https",
		Host:   "oauth2.googleapis.com",
		Path:   "/token",
	}

	data := url.Values{}
	data.Set("code", code)
	data.Set("client_id", os.Getenv("OAUTH_GOOGLE_CLIENT_ID"))
	data.Set("client_secret", os.Getenv("OAUTH_GOOGLE_SECRET"))
	data.Set("redirect_uri", os.Getenv("OAUTH_GOOGLE_REDIRECT_URI"))
	data.Set("grant_type", "authorization_code")

	resp, err := http.Post(tokenURL.String(), "application/x-www-form-urlencoded", strings.NewReader(data.Encode()))
	if err != nil {
		sendError(w, http.StatusInternalServerError, "Failed to exchange code for token")
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		sendError(w, http.StatusInternalServerError, "Failed to read response body")
		return
	}

	var tokenResp struct {
		IDToken      string `json:"id_token"`
		AccessToken  string `json:"access_token"`
		ExpiresIn    int    `json:"expires_in"`
		TokenType    string `json:"token_type"`
		Scope        string `json:"scope"`
		RefreshToken string `json:"refresh_token"`
	}

	if err := json.Unmarshal(body, &tokenResp); err != nil {
		sendError(w, http.StatusInternalServerError, "Failed to parse token response")
		return
	}

	if tokenResp.IDToken == "" {
		sendError(w, http.StatusInternalServerError, "No id_token in response")
		return
	}

	// Parse the id_token JWT (without verifying signature, just to get claims)
	parsed, _, err := new(jwt.Parser).ParseUnverified(tokenResp.IDToken, jwt.MapClaims{})
	if err != nil {
		sendError(w, http.StatusInternalServerError, "Failed to parse id_token")
		return
	}
	claims, ok := parsed.Claims.(jwt.MapClaims)
	if !ok {
		sendError(w, http.StatusInternalServerError, "Invalid id_token claims")
		return
	}

	userId, ok := claims["sub"].(string)
	if !ok || userId == "" {
		sendError(w, http.StatusInternalServerError, "No sub in id_token")
		return
	}
	email, _ := claims["email"].(string)

	_, err = uc.service.GetUserByID(userId)
	if err != nil {
		if err.Error() != model.ErrorMessages.NotFound {
			sendError(w, http.StatusInternalServerError, "Failed to check user: "+err.Error())
			return
		}

		// User not found, create new user
		user := &model.User{
			ID:        userId,
			Username:  email,
			Provider:  "google",
			CreatedAt: time.Now(),
		}

		err = uc.service.CreateUser(user)
		if err != nil {
			sendError(w, http.StatusInternalServerError, "Failed to create user")
			return
		}
	}

	// Create JWT
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		sendError(w, http.StatusInternalServerError, "JWT secret not configured")
		return
	}
	unsignedToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id": userId,
	})

	signedToken, err := unsignedToken.SignedString([]byte(jwtSecret))
	if err != nil {
		sendError(w, http.StatusInternalServerError, "Failed to sign JWT")
		return
	}

	// Redirect to frontend with token in hash
	frontendURL := os.Getenv("FRONTEND_URL")
	redirectURL := frontendURL + "#/auth/callback?token=" + signedToken
	http.Redirect(w, r, redirectURL, http.StatusFound)
}
