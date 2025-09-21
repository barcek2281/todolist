<script lang="ts">
  import { UpdateTaskStatus, UpdateTaskPriority, DeleteTask, UpdateTask } from "../../wailsjs/go/main/App";
  import Modal from "./Modal.svelte";
  import type { model } from "../../wailsjs/go/models";

  export let task: model.Task;
  export let reload: () => void;

  let showModal = false;

  async function saveEdit() {
    await UpdateTask(task.id, task.title, task.body);
    showModal = false;
    reload();
  }

  async function remove() {
    if (confirm(`Delete "${task.title}"?`)) {
      await DeleteTask(task.id.toString());
      reload();
    }
  }
</script>

<li class="task-item {task.status}">
  <div class="task-content">
    <strong class={task.status === "done" ? "done-text" : ""}>{task.title}</strong>
    <p class={task.status === "done" ? "done-text" : ""}>{task.body}</p>
    <small>Created: {new Date(task.created_at).toLocaleDateString()}</small>
    {#if task.deadline}
      <small>Deadline: {new Date(task.deadline).toLocaleString()}</small>
    {/if}
  </div>

  <div class="actions">
    <select on:change={(e) => UpdateTaskStatus(task.id.toString(), e.target.value).then(reload)}>
      <option value="not_started" selected={task.status === "not_started"}>Not Started</option>
      <option value="in_progress" selected={task.status === "in_progress"}>In Progress</option>
      <option value="done" selected={task.status === "done"}>Done</option>
    </select>

    <select on:change={(e) => UpdateTaskPriority(task.id.toString(), parseInt(e.target.value)).then(reload)}>
      <option value="0" selected={task.priority === 0}>0</option>
      <option value="1" selected={task.priority === 1}>1</option>
      <option value="2" selected={task.priority === 2}>2</option>
      <option value="3" selected={task.priority === 3}>3</option>
    </select>

    <button on:click={remove}>❌</button>
    <button on:click={() => showModal = true}>✏️</button>

    {#if showModal}
      <Modal bind:showModal>
        {#snippet header()}<h2>Edit Task</h2>{/snippet}
        <form on:submit|preventDefault={saveEdit}>
          <input type="text" bind:value={task.title} />
          <input type="text" bind:value={task.body} />
          <button class="btn">Save</button>
        </form>
      </Modal>
    {/if}
  </div>
</li>
