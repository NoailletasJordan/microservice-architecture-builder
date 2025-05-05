package data

import (
	"database/sql"
	"time"

	"microservice-architecture-builder/backend/model"

	_ "github.com/lib/pq"
)

type PostgresStore struct {
	db *sql.DB
}

// NewPostgresStore creates a PostgresStore. DSN must be provided, or it panics.
func NewPostgresStore(dsn string) (*PostgresStore, error) {
	if dsn == "" {
		panic("Postgres DSN must be provided to NewPostgresStore")
	}
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, err
	}
	if err := db.Ping(); err != nil {
		return nil, err
	}
	return &PostgresStore{db: db}, nil
}

func (s *PostgresStore) Create(board *model.Board) error {
	query := `INSERT INTO boards (id, title, owner, data, password, deleted, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)`
	_, err := s.db.Exec(query, board.ID, board.Title, board.Owner, board.Data, board.Password, board.Deleted, board.CreatedAt)
	return err
}

func (s *PostgresStore) GetAll() []*model.Board {
	rows, err := s.db.Query(`SELECT id, title, owner, data, password, deleted, created_at FROM boards WHERE deleted IS NULL`)
	if err != nil {
		return nil
	}
	defer rows.Close()
	var boards []*model.Board
	for rows.Next() {
		var b model.Board
		var password sql.NullString
		var deleted sql.NullTime
		if err := rows.Scan(&b.ID, &b.Title, &b.Owner, &b.Data, &password, &deleted, &b.CreatedAt); err != nil {
			continue
		}
		if password.Valid {
			b.Password = &password.String
		}
		if deleted.Valid {
			b.Deleted = &deleted.Time
		}
		boards = append(boards, &b)
	}
	return boards
}

func (s *PostgresStore) GetByID(id string) (*model.Board, error) {
	var b model.Board
	var password sql.NullString
	var deleted sql.NullTime
	query := `SELECT id, title, owner, data, password, deleted, created_at FROM boards WHERE id = $1 AND deleted IS NULL`
	err := s.db.QueryRow(query, id).Scan(&b.ID, &b.Title, &b.Owner, &b.Data, &password, &deleted, &b.CreatedAt)
	if err != nil {
		return nil, err
	}
	if password.Valid {
		b.Password = &password.String
	}
	if deleted.Valid {
		b.Deleted = &deleted.Time
	}
	return &b, nil
}

func (s *PostgresStore) Update(id string, updatedBoard *model.Board) error {
	query := `UPDATE boards SET title = $1, data = $2, password = $3 WHERE id = $4 AND deleted IS NULL`
	_, err := s.db.Exec(query, updatedBoard.Title, updatedBoard.Data, updatedBoard.Password, id)
	return err
}

func (s *PostgresStore) Delete(id string) error {
	query := `UPDATE boards SET deleted = $1 WHERE id = $2 AND deleted IS NULL`
	_, err := s.db.Exec(query, time.Now().UTC(), id)
	return err
}

// DB returns the underlying *sql.DB instance (for testing/cleanup)
func (s *PostgresStore) DB() *sql.DB {
	return s.db
}
