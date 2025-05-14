package helpers

import (
	"errors"
	"os"

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
