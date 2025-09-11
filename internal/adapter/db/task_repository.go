package db

import (
	"context"
	"log/slog"
	"time"
	"wailstest/internal/model"

	"github.com/google/uuid"
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
	q := `SELECT id, title, body, done, status, created_at FROM tasks ORDER BY created_at`
	rows, err := tr.conn.Query(ctx, q)
	if err != nil {
		return []model.Task{}, err
	}
	tasks := make([]model.Task, 0)
	for rows.Next() {
		task := model.Task{}
		err = rows.Scan(&task.ID, &task.Title, &task.Body, &task.Done, &task.Status, &task.CreatedAt)
		if err != nil {
			slog.Error("cannot scan", "error", err)
			continue
		}
		tasks = append(tasks, task)
	}

	return tasks, nil
}

func (tr *TaskRepository) UpdateStatus(ctx context.Context, id uuid.UUID, status string) error {
	q := `UPDATE tasks SET status = $1 WHERE id = $2`
	_, err := tr.conn.Exec(ctx, q, status, id)
	if err != nil {
		return err
	}
	return nil
}

func (tr *TaskRepository) Delete(ctx context.Context, id uuid.UUID) error {
	q := `DELETE FROM tasks WHERE id = $1`
	_, err := tr.conn.Exec(ctx, q, id)
	if err != nil {
		return err
	}
	return nil
}

func (tr *TaskRepository) Filter(
	ctx context.Context, start, end time.Time, status string,
) ([]model.Task, error) {
	q := `SELECT id, title, body, done, status, created_at FROM tasks WHERE created_at BETWEEN $1 AND $2`
	args := []interface{}{start, end}
	if status != "" {
		args = append(args, status)
		q += ` AND status = $3`
	}
	rows, err := tr.conn.Query(ctx, q, args...)
	if err != nil {
		return []model.Task{}, err
	}
	tasks := make([]model.Task, 0)
	for rows.Next() {
		task := model.Task{}
		err = rows.Scan(&task.ID, &task.Title, &task.Body, &task.Done, &task.Status, &task.CreatedAt)
		if err != nil {
			slog.Error("cannot scan", "error", err)
			continue
		}
		tasks = append(tasks, task)
	}
	return tasks, nil
}
