package model

import (
	"encoding/json"
	"errors"
	"time"
)

type Board struct {
	ID        string     `json:"id"`
	Title     string     `json:"title"`
	Owner     string     `json:"owner"`
	Data      string     `json:"data"`
	Password  *string    `json:"password,omitempty"`
	Deleted   *time.Time `json:"deleted,omitempty"`
	CreatedAt time.Time  `json:"created_at"`
}

func (b *Board) Validate() error {
	// Title validation
	if b.Title == "" {
		return errors.New("title is required")
	}
	if len(b.Title) < 2 || len(b.Title) > 100 {
		return errors.New("title must be between 2 and 100 characters")
	}

	// Owner validation
	if b.Owner == "" {
		return errors.New("owner is required")
	}
	if len(b.Owner) < 2 || len(b.Owner) > 50 {
		return errors.New("owner must be between 2 and 50 characters")
	}

	// Data validation
	if b.Data == "" {
		return errors.New("data is required")
	}
	var js json.RawMessage
	if err := json.Unmarshal([]byte(b.Data), &js); err != nil {
		return errors.New("data must be valid JSON")
	}

	return nil
}
