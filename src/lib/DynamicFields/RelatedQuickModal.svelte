<script lang="ts">
  import { closeModal } from "svelte-modals";
  import Fields from "./Renderer.svelte";

  import { XMark } from "svelte-heros-v2";
  import { Button } from "flowbite-svelte";
  // provided by <Modals />
  export let isOpen;
  export let uuid;
  export let fields;
  export let modalValue;
  export let handleModalConfirm;
  export let handleModalClose;
  export let type;

  $: {
    if (isOpen) {
      document.body.classList.add("lock-scroll");
    }
  }

  function close() {
    closeModal();
    document.body.classList.remove("lock-scroll");
    handleModalClose();
  }

  function onNativeSubmit(e) {
    e.preventDefault();
    handleModalConfirm(type);
    close();
  }
</script>

{#if isOpen}
  <div role="dialog" class="modal">
    <div class="contents">
      <div class="header">
        <h1>Quick Order Edit</h1>
        <XMark on:click={close} />
      </div>
      <div class="content-body" />

      <Fields
        {fields}
        bind:model={modalValue}
        module="Product"
        itemId={modalValue?.uuid || ""}
      />

      <Button type="submit" on:click={onNativeSubmit}>Submit</Button>
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
