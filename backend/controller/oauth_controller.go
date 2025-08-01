package controller

import (
	"microservice-architecture-builder/backend/helpers"
	"microservice-architecture-builder/backend/service"
	"net/http"
	"net/url"
	"os"
)

type OauthController struct {
	userService *service.UserService
}

func NewOAuthController(userService *service.UserService) *OauthController {
	return &OauthController{
		userService: userService,
	}
}

// GoogleLoginHandler handles GET /auth/google/login
func (oc *OauthController) GoogleLoginRedirect(w http.ResponseWriter, r *http.Request) {
	clientID := os.Getenv("OAUTH_GOOGLE_CLIENT_ID")
	if clientID == "" {
		http.Error(w, "Google OAuth not configured", http.StatusInternalServerError)
		return
	}

	// Get redirect URI using helper function
	redirectURI := helpers.GetOAuthRedirectURI(r)
	oauthURL, err := url.Parse(os.Getenv("OAUTH_GOOGLE_ACCOUNT_BASE_URL") + "/o/oauth2/v2/auth")
	if err != nil {
		http.Error(w, "Invalid OAuth Google host", http.StatusInternalServerError)
		return
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

	tokenResp, err := helpers.GetUserStructFromGoogle(r, code)
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
