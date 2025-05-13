package service

import (
	"microservice-architecture-builder/backend/data"
	"microservice-architecture-builder/backend/model"
	"reflect"

	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

type UserService struct {
	store *data.UserStore
}

func NewUserService(store *data.UserStore) *UserService {
	return &UserService{store: store}
}

func (s *UserService) CreateUser(user *model.User) error {
	return s.store.Create(user)
}

func (s *UserService) GetUserByID(id string) (*model.User, error) {
	return s.store.GetByID(id)
}

func (s *UserService) UpdateUser(id string, updates *map[string]any) (*model.User, error) {
	userToUpdate, err := s.store.GetByID(id)
	if err != nil {
		return nil, err
	}

	// Use reflect to generically set allowed fields
	for key, value := range *updates {
		if strValue, ok := value.(string); ok {
			c := cases.Title(language.Und)
			field := reflect.ValueOf(userToUpdate).Elem().FieldByName(c.String(key))
			if field.IsValid() && field.CanSet() {
				if field.Kind() == reflect.String {
					field.SetString(strValue)
				}
			}
		}
	}

	err = s.store.Update(id, userToUpdate)
	if err != nil {
		return nil, err
	}

	return userToUpdate, nil
}

func (s *UserService) DeleteUser(id string) error {
	return s.store.Delete(id)
}
