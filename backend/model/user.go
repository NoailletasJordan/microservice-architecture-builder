package model

import (
	"time"

	"github.com/google/uuid"
)

// User represents a user in the system
type User struct {
	ID        uuid.UUID  `json:"id,omitempty"`
	Username  string     `json:"username"`
	Provider  string     `json:"provider"`
	CreatedAt time.Time  `json:"created_at,omitempty"`
	DeletedAt *time.Time `json:"deleted_at,omitempty"`
}
