package service

import (
	"microservice-architecture-builder/backend/data"
	"microservice-architecture-builder/backend/model"
)

type BoardService struct {
	store *data.BoardStore
}

func NewBoardService(store *data.BoardStore) *BoardService {
	return &BoardService{store: store}
}

func (s *BoardService) CreateBoard(board *model.Board) error {
	if err := board.Validate(); err != nil {
		return err
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
		return err
	}
	return s.store.Update(id, board)
}

func (s *BoardService) DeleteBoard(id string) error {
	return s.store.Delete(id)
}
