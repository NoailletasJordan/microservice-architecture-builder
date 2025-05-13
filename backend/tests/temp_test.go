package tests

import (
	"log"
	"testing"
)

func TestTemp(t *testing.T) {
	ts := NewTestServer()
	defer ts.Close()

	user := createTestUser(t, ts)

	board := createTestBoard(t, ts, user.ID)

	log.Println(board)

}
