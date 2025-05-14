package controller

import (
	"encoding/json"
	"io"
	"microservice-architecture-builder/backend/helpers"
	"net/http"
	"net/url"
	"os"
	"strings"
)

type OauthController struct{}

func NewOauthController() *OauthController {
	return &OauthController{}
}

// GoogleLoginHandler handles GET /auth/google/login
func (oc *OauthController) GoogleLoginRedirect(w http.ResponseWriter, r *http.Request) {
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
func (oc *OauthController) GoogleCallbackHandler(w http.ResponseWriter, r *http.Request) {
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
	claims, err := helpers.ParseJWTUnverified(tokenResp.IDToken)
	if err != nil {
		sendError(w, http.StatusInternalServerError, "Failed to parse id_token")
		return
	}

	userId, ok := claims["sub"].(string)
	if !ok || userId == "" {
		sendError(w, http.StatusInternalServerError, "No sub in id_token")
		return
	}

	// User creation/check logic should be handled elsewhere if needed

	// Create JWT
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		sendError(w, http.StatusInternalServerError, "JWT secret not configured")
		return
	}
	signedToken, err := helpers.CreateAndSignJWT(map[string]interface{}{"id": userId})
	if err != nil {
		sendError(w, http.StatusInternalServerError, "Failed to sign JWT")
		return
	}

	// Redirect to frontend with token in hash
	frontendURL := os.Getenv("FRONTEND_URL")
	redirectURL := frontendURL + "#auth-token=" + signedToken
	http.Redirect(w, r, redirectURL, http.StatusFound)
}
