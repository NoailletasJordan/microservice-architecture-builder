package data

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"microservice-architecture-builder/backend/model"
	"time"

	"github.com/google/uuid"
	_ "modernc.org/sqlite"
)

// SQLiteStore implements the BoardStorer interface using SQLite as the backend
type SQLiteStore struct {
	db *sql.DB
}

// NewSQLiteStore creates a new SQLiteStore instance
func NewSQLiteStore(dbPath string) (*SQLiteStore, error) {
	db, err := sql.Open("sqlite", dbPath)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	// Set reasonable connection pool limits
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)

	store := &SQLiteStore{db: db}
	if err := store.Initialize(); err != nil {
		db.Close()
		return nil, fmt.Errorf("failed to initialize database: %w", err)
	}

	return store, nil
}

// Initialize creates the necessary database tables if they don't exist
func (s *SQLiteStore) Initialize() error {
	schema := `
	CREATE TABLE IF NOT EXISTS boards (
		id TEXT PRIMARY KEY,
		title TEXT NOT NULL,
		owner TEXT NOT NULL,
		data TEXT NOT NULL,
		password TEXT,
		deleted TIMESTAMP,
		created_at TIMESTAMP NOT NULL
	);
	CREATE INDEX IF NOT EXISTS idx_boards_deleted ON boards(deleted);
	`

	_, err := s.db.Exec(schema)
	return err
}

// Create implements BoardStorer.Create
func (s *SQLiteStore) Create(board *model.Board) error {
	// Validate board data
	if err := board.Validate(); err != nil {
		return fmt.Errorf("board validation failed: %w", err)
	}

	// Additional JSON validation
	var js json.RawMessage
	if err := json.Unmarshal([]byte(board.Data), &js); err != nil {
		return fmt.Errorf("invalid JSON data: %w", err)
	}

	board.ID = uuid.New().String()
	board.CreatedAt = time.Now()

	query := `
	INSERT INTO boards (id, title, owner, data, password, created_at)
	VALUES (?, ?, ?, ?, ?, ?)`

	_, err := s.db.Exec(query,
		board.ID,
		board.Title,
		board.Owner,
		board.Data,
		board.Password,
		board.CreatedAt,
	)

	if err != nil {
		return fmt.Errorf("failed to create board: %w", err)
	}

	return nil
}

// GetAll implements BoardStorer.GetAll
func (s *SQLiteStore) GetAll() []*model.Board {
	query := `
	SELECT id, title, owner, data, password, created_at
	FROM boards
	WHERE deleted IS NULL`

	rows, err := s.db.Query(query)
	if err != nil {
		return nil
	}
	defer rows.Close()

	var boards []*model.Board
	for rows.Next() {
		board := &model.Board{}
		err := rows.Scan(
			&board.ID,
			&board.Title,
			&board.Owner,
			&board.Data,
			&board.Password,
			&board.CreatedAt,
		)
		if err != nil {
			continue
		}
		boards = append(boards, board)
	}

	return boards
}

// GetByID implements BoardStorer.GetByID
func (s *SQLiteStore) GetByID(id string) (*model.Board, error) {
	query := `
	SELECT id, title, owner, data, password, created_at
	FROM boards
	WHERE id = ? AND deleted IS NULL`

	board := &model.Board{}
	err := s.db.QueryRow(query, id).Scan(
		&board.ID,
		&board.Title,
		&board.Owner,
		&board.Data,
		&board.Password,
		&board.CreatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, errors.New("board not found")
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get board: %w", err)
	}

	return board, nil
}

// Update implements BoardStorer.Update
func (s *SQLiteStore) Update(id string, board *model.Board) error {
	// First check if the board exists and is not deleted
	existing, err := s.GetByID(id)
	if err != nil {
		return err
	}

	// Validate board data
	if err := board.Validate(); err != nil {
		return fmt.Errorf("board validation failed: %w", err)
	}

	// Additional JSON validation
	var js json.RawMessage
	if err := json.Unmarshal([]byte(board.Data), &js); err != nil {
		return fmt.Errorf("invalid JSON data: %w", err)
	}

	query := `
	UPDATE boards
	SET title = ?, owner = ?, data = ?, password = ?
	WHERE id = ? AND deleted IS NULL`

	result, err := s.db.Exec(query,
		board.Title,
		board.Owner,
		board.Data,
		board.Password,
		id,
	)
	if err != nil {
		return fmt.Errorf("failed to update board: %w", err)
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}
	if rows == 0 {
		return errors.New("board not found or already deleted")
	}

	// Preserve the original creation time
	board.ID = id
	board.CreatedAt = existing.CreatedAt

	return nil
}

// Delete implements BoardStorer.Delete
func (s *SQLiteStore) Delete(id string) error {
	query := `
	UPDATE boards
	SET deleted = ?
	WHERE id = ? AND deleted IS NULL`

	result, err := s.db.Exec(query, time.Now(), id)
	if err != nil {
		return fmt.Errorf("failed to delete board: %w", err)
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}
	if rows == 0 {
		return errors.New("board not found or already deleted")
	}

	return nil
}

// Close implements BoardStorer.Close
func (s *SQLiteStore) Close() error {
	return s.db.Close()
}
