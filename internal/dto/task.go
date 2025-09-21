package dto

import "time"

type TaskRequest struct {
	Title    string     `json:"title"`
	Body     string     `json:"body"`
	Priority int        `json:"priority"` // 0, 1, 2, 4
	Deadline *time.Time `json:"deadline"`
}
