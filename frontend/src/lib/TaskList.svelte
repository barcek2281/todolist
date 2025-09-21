<script lang="ts">
  import TaskItem from "./TaskItem.svelte";
  import type { model } from "../../wailsjs/go/models";

  export let tasks: model.Task[] = [];
  export let reload: () => void;
</script>

<ul class="task-list">
  {#if tasks.length === 0}
    <li class="empty">No tasks yet 🚀</li>
  {:else}
    {#each tasks as task (task.id)}
      <TaskItem {task} {reload} />
    {/each}
  {/if}
</ul>

<style>
  .task-list {
    list-style: none;
    padding: 0;
    margin: 1rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .empty {
    text-align: center;
    color: #9ca3af;
    font-style: italic;
    padding: 1rem;
    border: 1px dashed #4b5563;
    border-radius: 0.5rem;
  }
</style>
