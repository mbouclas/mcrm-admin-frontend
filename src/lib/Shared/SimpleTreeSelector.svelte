<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Button, Modal, Input } from 'flowbite-svelte';
  import { ArrowsPointingOut, ArrowRight, ArrowLeft, Plus, Home, Trash, PencilSquare } from 'svelte-heros-v2';
  import Image from '../DynamicFields/fields/image.svelte';

  enum DeleteType {
    DELETE_CHILDREN = 'DELETE_CHILDREN',
    MOVE_CHILDREN_TO_PARENT = 'MOVE_CHILDREN_TO_PARENT',
    MOVE_CHILDREN_TO_ROOT = 'MOVE_CHILDREN_TO_ROOT',
  }

  export let tree = [];
  export let labelKey = 'title';
  export let leafKey = 'uuid';
  export let handleDelete;
  export let handleCreate;
  export let handleUpdate;

  export let movingNode = null;
  export let nodeToDelete = null;

  let parentCategoryName = 'Root';

  let isCreateModalOpen = false;
  let isUpdateModalOpen = false;
  let categoryData: any = {};

  let isDeleteModalOpen = false;
  let deleteType = DeleteType.DELETE_CHILDREN;

  function deleteNode(node) {
    nodeToDelete = node;
    isDeleteModalOpen = true;
  }

  async function confirmDelete() {
    await handleDelete(nodeToDelete, deleteType);
    isDeleteModalOpen = false;
    nodeToDelete = null;
    deleteType = DeleteType.DELETE_CHILDREN;
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

  function openCreateModal(node) {
    parentCategoryName = node ? node.title : 'Root';

    categoryData.parentUuid = node ? node.uuid : null;

    isCreateModalOpen = true;
  }

  async function confirmCreate() {
    await handleCreate(categoryData);
    isCreateModalOpen = false;
    categoryData = { title: '', description: '', parentUuid: null };
  }

  function cancelCreate() {
    isCreateModalOpen = false;
    categoryData = { title: '', description: '', parentUuid: null };
  }

  function openUpdateModal(node) {
    console.log('node', node);
    parentCategoryName = path.length ? path[path.length - 1] : 'Root';

    console.log('here');

    categoryData = node;

    isUpdateModalOpen = true;
  }

  async function confirmUpdate() {
    console.log(categoryData);
    await handleUpdate(categoryData.uuid, categoryData);
    isUpdateModalOpen = false;
    categoryData = { title: '', description: '', parentUuid: null };
  }

  function cancelUpdate() {
    isUpdateModalOpen = false;
    categoryData = { title: '', description: '', parentUuid: null };
  }
</script>

<Modal bind:open={isDeleteModalOpen}>
  <h2 class="flowbite-modal-title">Confirm Delete</h2>
  <p>Are you sure you want to delete {nodeToDelete ? nodeToDelete[labelKey] : ''}?</p>
  <div class="space-y-2">
    <p>Select delete type:</p>
    <button
      class="rounded-md block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 {deleteType ===
      DeleteType.DELETE_CHILDREN
        ? 'bg-gray-300'
        : ''}"
      on:click={() => (deleteType = DeleteType.DELETE_CHILDREN)}
    >
      Delete with children
    </button>
    <button
      class="rounded-md block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 {deleteType ===
      DeleteType.MOVE_CHILDREN_TO_ROOT
        ? 'bg-gray-300'
        : ''}"
      on:click={() => (deleteType = DeleteType.MOVE_CHILDREN_TO_ROOT)}
    >
      Delete and move children to root
    </button>
    <button
      class="rounded-md block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 {deleteType ===
      DeleteType.MOVE_CHILDREN_TO_PARENT
        ? 'bg-gray-300'
        : ''}"
      on:click={() => (deleteType = DeleteType.MOVE_CHILDREN_TO_PARENT)}
    >
      Delete and move children to parent
    </button>
  </div>
  <svelte:fragment slot="footer">
    <Button on:click={confirmDelete}>Confirm</Button>
    <Button color="alternative" on:click={cancelDelete}>Cancel</Button>
  </svelte:fragment>
</Modal>

<Modal bind:open={isCreateModalOpen}>
  <div class="p-4">
    <h2 class="flowbite-modal-title mb-4 text-xl font-bold">Create Category</h2>
    <p class="mb-4"><span>Parent Category: </span><span class="font-semibold">{parentCategoryName}</span></p>

    <div class="mb-4">
      <label for="title" class="block mb-2">Title:</label>
      <Input id="title" bind:value={categoryData.title} required class="w-full" />
    </div>

    <div class="mb-4">
      <label for="description" class="block mb-2">Description:</label>
      <Input id="description" bind:value={categoryData.description} class="w-full" />
    </div>
  </div>
  <svelte:fragment slot="footer">
    <Button on:click={confirmCreate}>Create</Button>
    <Button color="alternative" on:click={cancelCreate}>Cancel</Button>
  </svelte:fragment>
</Modal>

<Modal bind:open={isUpdateModalOpen}>
  <div class="p-4">
    <h2 class="flowbite-modal-title mb-4 text-xl font-bold">Update Category</h2>
    <p class="mb-4"><span>Parent Category: </span><span class="font-semibold">{parentCategoryName}</span></p>

    <div class="mb-4">
      <label for="title" class="block mb-2">Title:</label>
      <Input id="title" bind:value={categoryData.title} required class="w-full" />
    </div>

    <div class="mb-4">
      <label for="description" class="block mb-2">Description:</label>
      <Input id="description" bind:value={categoryData.description} class="w-full" />
    </div>

    <div class="mb-4">
      <Image
        model={categoryData?.thumb || ''}
        title="Category thumbnail"
        maxNumberOfFiles={1}
        module="ProductCategory"
        itemId={categoryData.title}
        type="main"
        on:allUploadsComplete={(e) => {
          //categoryData.thumb = e.detail;
        }}
      />
    </div>
  </div>
  <svelte:fragment slot="footer">
    <Button on:click={confirmUpdate}>Update</Button>
    <Button color="alternative" on:click={cancelUpdate}>Cancel</Button>
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
          <button class="text-gray-500" on:click={() => openCreateModal(path.length ? path[path.length - 1] : null)}
            ><Plus size="35px" color="white" /></button
          >
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
              <button on:click={() => openCreateModal(leaf)} class="text-gray-500"
                ><Plus size="35px" color="white" /></button
              >

              <button on:click={() => openUpdateModal(leaf)} class="text-gray-500"
                ><PencilSquare color="white" /></button
              >

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
