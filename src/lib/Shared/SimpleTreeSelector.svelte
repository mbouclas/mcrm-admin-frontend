<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Button, Modal } from 'flowbite-svelte';
  import { ArrowsPointingOut, ArrowRight, ArrowLeft, Plus, Home, Trash } from 'svelte-heros-v2';

  enum DeleteType {
    DELETE_WITH_CHILDREN = 'DELETE_WITH_CHILDREN',
    DELETE_ONLY_SELF = 'DELETE_ONLY_SELF',
  }

  export let tree = [];
  export let labelKey = 'title';
  export let leafKey = 'uuid';
  export let handleDelete;
  export let movingNode = null;
  export let nodeToDelete = null;

  let isDeleteModalOpen = false;
  let deleteType = DeleteType.DELETE_WITH_CHILDREN;

  function deleteNode(node) {
    nodeToDelete = node;
    isDeleteModalOpen = true;
  }

  async function confirmDelete() {
    await handleDelete(nodeToDelete, deleteType);
    isDeleteModalOpen = false;
    nodeToDelete = null;
    deleteType = DeleteType.DELETE_WITH_CHILDREN; // Reset the delete type after deleting
  }

  function cancelDelete() {
    isDeleteModalOpen = false;
    nodeToDelete = null;
  }

  const dispatch = createEventDispatcher();

  $: currentTree = getCurrentTree(tree, path);

  function getCurrentTree(tree, path) {
    let tempTree = tree;
    for (let node of path) {
      const children = tempTree.find((item) => item[leafKey] === node[leafKey]).children;
      if (children) tempTree = children;
    }
    return tempTree;
  }

  let path = [];

  function goToNode(node) {
    if (node.children && node.children.length > 0) {
      path = [...path, node];
    }
  }

  function goToBreadcrumb(index) {
    path = path.slice(0, index + 1);
  }

  function startMove(node) {
    movingNode = { ...node };
  }

  function endMove() {
    movingNode = null;
  }

  async function dropIn(parent) {
    dispatch('handleMove', { node: movingNode, parent });
  }
  function dropInRoot() {
    dispatch('handleMove', { node: movingNode, parent: null });
  }
</script>

<Modal bind:open={isDeleteModalOpen} autoclose>
  <h2 class="flowbite-modal-title">Confirm Delete</h2>
  <p>Are you sure you want to delete {nodeToDelete ? nodeToDelete[labelKey] : ''}?</p>
  <div>
    <label for="delete-type">Select delete type:</label>
    <select id="delete-type" bind:value={deleteType}>
      <option value={DeleteType.DELETE_WITH_CHILDREN}>Delete with children</option>
      <option value={DeleteType.DELETE_ONLY_SELF}>Delete only this</option>
      <!-- Add more options here if you have more delete types... -->
    </select>
  </div>
  <svelte:fragment slot="footer">
    <Button on:click={confirmDelete}>Confirm</Button>
    <Button color="alternative" on:click={cancelDelete}>Cancel</Button>
  </svelte:fragment>
</Modal>

<div class="text-base space-y-2">
  <div class="p-6 rounded-lg shadow-md {movingNode ? 'bg-gray-400' : 'bg-gray-700'}">
    <div class="font-semibold text-xl text-gray-100 flex justify-between items-center space-x-2">
      <div class="flex items-center space-x-2">
        <button on:click={() => goToBreadcrumb(-1)} class="breadcrumb text-gray-100 hover:underline">
          <Home size="35px" />
        </button>

        {#each path as node, idx (node[leafKey])}
          <button on:click={() => goToBreadcrumb(idx)} class="breadcrumb text-gray-100 hover:underline"
            >{` / ${node[labelKey]}`}</button
          >
        {/each}
      </div>

      {#if movingNode}
        <div class="flex-grow text-center text-gray-300 text-lg italic">Moving: {movingNode[labelKey]}</div>
      {/if}

      <div class="flex items-center space-x-2">
        {#if movingNode}
          <button class="text-gray-500" on:click={endMove}>Cancel moving</button>
        {:else}
          <button class="text-gray-500"><Plus size="35px" color="white" /></button>
        {/if}
      </div>
    </div>

    <div class="mb-4">
      {#if movingNode}
        <button on:click={() => dropInRoot()} class="text-gray-100 text-sm font-normal">Move to root</button>
      {/if}
    </div>

    <ul class:highlighted={movingNode}>
      {#each currentTree as leaf}
        <li class="flex items-center justify-between my-2 py-2 border-b border-gray-800">
          <button on:click={() => goToNode(leaf)} class="category text-gray-100 hover:underline text-lg"
            >{leaf[labelKey]}</button
          >
          <div class="flex items-center space-x-4">
            {#if leaf.children && leaf.children.length > 0 && !(movingNode && leaf[leafKey] === movingNode[leafKey])}
              <button on:click={() => goToNode(leaf)} class="text-gray-500"><ArrowRight color="white" /></button>
            {/if}
            {#if !movingNode}
              <button on:click={() => startMove(leaf)} class="text-gray-500"><ArrowsPointingOut color="white" /></button
              >
              <button on:click={() => deleteNode(leaf)} class="text-gray-500"><Trash color="white" /></button>
            {:else if leaf[leafKey] !== movingNode[leafKey]}
              <button on:click={() => dropIn(leaf)} class="text-gray-100">Move here</button>
            {:else}
              <span class="text-gray-100">Not allowed to move here</span>
            {/if}
          </div>
        </li>
      {/each}
    </ul>
  </div>
</div>
