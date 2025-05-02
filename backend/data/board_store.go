package data

import (
	"sync"
	"time"

	"microservice-architecture-builder/backend/model"

	"fmt"

	"github.com/google/uuid"
)

type BoardStore struct {
	boards map[string]*model.Board
	mu     sync.RWMutex
}

func NewBoardStore() *BoardStore {
	store := &BoardStore{
		boards: make(map[string]*model.Board),
	}

	// Add a fake board
	fakeBoard := &model.Board{
		ID:        uuid.New().String(),
		Title:     "Sample Board",
		Owner:     "system",
		Data:      `{"sample": "data"}`,
		CreatedAt: time.Now(),
	}
	store.boards[fakeBoard.ID] = fakeBoard

	return store
}

func (s *BoardStore) Create(board *model.Board) error {
	err := board.Validate()
	if err != nil {
		return &SupabaseError{StatusCode: 400, Message: fmt.Sprintf("board validation failed: %v", err)}
	}
	board.ID = uuid.New().String()
	board.CreatedAt = time.Now()
	s.boards[board.ID] = board
	return nil
}

func (s *BoardStore) GetAll() []*model.Board {
	s.mu.RLock()
	defer s.mu.RUnlock()

	boards := make([]*model.Board, 0, len(s.boards))
	for _, board := range s.boards {
		if board.Deleted == nil {
			boards = append(boards, board)
		}
	}
	return boards
}

func (s *BoardStore) GetByID(id string) (*model.Board, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	board, exists := s.boards[id]
	if !exists || board.Deleted != nil {
		return nil, &SupabaseError{StatusCode: 404, Message: "board not found"}
	}
	return board, nil
}

func (s *BoardStore) Update(id string, board *model.Board) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	existing, exists := s.boards[id]
	if !exists || existing.Deleted != nil {
		return &SupabaseError{StatusCode: 404, Message: "board not found"}
	}
	err := board.Validate()
	if err != nil {
		return &SupabaseError{StatusCode: 400, Message: fmt.Sprintf("board validation failed: %v", err)}
	}
	board.ID = id
	board.CreatedAt = existing.CreatedAt
	s.boards[id] = board
	return nil
}

func (s *BoardStore) Delete(id string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	board, exists := s.boards[id]
	if !exists || board.Deleted != nil {
		return &SupabaseError{StatusCode: 404, Message: "board not found"}
	}

	now := time.Now()
	board.Deleted = &now
	return nil
}

// Close implements BoardStorer.Close
func (s *BoardStore) Close() error {
	// Nothing to close for in-memory store
	return nil
}
