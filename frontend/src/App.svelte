<script lang="ts">
  import "./style.css";
  import "./app.css";

  import {
    CreateTask,
    GetTasks,
    UpdateTaskStatus,
    DeleteTask,
    GetFilteredAndSortedTasks,
    UpdateTaskPriority,
    UpdateTask,
  } from "../wailsjs/go/main/App";
  import { onMount } from "svelte";
  import type { dto, model } from "../wailsjs/go/models";
  import Modal from "./lib/Modal.svelte";

  // reactive state
  let tasks: model.Task[] = [];

  // form fields
  let taskTitle = "";
  let taskBody = "";
  let taskPriority = "0";
  let taskDeadline = "";

  // filters
  let filterFrom = "";
  let filterTo = "";
  let filterStatus = "";

  // sort
  let sortField = "created_at";
  let sortOrder = "asc";
  let currentOrderBy = "created_at";
  let currentAsc = true;

  let showModal = false;
  let editTaskId = null; // вместо showModal

  // load all tasks
  async function loadAllTasks() {
    try {
      tasks = await GetTasks();
    } catch (err) {
      console.error(err);
    }
  }

  async function loadFilteredTasks() {
    try {
      tasks = await GetFilteredAndSortedTasks(
        filterFrom,
        filterTo,
        filterStatus,
        currentOrderBy,
        currentAsc
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function addTask(e) {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    let deadline = taskDeadline ? new Date(taskDeadline).toISOString() : null;
    try {
      let task: dto.TaskRequest = {
        title: taskTitle.trim(),
        body: taskBody.trim(),
        priority: parseInt(taskPriority, 10),
        deadline,
      };
      await CreateTask(task);
      taskTitle = "";
      taskBody = "";
      taskPriority = "0";
      taskDeadline = "";
      await loadAllTasks();
    } catch (err) {
      console.error(err);
    }
  }

  async function updateStatus(id, status) {
    try {
      await UpdateTaskStatus(id, status);
      await loadAllTasks();
    } catch (err) {
      console.error(err);
    }
  }

  async function updatePriority(id, priority) {
    try {
      await UpdateTaskPriority(id, parseInt(priority, 10));
      await loadAllTasks();
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteTask(id, title) {
    if (!confirm(`Delete task "${title}"?`)) return;
    try {
      await DeleteTask(id);
      await loadAllTasks();
    } catch (err) {
      console.error(err);
    }
  }

  function applyFilters() {
    loadFilteredTasks();
  }

  function clearFilters() {
    filterFrom = "";
    filterTo = "";
    filterStatus = "";
    currentOrderBy = "created_at";
    currentAsc = true;
    loadAllTasks();
  }

  function applySort() {
    currentOrderBy = sortField;
    currentAsc = sortOrder === "asc";
    loadFilteredTasks();
  }

  function toggleTheme() {
    document.body.classList.toggle("light");
  }

  function openEditModal(task: model.Task) {
    alert(task.id);
  }

  // on mount
  onMount(loadAllTasks);
</script>

<div class="app-container">
  <h1>My Todo List</h1>
  <button class="btn btn-cancel" on:click={toggleTheme}>Toggle Theme</button>

  <!-- Фильтры -->
  <div class="filters">
    <label>
      From:
      <input type="date" bind:value={filterFrom} />
    </label>
    <label>
      To:
      <input type="date" bind:value={filterTo} />
    </label>
    <label>
      Status:
      <select bind:value={filterStatus}>
        <option value="">All</option>
        <option value="not_started">Not Started</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
        <option value="expired">Expired Deadline</option>
      </select>
    </label>
    <button class="btn" on:click={applyFilters}>Apply</button>
    <button class="btn btn-cancel" on:click={clearFilters}>Clear</button>
  </div>

  <!-- Сортировка -->
  <div class="sort-box">
    <label>
      Sort by:
      <select bind:value={sortField}>
        <option value="created_at">Date</option>
        <option value="priority">Priority</option>
        <option value="deadline">Deadline</option>
      </select>
    </label>
    <label>
      Order:
      <select bind:value={sortOrder}>
        <option value="asc">Ascending ↑</option>
        <option value="desc">Descending ↓</option>
      </select>
    </label>
    <button class="btn" on:click={applySort}>Sort</button>
  </div>

  <!-- Добавление задачи -->
  <form class="input-box" on:submit|preventDefault={addTask}>
    <input
      class="input"
      type="text"
      placeholder="Task title..."
      bind:value={taskTitle}
      required
    />
    <textarea
      class="input"
      placeholder="Task description..."
      bind:value={taskBody}
    ></textarea>
    <label>
      Priority:
      <select bind:value={taskPriority}>
        <option value="0">0 (lowest)</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3 (highest)</option>
      </select>
    </label>
    <label>
      Deadline:
      <input type="datetime-local" bind:value={taskDeadline} />
    </label>
    <button class="btn" type="submit">Add Task</button>
  </form>

  <!-- Список задач -->
  <ul class="task-list">
    {#each tasks as task}
      <li class="task-item {task.status}">
        <div class="task-content">
          <strong class={task.status === "done" ? "done-text" : ""}
            >{task.title}</strong
          >
          <p class={task.status === "done" ? "done-text" : ""}>
            {task.body || ""}
          </p>
          <small
            >Created: {new Date(task.created_at).toLocaleDateString()}</small
          >
          {#if task.deadline}
            <small>Deadline: {new Date(task.deadline).toLocaleString()}</small>
          {/if}
        </div>
        <div class="actions">
          <label>
            Status:
            <select on:change={(e) => updateStatus(task.id, e.target.value)}>
              <option
                value="not_started"
                selected={task.status === "not_started"}>Not Started</option
              >
              <option
                value="in_progress"
                selected={task.status === "in_progress"}>In Progress</option
              >
              <option value="done" selected={task.status === "done"}
                >Done</option
              >
            </select>
          </label>
          <label>
            Priority:
            <select on:change={(e) => updatePriority(task.id, e.target.value)}>
              <option value="0" selected={task.priority === 0}>0</option>
              <option value="1" selected={task.priority === 1}>1</option>
              <option value="2" selected={task.priority === 2}>2</option>
              <option value="3" selected={task.priority === 3}>3</option>
            </select>
          </label>
          <button
            class="delete-btn"
            on:click={() => deleteTask(task.id, task.title)}>❌</button
          >
          <!-- Edit button-->
          <button
            class="edit-btn"
            on:click={() => {
              showModal = true;
              editTaskId = task.id;
            }}>✏️</button
          >
          {#if editTaskId === task.id}
            <Modal bind:showModal>
              {#snippet header()}
                <h2>Edit Task</h2>
              {/snippet}
              <form
                on:submit|preventDefault={() =>
                  UpdateTask(task.id, task.title, task.body).then(() => {
                    showModal = false;
                    editTaskId = null;
                    loadAllTasks();
                  })}
              >
                <label for="title">title</label>
                <input id="title" type="text" bind:value={task.title} />

                <label for="body">body</label>
                <input id="body" type="text" bind:value={task.body} />

                <button type="submit" class="btn">Save</button>
              </form>
            </Modal>
          {/if}
        </div>
      </li>
    {/each}
  </ul>
</div>
