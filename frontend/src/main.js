import './style.css';
import './app.css';

import { CreateTask, GetTasks, UpdateTaskStatus, DeleteTask, GetFilteredAndSortedTasks, UpdateTaskPriority} from '../wailsjs/go/main/App';
document.querySelector('#app').innerHTML = `
  <div class="app-container">
    <h1>My Todo List </h1>
    <button id="toggleTheme" class="btn btn-cancel">Toggle Theme</button>
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

    <!-- Сортировка -->
    <div class="sort-box">
      <label>
        Sort by:
        <select id="sortField">
          <option value="created_at">Date</option>
          <option value="priority">Priority</option>
        </select>
      </label>
      <label>
        Order:
        <select id="sortOrder">
          <option value="asc">Ascending ↑</option>
          <option value="desc">Descending ↓</option>
        </select>
      </label>
      <button class="btn" id="applySort">Sort</button>
    </div>

    <!-- Добавление задачи -->
    <form id="taskForm" class="input-box">
      <input class="input" id="taskTitle" type="text" placeholder="Task title..." autocomplete="off" required />
      <textarea class="input" id="taskBody" placeholder="Task description..."></textarea>
      <label>
        Priority:
        <select id="taskPriority">
          <option value="0">0 (lowest)</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3 (highest)</option>
        </select>
      </label>
      <button class="btn" type="submit">Add Task</button>
    </form>

    <!-- Список задач -->
    <ul id="taskList" class="task-list"></ul>
  </div>
`;

let taskTitle = document.getElementById("taskTitle");
let taskBody = document.getElementById("taskBody");
let taskPriority = document.getElementById("taskPriority");
let taskList = document.getElementById("taskList");

let filterFrom = document.getElementById("filterFrom");
let filterTo = document.getElementById("filterTo");
let filterStatus = document.getElementById("filterStatus");

let sortField = document.getElementById("sortField");
let sortOrder = document.getElementById("sortOrder");
const toggleThemeBtn = document.getElementById("toggleTheme");

// текущее состояние сортировки
let currentOrderBy = "created_at";
let currentAsc = true;

// ----------------------
// Добавление задачи
// ----------------------
document.getElementById("taskForm").addEventListener("submit", (e) => {
    e.preventDefault();
    let title = taskTitle.value.trim();
    let body = taskBody.value.trim();
    let priority = parseInt(taskPriority.value, 10);
    if (!title) return;

    CreateTask({ title, body, priority })
        .then(() => {
            taskTitle.value = "";
            taskBody.value = "";
            taskPriority.value = "0";
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
            <small>Created: ${new Date(task.created_at).toLocaleDateString()}</small>
          </div>
          <div class="actions">
            <label>
              Status:
              <select data-id="${task.id}" class="status-select">
                <option value="not_started" ${task.status === "not_started" ? "selected" : ""}>Not Started</option>
                <option value="in_progress" ${task.status === "in_progress" ? "selected" : ""}>In Progress</option>
                <option value="done" ${task.status === "done" ? "selected" : ""}>Done</option>
              </select>
            </label>
            <label>
              Priority:
              <select data-id="${task.id}" class="priority-select">
                <option value="0" ${task.priority === 0 ? "selected" : ""}>0</option>
                <option value="1" ${task.priority === 1 ? "selected" : ""}>1</option>
                <option value="2" ${task.priority === 2 ? "selected" : ""}>2</option>
                <option value="3" ${task.priority === 3 ? "selected" : ""}>3</option>
              </select>
            </label>
            <button class="delete-btn" data-id="${task.id}">❌</button>
          </div>
        `;

        // обновление статуса
        li.querySelector(".status-select").addEventListener("change", (e) => {
            UpdateTaskStatus(task.id, e.target.value)
                .then(loadAllTasks)
                .catch(err => console.error(err));
        });

        // обновление приоритета
        li.querySelector(".priority-select").addEventListener("change", (e) => {
            let newPriority = parseInt(e.target.value, 10);
            UpdateTaskPriority(task.id, newPriority)
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
// Фильтрация + сортировка
// ----------------------
function loadFilteredTasks() {
    let from = filterFrom.value || "";
    let to = filterTo.value || "";
    let status = filterStatus.value || "";

    GetFilteredAndSortedTasks(from, to, status, currentOrderBy, currentAsc)
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
    currentOrderBy = "created_at";
    currentAsc = true;
    loadAllTasks();
});

// ----------------------
// Кнопка сортировки
// ----------------------
document.getElementById("applySort").addEventListener("click", () => {
    currentOrderBy = sortField.value;
    currentAsc = sortOrder.value === "asc";
    loadFilteredTasks();
});

toggleThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");
});

// первая загрузка
loadAllTasks();
