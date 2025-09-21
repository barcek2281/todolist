<script lang="ts">
  export let showModal: boolean;
  export let header: any;
  export let children: any;

  let dialog: HTMLDialogElement;

  $: if (showModal && dialog) {
    if (!dialog.open) dialog.showModal();
  } else if (dialog && dialog.open) {
    dialog.close();
  }
</script>

<dialog
  bind:this={dialog}
  on:close={() => (showModal = false)}
  on:click={(e) => {
    if (e.target === dialog) dialog.close();
  }}
>
  <div class="modal-content">
    <header class="modal-header">
      {@render header?.()}
      <button
        class="close-btn"
        on:click={() => dialog.close()}
        aria-label="Close"
      >
        ✖
      </button>
    </header>

    <section class="modal-body">
      {@render children?.()}
    </section>
  </div>
</dialog>

<style>
  dialog {
    border: none;
    border-radius: 1rem;
    padding: 0;
    background: transparent;
  }

  dialog::backdrop {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
  }

  .modal-content {
    background: #1e293b; /* темный фон */
    color: white;
    padding: 1.5rem;
    border-radius: 1rem;
    min-width: 320px;
    max-width: 500px;
    margin: auto;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
    animation: zoomIn 0.25s ease-out;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .modal-body {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.2rem;
    color: #fff;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .close-btn:hover {
    transform: scale(1.2);
    color: #f87171; /* красненький при hover */
  }

  @keyframes zoomIn {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>
