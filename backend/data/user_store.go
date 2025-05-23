package data

import (
	"database/sql"
	"errors"
	"microservice-architecture-builder/backend/model"
	"microservice-architecture-builder/backend/helpers"
	"time"
)

type UserStore struct {
	db *sql.DB
}

func NewUserStore(db *sql.DB) *UserStore {
	return &UserStore{db: db}
}

func (s *UserStore) Create(user *model.User) error {
	query := `INSERT INTO users (id, username, provider, created_at) VALUES ($1, $2, $3, $4)`
	_, err := s.db.Exec(query, user.ID, user.Username, user.Provider, user.CreatedAt)
	return err
}

func (s *UserStore) GetByID(id string) (*model.User, error) {
	user := model.User{
		ID: id,
	}
	var deletedAt sql.NullTime
	query := `SELECT username, provider, created_at, deleted_at FROM users WHERE id = $1`
	err := s.db.QueryRow(query, id).Scan(&user.Username, &user.Provider, &user.CreatedAt, &deletedAt)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New(helpers.ErrorMessages.NotFound)
		}
		return nil, err
	}
	if deletedAt.Valid {
		user.DeletedAt = &deletedAt.Time
	}
	return &user, nil
}

func (s *UserStore) Update(id string, user *model.User) error {
	query := `UPDATE users SET username = $1, provider = $2 WHERE id = $3`
	_, err := s.db.Exec(query, user.Username, user.Provider, id)
	return err
}

func (s *UserStore) Delete(id string) error {
	query := `UPDATE users SET deleted_at = $1 WHERE id = $2`
	_, err := s.db.Exec(query, time.Now(), id)
	return err
}
