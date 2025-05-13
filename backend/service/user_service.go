package service

import (
	"microservice-architecture-builder/backend/data"
	"microservice-architecture-builder/backend/model"
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
