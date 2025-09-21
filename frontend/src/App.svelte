<script lang="ts">
  import "./style.css";
  import "./app.css";

  import {
    GetFilteredAndSortedTasks,
  } from "../wailsjs/go/main/App";
  import { onMount } from "svelte";
  import type {  model } from "../wailsjs/go/models";
  import TaskForm from "./lib/TaskForm.svelte";
  import TaskList from "./lib/TaskList.svelte";

  // reactive state
  let tasks: model.Task[] = [];

  // filters
  let filterFrom = "";
  let filterTo = "";
  let filterStatus = "";

  // sort
  let sortField = "created_at";
  let sortOrder = "asc";
  let currentOrderBy = "created_at";
  let currentAsc = true;

  // load all tasks
  async function loadAllTasks() {
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
  function applyFilters() {
    loadAllTasks();
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
    loadAllTasks();
  }

  function toggleTheme() {
    document.body.classList.toggle("light");
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
  <TaskForm onCreated={loadAllTasks}/>
  <TaskList {tasks} reload={loadAllTasks} />
  
</div>
