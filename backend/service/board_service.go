package service

import (
	"log"
	"microservice-architecture-builder/backend/model"
	"reflect"
	"time"

	"github.com/google/uuid"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

type BoardStore interface {
	Create(*model.Board) error
	GetAll() ([]*model.Board, error)
	GetByID(string) (*model.Board, error)
	Update(string, *model.Board) error
	Delete(string) error
}

type BoardService struct {
	store BoardStore
}

func NewBoardService(store BoardStore) *BoardService {
	return &BoardService{store: store}
}

func (s *BoardService) CreateBoard(entries *map[string]any) (*model.Board, error) {
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
	return board, s.store.Create(board)
}

func (s *BoardService) GetAllBoards() ([]*model.Board, error) {

	return s.store.GetAll()
}

func (s *BoardService) GetBoard(id string) (*model.Board, error) {
	return s.store.GetByID(id)
}

func (s *BoardService) UpdateBoard(id string, entries *map[string]any) (*model.Board, error) {
	boardToUpdate, err := s.store.GetByID(id)
	if err != nil {
		return nil, err
	}

	// Apply updates to the existing board
	for key, value := range *entries {
		if strValue, ok := value.(string); ok {
			c := cases.Title(language.Und)
			field := reflect.ValueOf(boardToUpdate).Elem().FieldByName(c.String(key))
			if field.IsValid() && field.CanSet() {
				if field.Kind() == reflect.Ptr {
					// Handle pointer fields (like Password)
					newValue := reflect.New(field.Type().Elem())
					newValue.Elem().SetString(strValue)
					field.Set(newValue)
				} else if field.Kind() == reflect.String {
					// Handle string fields directly
					field.SetString(strValue)
				}
			}
		}
	}

	err = s.store.Update(id, boardToUpdate)
	if err != nil {
		return nil, err
	}

	return boardToUpdate, nil
}

func (s *BoardService) DeleteBoard(id string) error {
	// Check if board exists before deleting
	_, err := s.store.GetByID(id)
	if err != nil {
		return err
	}

	err = s.store.Delete(id)
	if err != nil {
		log.Printf("BoardService.DeleteBoard: error: %v", err)
	}
	return err
}

func (s *BoardService) GetBoardShareFragment(id string) (*string, error) {
	board, err := s.store.GetByID(id)
	if err != nil {
		return nil, err
	}

	if board.ShareFragment == nil || *board.ShareFragment == "" {
		// Generate a new share fragment
		newShareFragment := uuid.New().String()
		board.ShareFragment = &newShareFragment
		err := s.store.Update(id, board)
		if err != nil {
			return nil, err
		}
	}

	return board.ShareFragment, nil
}
