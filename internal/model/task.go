package model

import "time"

type Task struct {
	ID        int64     `json:"id"`
	Title     string    `json:"title"`
	Body      string    `json:"body"`
	Done      bool      `json:"done"`
	CreatedAt time.Time `json:"created_at"`
}
