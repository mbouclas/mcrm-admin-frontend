<script lang="ts">
  import { Button, Modal } from 'flowbite-svelte';
  import ItemSelector from './item-selector.svelte';
  import type { IItemSelectorConfig } from '../types';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  export let config: IItemSelectorConfig;
  export let label = 'Select';
  let defaultModal = false;
  export let selectedItem = {};
  export let skipUuids = [];
  export let selectedItems = [];
  export let selectMode: 'single' | 'multiple' = 'single';
  export let closeOnSelect = false;
  export let onSelection: (selection: any) => void;

  function onSelect(event) {
    if (closeOnSelect) {
      defaultModal = false;
    }
    dispatch('select', event.detail);
    if (onSelection) {
      onSelection(event.detail);
    }
  }

  function onSelectMultiple(event) {
    dispatch('select', event.detail);
    if (onSelection) {
      onSelection(event.detail);
    }
  }

  function onConfirm() {
    defaultModal = false;
    dispatch('confirm');
  }
</script>

{#if !$$slots.default}
  <Button on:click={() => (defaultModal = true)}>Default modal</Button>
{:else}
  <Button on:click={() => (defaultModal = true)}><slot /></Button>
{/if}

<Modal title={label} bind:open={defaultModal}>
  <ItemSelector {selectMode} bind:skipUuids bind:selectedItem bind:selectedItems
                on:select={onSelect} on:selection={onSelectMultiple}
                {config}>

  </ItemSelector>

  <svelte:fragment slot="footer">
    {#if $$slots.footer}
      <slot name="footer" />
    {:else}
      <Button color="green" on:click={() => onConfirm()}>Select & Close</Button>
    {/if}

  </svelte:fragment>
</Modal>
