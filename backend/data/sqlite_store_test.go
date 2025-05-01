package data

import (
	"microservice-architecture-builder/backend/model"
	"os"
	"testing"
)

func TestSQLiteStore(t *testing.T) {
	// Create a temporary database file
	dbPath := "test_boards.db"
	defer os.Remove(dbPath)

	// Initialize store
	store, err := NewSQLiteStore(dbPath)
	if err != nil {
		t.Fatalf("Failed to create store: %v", err)
	}
	defer store.Close()

	// Test Create
	t.Run("Create", func(t *testing.T) {
		board := &model.Board{
			Title: "Test Board",
			Owner: "test_user",
			Data:  `{"test": "data"}`,
		}

		err := store.Create(board)
		if err != nil {
			t.Errorf("Failed to create board: %v", err)
		}

		if board.ID == "" {
			t.Error("Board ID was not set")
		}
		if board.CreatedAt.IsZero() {
			t.Error("CreatedAt was not set")
		}
	})

	// Test GetByID
	t.Run("GetByID", func(t *testing.T) {
		// Create a board first
		board := &model.Board{
			Title: "Get Test Board",
			Owner: "test_user",
			Data:  `{"test": "data"}`,
		}
		err := store.Create(board)
		if err != nil {
			t.Fatalf("Failed to create board for get test: %v", err)
		}

		// Try to get the board
		retrieved, err := store.GetByID(board.ID)
		if err != nil {
			t.Errorf("Failed to get board: %v", err)
		}

		if retrieved.ID != board.ID {
			t.Errorf("Got wrong board. Want ID %s, got %s", board.ID, retrieved.ID)
		}
	})

	// Test GetAll
	t.Run("GetAll", func(t *testing.T) {
		// Create a few boards
		for i := 0; i < 3; i++ {
			board := &model.Board{
				Title: "List Test Board",
				Owner: "test_user",
				Data:  `{"test": "data"}`,
			}
			err := store.Create(board)
			if err != nil {
				t.Fatalf("Failed to create board for list test: %v", err)
			}
		}

		boards := store.GetAll()
		if len(boards) < 3 {
			t.Errorf("Expected at least 3 boards, got %d", len(boards))
		}
	})

	// Test Update
	t.Run("Update", func(t *testing.T) {
		// Create a board first
		board := &model.Board{
			Title: "Update Test Board",
			Owner: "test_user",
			Data:  `{"test": "data"}`,
		}
		err := store.Create(board)
		if err != nil {
			t.Fatalf("Failed to create board for update test: %v", err)
		}

		// Update the board
		updatedBoard := &model.Board{
			Title: "Updated Board",
			Owner: "test_user",
			Data:  `{"updated": "data"}`,
		}
		err = store.Update(board.ID, updatedBoard)
		if err != nil {
			t.Errorf("Failed to update board: %v", err)
		}

		// Verify the update
		retrieved, err := store.GetByID(board.ID)
		if err != nil {
			t.Errorf("Failed to get updated board: %v", err)
		}

		if retrieved.Title != "Updated Board" {
			t.Errorf("Update failed. Want title %s, got %s", "Updated Board", retrieved.Title)
		}
	})

	// Test Delete
	t.Run("Delete", func(t *testing.T) {
		// Create a board first
		board := &model.Board{
			Title: "Delete Test Board",
			Owner: "test_user",
			Data:  `{"test": "data"}`,
		}
		err := store.Create(board)
		if err != nil {
			t.Fatalf("Failed to create board for delete test: %v", err)
		}

		// Delete the board
		err = store.Delete(board.ID)
		if err != nil {
			t.Errorf("Failed to delete board: %v", err)
		}

		// Try to get the deleted board
		_, err = store.GetByID(board.ID)
		if err == nil {
			t.Error("Expected error when getting deleted board")
		}
	})

	// Test Password handling
	t.Run("Password", func(t *testing.T) {
		password := "test_password"
		board := &model.Board{
			Title:    "Password Test Board",
			Owner:    "test_user",
			Data:     `{"test": "data"}`,
			Password: &password,
		}

		err := store.Create(board)
		if err != nil {
			t.Fatalf("Failed to create board with password: %v", err)
		}

		retrieved, err := store.GetByID(board.ID)
		if err != nil {
			t.Errorf("Failed to get board with password: %v", err)
		}

		if retrieved.Password == nil || *retrieved.Password != password {
			t.Error("Password was not preserved correctly")
		}
	})
}

func TestSQLiteStoreEdgeCases(t *testing.T) {
	dbPath := "test_boards_edge.db"
	defer os.Remove(dbPath)

	store, err := NewSQLiteStore(dbPath)
	if err != nil {
		t.Fatalf("Failed to create store: %v", err)
	}
	defer store.Close()

	t.Run("GetNonExistentBoard", func(t *testing.T) {
		_, err := store.GetByID("non_existent_id")
		if err == nil {
			t.Error("Expected error when getting non-existent board")
		}
	})

	t.Run("UpdateNonExistentBoard", func(t *testing.T) {
		board := &model.Board{
			Title: "Test Board",
			Owner: "test_user",
			Data:  `{"test": "data"}`,
		}
		err := store.Update("non_existent_id", board)
		if err == nil {
			t.Error("Expected error when updating non-existent board")
		}
	})

	t.Run("DeleteNonExistentBoard", func(t *testing.T) {
		err := store.Delete("non_existent_id")
		if err == nil {
			t.Error("Expected error when deleting non-existent board")
		}
	})

	t.Run("DeleteAlreadyDeletedBoard", func(t *testing.T) {
		// Create and delete a board
		board := &model.Board{
			Title: "Double Delete Test Board",
			Owner: "test_user",
			Data:  `{"test": "data"}`,
		}
		err := store.Create(board)
		if err != nil {
			t.Fatalf("Failed to create board for double delete test: %v", err)
		}

		err = store.Delete(board.ID)
		if err != nil {
			t.Fatalf("Failed first delete: %v", err)
		}

		// Try to delete again
		err = store.Delete(board.ID)
		if err == nil {
			t.Error("Expected error when deleting already deleted board")
		}
	})

	t.Run("InvalidJSON", func(t *testing.T) {
		board := &model.Board{
			Title: "Invalid JSON Test Board",
			Owner: "test_user",
			Data:  `{"invalid": json}`, // Invalid JSON
		}
		err := store.Create(board)
		if err == nil {
			t.Error("Expected error when creating board with invalid JSON data")
		}
	})
}
