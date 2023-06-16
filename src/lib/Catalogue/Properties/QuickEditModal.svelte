<script>
  import { closeModal } from "svelte-modals";
  import Property from "./Property.svelte";
  import { XMark } from "svelte-heros-v2";
  // provided by <Modals />
  export let isOpen;
  export let itemId;

  $: {
    if (isOpen) {
      document.body.classList.add("lock-scroll");
    }
  }

  function close() {
    closeModal();
    document.body.classList.remove("lock-scroll");
  }
</script>

{#if isOpen}
  <div role="dialog" class="modal">
    <div class="contents">
      <div class="header">
        <h1>Quick Property Edit</h1>
        <XMark on:click={close} />
      </div>
      <div class="content-body">
        <Property {itemId} />
      </div>
      <!-- <div class="actions">
        <button on:click={closeModal}>OK</button>
      </div> -->
    </div>
  </div>
{/if}

<style>
  .modal {
    z-index: 10000;
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    /* allow click-through to backdrop */
    pointer-events: none;
  }

  .contents {
    background-color: #222736 !important;
    min-width: 240px;
    border-radius: 6px;
    padding: 16px;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    pointer-events: auto;
    width: 80vw;
  }

  h2 {
    text-align: center;
    font-size: 24px;
  }

  p {
    text-align: center;
    margin-top: 16px;
  }
  .content-body {
    max-height: 80vh;
    overflow-y: auto;
  }
  .header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #a4aabd;
    padding: 0 5px 10px;
    color: #a4aabd;
  }
  .actions {
    margin-top: 32px;
    display: flex;
    justify-content: flex-end;
  }
</style>
