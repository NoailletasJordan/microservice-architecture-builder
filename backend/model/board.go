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
	if b.Title == "" {
		return errors.New("title is required")
	}
	if b.Owner == "" {
		return errors.New("owner is required")
	}
	if b.Data == "" {
		return errors.New("data is required")
	}

	// Validate JSON data
	var js json.RawMessage
	if err := json.Unmarshal([]byte(b.Data), &js); err != nil {
		return errors.New("data must be valid JSON")
	}

	return nil
}
