<script>
  import { Modals, closeModal } from "svelte-modals";
  function close() {
    closeModal();
    document.body.classList.remove("lock-scroll");
  }
</script>

<Modals>
  <div slot="backdrop" class="backdrop" on:click={close} />
</Modals>

<style>
  .backdrop {
    z-index: 9999;
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.9);
  }
</style>
