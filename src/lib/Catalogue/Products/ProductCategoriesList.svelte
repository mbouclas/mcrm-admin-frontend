<script lang="ts">
  import { ProductCategoryService } from '../services/products/product-category.service';
  import SimpleTreeSelector from '../../Shared/SimpleTreeSelector.svelte';

  import { onMount } from 'svelte';
  import {simpleTreeSelectorStore} from "../../stores";
  export let model = [];

  const service = new ProductCategoryService();

  let tree = [],
  ready = false;
  let movingNode = null;

  onMount(async () => {
    await reload();
    ready = true;
  });

  async function reload() {
      tree = await service.tree();
      simpleTreeSelectorStore.update((state) => {
          state.value = tree;
          state.action = 'itemAdded';
          return state;
      });
  }

  function handleEdit(node) {
    console.log(node.uuid);
  }

  const handleMove = async (node, parentNode = null) => {
    const result = await service.move(node.uuid, parentNode?.uuid || null);
    await reload();
    return result;
  };

  const handleDelete = async (node, deleteType: string) => {
    const newTree = await service.deleteOne(node.uuid, deleteType);
    tree = newTree;
      await reload();
    return null;
  };

  const handleCreate = async (data) => {
    const newTree = await service.store(data);
    tree = newTree;
      await reload();
    return null;
  };

  const handleUpdate = async (uuid, data) => {
    const newTree = await service.update(uuid, data);
    tree = newTree;
      await reload();
    return null;
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
{#if ready}
<SimpleTreeSelector
  module="product"
  bind:tree
  on:selection={handleOnTreeViewChangeEvent}
  on:handleMove={async (e) => {
    const { node, parent } = e.detail;
    const newTree = await handleMove(node, parent);
    tree = newTree;
    movingNode = null;
  }}
  {handleCreate}
  {handleUpdate}
  {handleDelete}
  bind:movingNode
/>
    {/if}
