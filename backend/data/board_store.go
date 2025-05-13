package data

import (
	"database/sql"
	"time"

	"microservice-architecture-builder/backend/model"

	_ "github.com/lib/pq"
)

type BoardStore struct {
	db *sql.DB
}

func NewBoardStore(db *sql.DB) *BoardStore {
	return &BoardStore{db: db}
}

func (s *BoardStore) Create(board *model.Board) error {
	query := `INSERT INTO boards (id, title, owner, data, password, deleted_at, created_at, share_fragment) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`
	_, err := s.db.Exec(query, board.ID, board.Title, board.Owner, board.Data, board.Password, board.DeletedAt, board.CreatedAt, board.ShareFragment)
	return err
}

func (s *BoardStore) GetAllFromUser(userID string) ([]*model.Board, error) {
	rows, err := s.db.Query(`SELECT id, title, owner, data, password, deleted_at, created_at, share_fragment FROM boards WHERE deleted_at IS NULL AND owner = $1`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var boards []*model.Board
	for rows.Next() {
		var b model.Board
		var password sql.NullString
		var deletedAt sql.NullTime
		var shareFragment sql.NullString
		if err := rows.Scan(&b.ID, &b.Title, &b.Owner, &b.Data, &password, &deletedAt, &b.CreatedAt, &shareFragment); err != nil {
			continue
		}
		if password.Valid {
			b.Password = &password.String
		}
		if deletedAt.Valid {
			b.DeletedAt = &deletedAt.Time
		}
		if shareFragment.Valid {
			b.ShareFragment = &shareFragment.String
		}
		boards = append(boards, &b)
	}
	if boards == nil {
		boards = make([]*model.Board, 0)
	}
	return boards, nil
}

func (s *BoardStore) GetByID(id string) (*model.Board, error) {
	var b model.Board
	var password sql.NullString
	var deletedAt sql.NullTime
	var shareFragment sql.NullString
	query := `SELECT id, title, owner, data, password, deleted_at, created_at, share_fragment FROM boards WHERE id = $1 AND deleted_at IS NULL`
	err := s.db.QueryRow(query, id).Scan(&b.ID, &b.Title, &b.Owner, &b.Data, &password, &deletedAt, &b.CreatedAt, &shareFragment)
	if err != nil {
		return nil, err
	}
	if password.Valid {
		b.Password = &password.String
	}
	if deletedAt.Valid {
		b.DeletedAt = &deletedAt.Time
	}
	if shareFragment.Valid {
		b.ShareFragment = &shareFragment.String
	}
	return &b, nil
}

func (s *BoardStore) Update(id string, updatedBoard *model.Board) error {
	query := `UPDATE boards SET title = $1, data = $2, password = $3, share_fragment = $4 WHERE id = $5 AND deleted_at IS NULL`
	_, err := s.db.Exec(query, updatedBoard.Title, updatedBoard.Data, updatedBoard.Password, updatedBoard.ShareFragment, id)
	return err
}

func (s *BoardStore) Delete(id string) error {
	query := `UPDATE boards SET deleted_at = $1 WHERE id = $2 AND deleted_at IS NULL`
	_, err := s.db.Exec(query, time.Now().UTC(), id)
	return err
}
