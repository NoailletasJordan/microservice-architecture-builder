package controller

import (
	"fmt"
	"microservice-architecture-builder/backend/helpers"
	"microservice-architecture-builder/backend/service"
	"net/http"
	"net/url"
	"os"
)

type OauthController struct {
	getTokenFromGoogle func(code string) (*helpers.GoogleUserResponse, error)
	userService        *service.UserService
}

func NewOAuthController(getUserStructFromGoogle func(code string) (*helpers.GoogleUserResponse, error), userService *service.UserService) *OauthController {
	return &OauthController{
		getTokenFromGoogle: getUserStructFromGoogle,
		userService:        userService,
	}
}

// GoogleLoginHandler handles GET /auth/google/login
func (oc *OauthController) GoogleLoginRedirect(w http.ResponseWriter, r *http.Request) {

	clientID := os.Getenv("OAUTH_GOOGLE_CLIENT_ID")
	redirectURI := os.Getenv("OAUTH_GOOGLE_REDIRECT_URI")
	if clientID == "" || redirectURI == "" {
		http.Error(w, "Google OAuth not configured", http.StatusInternalServerError)
		return
	}
	// temp
	if os.Getenv("MOCK_OAUTH") == "true" {
		currentURL := fmt.Sprintf("%s://%s%s", r.URL.Scheme, r.URL.Host, r.URL.Path)
		http.Redirect(w, r, currentURL+"?code=4/0AUJR-x4ZviF6qPoJqf920eFjhWfmishmb6bIESO1Zf2WDtqi5xZkVfM78ZdcFhCoHbNeqA", http.StatusFound)
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
	fmt.Println("url", r.URL.String())

	fmt.Println("code", code)
	if code == "" {
		sendError(w, http.StatusBadRequest, "No authorization code received")
		return
	}

	tokenResp, err := oc.getTokenFromGoogle(code)
	fmt.Println("tokenResp", tokenResp)
	if err != nil {
		sendError(w, http.StatusInternalServerError, "Failed to exchange code for token")
		return
	}

	if tokenResp.IDToken == "" {
		sendError(w, http.StatusInternalServerError, "No id_token in response")
		return
	}

	// Parse the id_token JWT (without verifying signature, just to get claims)
	claims, err := helpers.ParseJWTUnverified(tokenResp.IDToken)
	fmt.Println("HIT", err)
	if err != nil {
		sendError(w, http.StatusInternalServerError, "Failed to parse id_token")
		return
	}

	userId, ok := claims["sub"].(string)
	if !ok || userId == "" {
		sendError(w, http.StatusInternalServerError, "No sub in id_token")
		return
	}

	// User creation/check logic
	_, err = oc.userService.GetOrCreateUserFromOAuth(userId, claims, "google")
	if err != nil {
		sendError(w, http.StatusInternalServerError, err.Error())
		return
	}

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
