package service

import (
	"microservice-architecture-builder/backend/data"
	"microservice-architecture-builder/backend/model"
	"microservice-architecture-builder/backend/helpers"
	"time"
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

func (s *UserService) GetOrCreateUserFromOAuth(userId string, claims map[string]interface{}, provider string) (*model.User, error) {
	user, err := s.GetUserByID(userId)
	if err == nil {
		return user, nil
	}
	if err.Error() != helpers.ErrorMessages.NotFound {
		return nil, err
	}
	// User does not exist, create it
	username := userId
	if email, ok := claims["email"].(string); ok && email != "" {
		username = email
	}
	newUser := &model.User{
		ID:        userId,
		Username:  username,
		Provider:  provider,
		CreatedAt: time.Now().UTC(),
	}
	if err := s.CreateUser(newUser); err != nil {
		return nil, err
	}
	return newUser, nil
}
