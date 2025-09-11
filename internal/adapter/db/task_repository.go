package db

import (
	"context"
	"wailstest/internal/model"

	"github.com/jackc/pgx/v5"
)

type TaskRepository struct {
	conn *pgx.Conn
}

func NewTaskRepository(conn *pgx.Conn) *TaskRepository {
	return &TaskRepository{
		conn: conn,
	}
}

// implement me
func (tr *TaskRepository) Create(ctx context.Context, task model.Task) error {
	q := `INSERT INTO tasks (title, body) VALUES ($1, $2)`
	_, err := tr.conn.Exec(ctx, q, task.Title, task.Body)
	return err
}

func (tr *TaskRepository) GetAll(ctx context.Context) ([]model.Task, error) {
	q := `SELECT * FROM tasks ORDER BY created_at`
	
}