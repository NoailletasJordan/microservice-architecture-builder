package helpers

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

// CreateAndSignJWT creates a JWT with the given claims and signs it with the secret from JWT_SECRET env var.
func CreateAndSignJWT(claims jwt.MapClaims) (string, error) {
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		return "", ErrJWTSecretNotSet
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(jwtSecret))
}

// ParseJWTUnverified parses a JWT string and returns its claims without verifying the signature.
func ParseJWTUnverified(tokenString string) (jwt.MapClaims, error) {
	parsed, _, err := new(jwt.Parser).ParseUnverified(tokenString, jwt.MapClaims{})
	if err != nil {
		return nil, err
	}
	claims, ok := parsed.Claims.(jwt.MapClaims)
	if !ok {
		return nil, ErrInvalidJWTClaims
	}
	return claims, nil
}

var (
	ErrJWTSecretNotSet  = errors.New("jwt_secret not set in environment")
	ErrInvalidJWTClaims = errors.New("invalid JWT claims")
)

type GoogleUserResponse struct {
	IDToken      string `json:"id_token"`
	AccessToken  string `json:"access_token"`
	ExpiresIn    int    `json:"expires_in"`
	TokenType    string `json:"token_type"`
	Scope        string `json:"scope"`
	RefreshToken string `json:"refresh_token"`
}

// GetOAuthRedirectURI returns the OAuth redirect URI based on the current request context
func GetOAuthRedirectURI(r *http.Request) string {
	scheme := "http"
	if r.TLS != nil {
		scheme = "https"
	}
	return fmt.Sprintf("%s://%s/auth/google/callback", scheme, r.Host)
}

func GetUserStructFromGoogle(r *http.Request, code string) (*GoogleUserResponse, error) {
	tokenURL, err := url.Parse(os.Getenv("OAUTH_GOOGLE_BASE_URL") + "/token")
	if err != nil {
		return nil, errors.New("invalid OAuth Google host")
	}
	data := url.Values{}
	data.Set("code", code)
	data.Set("client_id", os.Getenv("OAUTH_GOOGLE_CLIENT_ID"))
	data.Set("client_secret", os.Getenv("OAUTH_GOOGLE_SECRET"))
	data.Set("redirect_uri", GetOAuthRedirectURI(r))
	data.Set("grant_type", "authorization_code")
	resp, err := http.Post(tokenURL.String(), "application/x-www-form-urlencoded", strings.NewReader(data.Encode()))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var googleUserResponse GoogleUserResponse

	if err := json.Unmarshal(body, &googleUserResponse); err != nil {
		return nil, err
	}

	return &googleUserResponse, nil
}

// Centralized user-facing error messages
var ErrorMessages = struct {
	NotFound                string
	BadRequest              string
	Unauthorized            string
	Forbidden               string
	InternalServerError     string
	InvalidRequestBody      string
	DataMustBeValidJSON     string
	AtLeastOneFieldRequired string
	OwnerNotFound           string
}{
	NotFound:                "entity not found",
	BadRequest:              "bad request",
	Unauthorized:            "unauthorized",
	Forbidden:               "forbidden",
	InternalServerError:     "internal server error",
	InvalidRequestBody:      "Invalid request body",
	DataMustBeValidJSON:     "data must be valid JSON",
	AtLeastOneFieldRequired: "at least one of title, data, password is required",
	OwnerNotFound:           "owner not found",
}

// Dynamic error message generators
func ValidationErrorOnField(field, tag string) string {
	return "validation error on field: " + field + ", failed on tag " + tag
}

func UnexpectedFieldError(field string) string {
	return "unexpected field in request body: " + field
}
