<script lang="ts">
  import { PageCategoryService } from '../services/pages/page-category.service';
  import SimpleTreeSelector from '../../Shared/SimpleTreeSelector.svelte';

  import { onMount } from 'svelte';
  export let model = [];

  const service = new PageCategoryService();

  let tree = [];
  let movingNode = null;

  onMount(async () => {
    tree = await service.tree();
  });

  function handleEdit(node) {
    console.log(node.uuid);
  }

  const handleMove = async (node, parentNode = null) => {
    const result = await service.move(node.uuid, parentNode?.uuid || null);
    return result;
  };

  const handleDelete = async (node, deleteType: string) => {
    const newTree = await service.deleteOne(node.uuid, deleteType);
    tree = newTree;
    return null;
  };

  const handleCreate = async (data) => {
    const newTree = await service.store(data);
    tree = newTree;
    return null;
  };

  const handleUpdate = async (uuid, data) => {
    const newTree = await service.update(uuid, data);
    tree = newTree;
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

<SimpleTreeSelector
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
