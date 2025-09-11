package main

import (
	"context"
	"fmt"
	"time"
	"wailstest/internal/adapter/db"
	"wailstest/internal/config"
	"wailstest/internal/model"
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
	return a.taskRepo.Create(ctx, task)
}
