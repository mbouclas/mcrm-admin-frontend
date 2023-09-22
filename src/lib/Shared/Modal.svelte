<script>
  import { XMark } from 'svelte-heros-v2';
  import { createEventDispatcher } from 'svelte';

  let dispatch = createEventDispatcher();

  export let showModal = false;
  export let className = '';
</script>

{#if showModal}
  <div
    class="wrapper"
    on:close={() => {
      showModal = false;
      dispatch('close');
    }}
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class={`modal-content bg-[#1b1f2b] text-gray-200 ${className}`} on:click|stopPropagation>
      {#if $$slots.header}
        <div class="flex items-center justify-between pb-6 text-3xl">
          <slot name="header" />
          <XMark
            class="cursor-pointer"
            on:click={() => {
              showModal = false;
              dispatch('close');
            }}
          />
        </div>
        <hr class="mt-2" />
      {/if}
      {#if $$slots.content}
        <div class="pb-6 overflow-y-auto">
          <slot name="content" />
        </div>
      {/if}
      <div>
        {#if $$slots.footer}
          <slot name="footer" />
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  ::-webkit-scrollbar {
    width: 0.25rem;
  }

  ::-webkit-scrollbar-track {
    background: #323232;
  }

  :-webkit-scrollbar-thumb {
    background-color: #b3b3b3;
  }

  .wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.3); /* Backdrop style */
    z-index: 999;
    animation: fadeIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); /* Animation for the backdrop */
  }

  .modal-content {
    border-radius: 0.3em;
    overflow-y: auto;
    padding: 2em;
    animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); /* Animation for the modal */
  }

  @keyframes zoom {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
