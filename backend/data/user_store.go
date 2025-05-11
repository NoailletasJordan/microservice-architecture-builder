package data

import (
	"database/sql"
	"errors"
	"microservice-architecture-builder/backend/model"

	"github.com/google/uuid"
)

type UserStore struct {
	db *sql.DB
}

func NewUserStore(db *sql.DB) *UserStore {
	return &UserStore{db: db}
}

func (s *UserStore) Create(user *model.User) error {
	return nil
}

func (s *UserStore) GetByID(id string) (*model.User, error) {
	var user model.User
	var deletedAt sql.NullTime
	var uuidVal uuid.UUID
	query := `SELECT id, username, provider, created_at, deleted_at FROM users WHERE id = $1`
	err := s.db.QueryRow(query, id).Scan(&uuidVal, &user.Username, &user.Provider, &user.CreatedAt, &deletedAt)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}
	user.ID = uuidVal
	if deletedAt.Valid {
		user.DeletedAt = &deletedAt.Time
	}
	return &user, nil
}

func (s *UserStore) Update(id string, user *model.User) error {
	return errors.New("not implemented")
}

func (s *UserStore) Delete(id string) error {
	return errors.New("not implemented")
}
