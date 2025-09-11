import './style.css';
import './app.css';

import { CreateTask, GetTasks, UpdateTaskStatus, DeleteTask } from '../wailsjs/go/main/App';

document.querySelector('#app').innerHTML = `
  <div class="app-container">
    <h1>My Todo List ✅</h1>
    
    <div class="input-box">
      <input class="input" id="taskTitle" type="text" placeholder="Task title..." autocomplete="off"/>
      <textarea class="input" id="taskBody" placeholder="Task description..."></textarea>
      <button class="btn" id="addTaskBtn">Add Task</button>
    </div>

    <div class="columns">
      <div class="column">
        <h2 style="color: black;">Not Started</h2>
        <ul id="notStartedList" class="task-list"></ul>
      </div>
      <div class="column">
        <h2 style="color: black;">In Progress</h2>
        <ul id="inProgressList" class="task-list"></ul>
      </div>
      <div class="column">
        <h2 style="color: black;">Done</h2>
        <ul id="doneList" class="task-list"></ul>
      </div>
    </div>
  </div>
`;

let taskTitle = document.getElementById("taskTitle");
let taskBody = document.getElementById("taskBody");

document.getElementById("addTaskBtn").addEventListener("click", () => {
    let title = taskTitle.value.trim();
    let body = taskBody.value.trim();
    if (title === "") return;

    CreateTask({title, body})
        .then(() => {
            taskTitle.value = "";
            taskBody.value = "";
            loadTasks();
        })
        .catch(err => console.error(err));
});

function loadTasks() {
    GetTasks()
        .then(tasks => {
            document.getElementById("notStartedList").innerHTML = "";
            document.getElementById("inProgressList").innerHTML = "";
            document.getElementById("doneList").innerHTML = "";

            tasks.forEach(task => {
                let li = document.createElement("li");
                li.className = "task-item";
                li.innerHTML = `
                  <div>
                    <strong>${task.title}</strong>
                    <p>${task.body || ""}</p>
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

                // Change status
                li.querySelector("select").addEventListener("change", (e) => {
                    UpdateTaskStatus(task.id, e.target.value)
                        .then(loadTasks)
                        .catch(err => console.error(err));
                });

                // Delete
                li.querySelector(".delete-btn").addEventListener("click", () => {
                    DeleteTask(task.id)
                        .then(loadTasks)
                        .catch(err => console.error(err));
                });

                if (task.status === "not_started") {
                    document.getElementById("notStartedList").appendChild(li);
                } else if (task.status === "in_progress") {
                    document.getElementById("inProgressList").appendChild(li);
                } else {
                    document.getElementById("doneList").appendChild(li);
                }
            });
        })
        .catch(err => console.error(err));
}

// Load on startup
loadTasks();
