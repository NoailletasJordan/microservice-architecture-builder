package service

import (
	"log"
	"microservice-architecture-builder/backend/data"
	"microservice-architecture-builder/backend/model"
)

// Re-export SupabaseError for controller use
type SupabaseError = data.SupabaseError

type BoardService struct {
	store *data.SupabaseStore
}

func NewBoardService(store *data.SupabaseStore) *BoardService {
	return &BoardService{store: store}
}

func (s *BoardService) CreateBoard(board *model.Board) error {
	if err := board.Validate(); err != nil {
		return &SupabaseError{StatusCode: 400, Message: err.Error()}
	}
	return s.store.Create(board)
}

func (s *BoardService) GetAllBoards() []*model.Board {
	return s.store.GetAll()
}

func (s *BoardService) GetBoard(id string) (*model.Board, error) {
	return s.store.GetByID(id)
}

func (s *BoardService) UpdateBoard(id string, board *model.Board) error {
	if err := board.Validate(); err != nil {
		return &SupabaseError{StatusCode: 400, Message: err.Error()}
	}
	return s.store.Update(id, board)
}

func (s *BoardService) DeleteBoard(id string) error {
	err := s.store.Delete(id)
	if err != nil {
		log.Printf("BoardService.DeleteBoard: error: %v", err)
	}
	return err
}
