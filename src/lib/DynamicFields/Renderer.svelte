<script lang="ts">
  import RendererRecursive from './RendererRecursive.svelte';
  import type { IDynamicFieldConfigBlueprint } from './types';
  import { createEventDispatcher } from 'svelte';

  export let model = null;
  export let module;
  export let itemId;
  export let fields: IDynamicFieldConfigBlueprint[] = [];
  export let reloadData;

  $: rootModel = model;

  const dispatch = createEventDispatcher();
  function onModelChange(key, value) {
    dispatch('change', { key, value });
  }

  function onModelChangeItem({ value, name, action }) {
    dispatch('changeItem', { value, name, action });
  }

  function onReloadData() {
    dispatch('reloadData');
  }
</script>

<RendererRecursive
  {onModelChangeItem}
  {onModelChange}
  {onReloadData}
  {fields}
  {rootModel}
  bind:model
  module="Order"
  itemId={model?.uuid}
/>
