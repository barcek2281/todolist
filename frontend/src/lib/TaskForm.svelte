<script lang="ts">
  import { CreateTask } from "../../wailsjs/go/main/App";
  export let onCreated: () => void;

  let title = "";
  let body = "";
  let priority = "0";
  let deadline = "";

  async function addTask(e) {
    e.preventDefault();
    if (!title.trim()) return;

    await CreateTask({
      title: title.trim(),
      body: body.trim(),
      priority: parseInt(priority),
      deadline: deadline ? new Date(deadline).toISOString() : null,
      // convertValues: ()=>any
    });

    title = body = "";
    priority = "0";
    deadline = "";
    onCreated?.();
  }
</script>

<form class="input-box" on:submit|preventDefault={addTask}>
  <input
    class="input"
    placeholder="Task title..."
    bind:value={title}
    required
  />
  <textarea class="input" placeholder="Task description..." bind:value={body}
  ></textarea>
  <label
    >Priority:
    <select bind:value={priority}>
      <option value="0">0</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    </select>
  </label>
  <label
    >Deadline:
    <input type="datetime-local" bind:value={deadline} />
  </label>
  <button class="btn">Add Task</button>
</form>
