package service

import (
	"log"
	"microservice-architecture-builder/backend/data"
	"microservice-architecture-builder/backend/model"
	"time"

	"github.com/google/uuid"
)

// Re-export SupabaseError for controller use
type SupabaseError = data.SupabaseError

type BoardService struct {
	store *data.SupabaseStore
}

func NewBoardService(store *data.SupabaseStore) *BoardService {
	return &BoardService{store: store}
}

func (s *BoardService) CreateBoard(entries *map[string]any) error {
	board := &model.Board{
		Title: (*entries)["title"].(string),
		Owner: (*entries)["owner"].(string),
		Data:  (*entries)["data"].(string),
	}
	if password, ok := (*entries)["password"].(string); ok {
		board.Password = &password
	}

	board.ID = uuid.New().String()
	board.CreatedAt = time.Now().UTC()

	// Validation is now handled in the controller
	return s.store.Create(board)
}

func (s *BoardService) GetAllBoards() []*model.Board {
	return s.store.GetAll()
}

func (s *BoardService) GetBoard(id string) (*model.Board, error) {
	return s.store.GetByID(id)
}

func (s *BoardService) UpdateBoard(id string, board *model.Board) error {
	// PATCH validation is handled in the controller using ValidatePatch
	return s.store.Update(id, board)
}

func (s *BoardService) DeleteBoard(id string) error {
	err := s.store.Delete(id)
	if err != nil {
		log.Printf("BoardService.DeleteBoard: error: %v", err)
	}
	return err
}
