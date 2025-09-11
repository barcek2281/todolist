import './style.css';
import './app.css';

import { CreateTask, GetTasks, UpdateTaskStatus, DeleteTask,GetFilteredTasks } from '../wailsjs/go/main/App';

document.querySelector('#app').innerHTML = `
  <div class="app-container">
    <h1>My Todo List ✅</h1>

    <!-- Фильтры -->
    <div class="filters">
      <label>
        From:
        <input type="date" id="filterFrom">
      </label>
      <label>
        To:
        <input type="date" id="filterTo">
      </label>
      <label>
        Status:
        <select id="filterStatus">
          <option value="">All</option>
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </label>
      <button class="btn" id="applyFilters">Apply</button>
      <button class="btn btn-cancel" id="clearFilters">Clear</button>
    </div>

    <!-- Добавление задачи -->
    <form id="taskForm" class="input-box">
      <input class="input" id="taskTitle" type="text" placeholder="Task title..." autocomplete="off" required />
      <textarea class="input" id="taskBody" placeholder="Task description..."></textarea>
      <button class="btn" type="submit">Add Task</button>
    </form>

    <!-- Список задач -->
    <ul id="taskList" class="task-list"></ul>
  </div>
`;

let taskTitle = document.getElementById("taskTitle");
let taskBody = document.getElementById("taskBody");
let taskList = document.getElementById("taskList");

let 

filterFrom = document.getElementById("filterFrom");
let filterTo = document.getElementById("filterTo");
let filterStatus = document.getElementById("filterStatus");

// ----------------------
// Добавление задачи
// ----------------------
document.getElementById("taskForm").addEventListener("submit", (e) => {
    e.preventDefault();
    let title = taskTitle.value.trim();
    let body = taskBody.value.trim();
    if (!title) return;

    CreateTask({ title, body })
        .then(() => {
            taskTitle.value = "";
            taskBody.value = "";
            loadAllTasks();
        })
        .catch(err => console.error(err));
});

// ----------------------
// Рендер задач
// ----------------------
function renderTasks(tasks) {
    taskList.innerHTML = "";

    tasks.forEach(task => {
        let li = document.createElement("li");
        li.className = `task-item ${task.status}`;
        li.innerHTML = `
          <div class="task-content">
            <strong class="${task.status === "done" ? "done-text" : ""}">${task.title}</strong>
            <p class="${task.status === "done" ? "done-text" : ""}">${task.body || ""}</p>
            <small>${new Date(task.created_at).toLocaleDateString()}</small>
          </div>
          <div class="actions">
            <select data-id="${task.id}">
              <option value="not_started" ${task.status === "not_started" ? "selected" : ""}>Not Started</option>
              <option value="in_progress" ${task.status === "in_progress" ? "selected" : ""}>In Progress</option>
              <option value="done" ${task.status === "done" ? "selected" : ""}>Done</option>
            </select>
            <button class="delete-btn" data-id="${task.id}">❌</button>
          </div>
        `;

        // обновление статуса
        li.querySelector("select").addEventListener("change", (e) => {
            UpdateTaskStatus(task.id, e.target.value)
                .then(loadAllTasks)
                .catch(err => console.error(err));
        });

        // удаление
        li.querySelector(".delete-btn").addEventListener("click", () => {
            if (confirm(`Удалить задачу "${task.title}"?`)) {
                DeleteTask(task.id)
                    .then(loadAllTasks)
                    .catch(err => console.error(err));
            }
        });

        taskList.appendChild(li);
    });
}

// ----------------------
// Получение всех задач
// ----------------------
function loadAllTasks() {
    GetTasks()
        .then(renderTasks)
        .catch(err => console.error(err));
}

// ----------------------
// Фильтрация с бэка
// ----------------------
function loadFilteredTasks() {
    let from = filterFrom.value || "";
    let to = filterTo.value || "";
    let status = filterStatus.value || "";

    GetFilteredTasks(from, to, status)
        .then(renderTasks)
        .catch(err => console.error(err));
}

// ----------------------
// Кнопки фильтров
// ----------------------
document.getElementById("applyFilters").addEventListener("click", loadFilteredTasks);
document.getElementById("clearFilters").addEventListener("click", () => {
    filterFrom.value = "";
    filterTo.value = "";
    filterStatus.value = "";
    loadAllTasks();
});

// первая загрузка
loadAllTasks();
