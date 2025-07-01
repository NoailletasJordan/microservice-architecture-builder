package model

import (
	"time"
)

// User represents a user in the system
type User struct {
	ID        string     `json:"id,omitempty"`
	Username  string     `json:"username"`
	Provider  string     `json:"provider"`
	CreatedAt time.Time  `json:"created_at,omitempty"`
	DeletedAt *time.Time `json:"deleted_at,omitempty"`
}
