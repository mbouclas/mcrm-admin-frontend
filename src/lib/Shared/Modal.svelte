<script>
  import { XMark } from 'svelte-heros-v2';

  export let showModal = false;

  let dialog;

  $: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
{#if showModal}
  <dialog bind:this={dialog} on:close={() => (showModal = false)} on:click|self={() => dialog.close()}>
    <div class="bg-[#1b1f2b] text-gray-200" on:click|stopPropagation>
      {#if $$slots.header}
        <div class="flex items-center justify-between pb-6 text-3xl">
          <slot name="header" />
          <XMark class="cursor-pointer" on:click={() => dialog.close()} />
        </div>
        <hr class="mt-2" />
      {/if}
      {#if $$slots.content}
        <div class="pb-6">
          <slot name="content" />
        </div>
      {/if}
      <div>
        {#if $$slots.footer}
          <div class="pb-6">
            <slot name="footer" />
          </div>
        {/if}
      </div>
    </div>
  </dialog>
{/if}

<style>
  dialog {
    z-index: 999;

    max-width: 70em;
    border-radius: 0.2em;
    border: none;
    padding: 0;
  }
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.3);
  }
  dialog > div {
    padding: 2em;
  }
  dialog[open] {
    animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes zoom {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1);
    }
  }
  dialog[open]::backdrop {
    animation: fade 0.2s ease-out;
  }
  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  button {
    display: block;
  }
</style>
