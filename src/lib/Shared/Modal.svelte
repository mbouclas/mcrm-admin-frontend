<script>
  import { XMark } from 'svelte-heros-v2';

  export let showModal = false;
  export let className = '';
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
{#if showModal}
  <div class={`wrapper ${className}`} on:close={() => (showModal = false)}>
    <div class="bg-[#1b1f2b] text-gray-200" on:click|stopPropagation>
      {#if $$slots.header}
        <div class="flex items-center justify-between pb-6 text-3xl">
          <slot name="header" />
          <XMark class="cursor-pointer" on:click={() => (showModal = false)} />
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
  </div>
{/if}

<style>
  :global(.wrapper::-webkit-scrollbar) {
    width: 0.25rem;
  }

  :global(.wrapper::-webkit-scrollbar-track) {
    background: #323232;
  }

  :global(.wrapper::-webkit-scrollbar-thumb) {
    background-color: #b3b3b3;
  }
  .wrapper {
    position: fixed;
    z-index: 999;
    min-width: 40em;
    max-height: 900px;
    overflow-y: auto;
    border-radius: 0.3em;
    border: none;
    padding: 0;
    background: rgba(0, 0, 0, 0.3);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .wrapper::backdrop {
    background: rgba(0, 0, 0, 0.3);
  }
  .wrapper > div {
    padding: 2em;
  }
  .wrapper[open] {
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
  .wrapper[open]::backdrop {
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
</style>
