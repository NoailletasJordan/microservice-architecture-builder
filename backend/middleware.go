package main

import (
	"net/http"
)

const maxBodySize = 3 << 20 // 3MB

// MaxBodySizeMiddleware enforces a hard limit on the size of incoming request bodies.
// If the body exceeds maxBodySize, it responds with 413 and closes the connection.
func MaxBodySizeMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost, http.MethodPut, http.MethodPatch:
			r.Body = http.MaxBytesReader(w, r.Body, maxBodySize)
		}
		next.ServeHTTP(w, r)
	})
}
