<script lang="ts">
  import { ProductCategoryService } from '../services/products/product-category.service';
  import SimpleTreeSelector from '../../Shared/SimpleTreeSelector.svelte';

  import { onMount } from 'svelte';
  import { Button, Dropdown, DropdownDivider, DropdownItem } from 'flowbite-svelte';
  import { ChevronDown } from 'svelte-heros-v2';

  export let model = [];

  const service = new ProductCategoryService();

  const promise = service.tree();
  onMount(async () => {});

  function handleEdit(node) {
    console.log(node.uuid);
  }

  function handleDelete(node) {
    console.log(node.uuid);
  }

  const handleMove = async (node, parentNode = null) => {
    await service.move(node.uuid, parentNode?.uuid || null);
    console.log(node.uuid);
  };

  function handleNewAfter(node) {
    console.log(node.uuid);
  }

  function handleNewBefore(node) {
    console.log(node.uuid);
  }

  function handleNewSubCategory(node) {
    console.log(node.uuid);
  }

  function handleOnTreeViewChangeEvent(e) {
    const { type, node } = e.detail;
    console.log(type, node.uuid);
  }
</script>

{#await promise then tree}
  <SimpleTreeSelector
    {tree}
    on:selection={handleOnTreeViewChangeEvent}
    {handleMove}
    bind:model
    title="Categories"
    addIdsOnly={false}
  />
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
