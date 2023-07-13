<script lang="ts">
  import { ProductCategoryService } from '../services/products/product-category.service';
  import SimpleTreeSelector from '../../Shared/SimpleTreeSelector.svelte';

  import { onMount } from 'svelte';
  export let model = [];

  const service = new ProductCategoryService();

  let tree = [];
  let movingNode = null;

  onMount(async () => {
    tree = await service.tree();
  });

  function handleEdit(node) {
    console.log(node.uuid);
  }

  function handleDelete(node) {
    console.log(node.uuid);
  }

  const handleMove = async (node, parentNode = null) => {
    const result = await service.move(node.uuid, parentNode?.uuid || null);
    return result;
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

<SimpleTreeSelector
  bind:tree
  on:selection={handleOnTreeViewChangeEvent}
  on:handleMove={async (e) => {
    const { node, parent } = e.detail;
    const newTree = await handleMove(node, parent);
    tree = newTree;
    movingNode = null;
  }}
  bind:movingNode
  {handleMove}
  bind:model
  title="Categories"
  addIdsOnly={false}
/>
