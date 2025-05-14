package service

import (
	"errors"
	"log"
	"microservice-architecture-builder/backend/data"
	"microservice-architecture-builder/backend/model"
	"reflect"
	"time"

	"github.com/google/uuid"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

type BoardService struct {
	store       data.BoardStore
	userService *UserService
}

func NewBoardService(store *data.BoardStore, userService *UserService) *BoardService {
	return &BoardService{store: *store, userService: userService}
}

func (s *BoardService) CreateBoard(entries *map[string]any, ownerID string) (*model.Board, error) {
	board := &model.Board{
		Title: (*entries)["title"].(string),
		Owner: ownerID,
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

func (s *BoardService) GetBoard(id string, userID string) (*model.Board, error) {
	board, err := s.store.GetByID(id)
	if err != nil {
		return nil, err
	}

	if board.Owner != userID {
		return nil, errors.New(model.ErrorMessages.Forbidden)
	}

	return board, nil
}

func (s *BoardService) UpdateBoard(id string, entries *map[string]any, userID string) (*model.Board, error) {
	boardToUpdate, err := s.store.GetByID(id)
	if err != nil {
		return nil, err
	}

	if boardToUpdate.Owner != userID {
		return nil, errors.New(model.ErrorMessages.Forbidden)
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

func (s *BoardService) DeleteBoard(id string, userID string) error {
	// Check if board exists before deleting
	board, err := s.store.GetByID(id)
	if err != nil {
		return err
	}

	if board.Owner != userID {
		return errors.New(model.ErrorMessages.Forbidden)
	}

	err = s.store.Delete(id)
	if err != nil {
		log.Printf("BoardService.DeleteBoard: error: %v", err)
	}
	return err
}

func (s *BoardService) GetBoardShareFragment(id string, userID string) (*string, error) {
	board, err := s.store.GetByID(id)
	if err != nil {
		log.Printf("BoardService.GetBoardShareFragment: error: %v", err)
		return nil, err
	}

	if board.Owner != userID {
		return nil, errors.New(model.ErrorMessages.Forbidden)
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

func (s *BoardService) GetAllBoardsForUser(userID string) ([]*model.Board, error) {
	return s.store.GetAllFromUser(userID)
}
