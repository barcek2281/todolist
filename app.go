package main

import (
	"context"
	"fmt"
	"log/slog"
	"time"
	"wailstest/internal/adapter/db"
	"wailstest/internal/config"
	"wailstest/internal/model"

	"github.com/google/uuid"
)

// App struct
type App struct {
	ctx      context.Context
	cnf      *config.Config
	db       *db.DB
	taskRepo *db.TaskRepository
}

// NewApp creates a new App application struct
func NewApp(cnf *config.Config) (*App, error) {
	database, err := db.New(context.Background(), cnf.DB)
	if err != nil {
		return nil, err
	}
	tr := db.NewTaskRepository(database.Conn)

	return &App{
		cnf:      cnf,
		db:       database,
		taskRepo: tr,
	}, nil
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(t model.Task) string {
	return fmt.Sprintf("Hello %s, It's show time!", t.Title)
}

func (a *App) CreateTask(task model.Task) error {
	ctx, cancel := context.WithTimeout(a.ctx, time.Second*5)
	defer cancel()
	err := a.taskRepo.Create(ctx, task)
	if err != nil {
		slog.Error("cannot create task", "error", err)
		return err
	}
	slog.Info("task succesfull created")
	return err
}

func (a *App) GetTasks() ([]model.Task, error) {
	ctx, cancel := context.WithTimeout(a.ctx, time.Second*5)
	defer cancel()

	tasks, err := a.taskRepo.GetAll(ctx)
	if err != nil {
		slog.Error("cannot create task", "error", err)
		return []model.Task{}, err
	}

	return tasks, nil
}

func (a *App) UpdateTaskStatus(id string, status string) error {
	iid, err := uuid.Parse(id)
	if err != nil {
		slog.Info("uuid", "error", err, "id", id)
		return err
	}
	ctx, cancel := context.WithTimeout(a.ctx, time.Second*5)
	defer cancel()

	err = a.taskRepo.UpdateStatus(ctx, iid, status)
	if err != nil {
		slog.Error("cannot update task", "error", err)
		return err
	}
	slog.Info("updated task", "id", id)
	return nil
}

func (a *App) DeleteTask(id string) error {
	iid, err := uuid.Parse(id)
	if err != nil {
		slog.Info("uuid", "error", err, "id", id)
		return err
	}
	ctx, cancel := context.WithTimeout(a.ctx, time.Second*5)
	defer cancel()

	err = a.taskRepo.Delete(ctx, iid)
	if err != nil {
		slog.Error("cannot delete task", "error", err)
		return err
	}
	slog.Info("deleted task", "id", id)
	return nil
}

func (a *App) GetFilteredTasks(from, to string, status string) ([]model.Task, error) {
	slog.Info("sex", "from", from, "to", to, "status", status)
	start, end := time.Unix(0, 0).UTC(), time.Now()
	if from != "" {
		start1, err := time.Parse("2006-01-02", from)
		if err != nil {
			return make([]model.Task, 0), err
		}
		start = start1
	}

	if to != "" {
		end2, err := time.Parse("2006-01-02", from)
		if err != nil {
			return make([]model.Task, 0), err
		}
		end = end2
	}
	slog.Info("sex", "start", start, "end", end, "status", status)

	return make([]model.Task, 0), nil
}
