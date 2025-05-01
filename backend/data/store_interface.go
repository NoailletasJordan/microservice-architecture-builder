package data

import "microservice-architecture-builder/backend/model"

// BoardStore defines the interface for board data storage operations
type BoardStorer interface {
	// Create creates a new board and returns an error if the operation fails
	Create(board *model.Board) error

	// GetAll returns all non-deleted boards
	GetAll() []*model.Board

	// GetByID retrieves a board by its ID, returns error if not found or deleted
	GetByID(id string) (*model.Board, error)

	// Update updates an existing board, returns error if not found or deleted
	Update(id string, board *model.Board) error

	// Delete soft deletes a board by setting its Deleted timestamp
	Delete(id string) error

	// Close closes any resources held by the store
	Close() error
}
