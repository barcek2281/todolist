import './style.css';
import './app.css';

import logo from './assets/images/logo-universal.png';
import { CreateTask } from '../wailsjs/go/main/App';

document.querySelector('#app').innerHTML = `
  <div class="app-container">
    <h1>My Todo List ✅</h1>
    
    <div class="input-box">
      <input class="input" id="taskInput" type="text" placeholder="Enter a task..." autocomplete="off"/>
      <button class="btn" id="addTaskBtn">Add</button>
    </div>
    
    <ul id="taskList" class="task-list"></ul>
  </div>
`;


let taskInput = document.getElementById("taskInput");
let taskList = document.getElementById("taskList");

// Load tasks when app starts
// loadTasks();

// Add task
document.getElementById("addTaskBtn").addEventListener("click", () => {
    let title = taskInput.value.trim();
    if (title === "") return;

    CreateTask({title})
        .then(() => {
            taskInput.value = "";
            loadTasks();
        })
        .catch(err => console.error(err));
});

// Load tasks from backend
function loadTasks() {
    GetTasks()
        .then(tasks => {
            taskList.innerHTML = "";
            tasks.forEach(task => {
                let li = document.createElement("li");
                li.className = "task-item";
                li.innerHTML = `
                  <input type="checkbox" ${task.done ? "checked" : ""} data-id="${task.id}">
                  <span class="${task.done ? "done" : ""}">${task.title}</span>
                `;
                
                li.querySelector("input").addEventListener("change", (e) => {
                    ToggleTask(task.id)
                        .then(() => loadTasks())
                        .catch(err => console.error(err));
                });

                taskList.appendChild(li);
            });
        })
        .catch(err => console.error(err));
}
