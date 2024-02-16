
<script lang="ts">
  import {createEventDispatcher, onMount} from 'svelte';
  import {Button, Modal, Input, Search} from 'flowbite-svelte';
  import {ArrowsPointingOut, ArrowRight, ArrowLeft, Plus, Home, Trash, PencilSquare, Bars3} from 'svelte-heros-v2';
  import ProductCategoryEdit from '../Catalogue/Products/ProductCategoryEdit.svelte';
  import PageCategoryEdit from '../Cms/Pages/PageCategoryEdit.svelte';
  import {type ISimpleTreeSelectorState, resetSimpleTreeSelectorState, simpleTreeSelectorStore} from "../stores";
  import Sortable from 'sortablejs';
  import {TreeDeleteType} from "./models/generic";
  import {SearchOutline} from "flowbite-svelte-icons";
  import {flattenTree} from "../helpers/data";
  import {filter, uniqBy} from "lodash";
  const dispatch = createEventDispatcher();



  export let tree = [];
  export let module = '';
  export let labelKey = 'title';
  export let leafKey = 'uuid';
  export let handleDelete;
  export let handleCreate;
  export let handleUpdate;
  export let allowMove = false;
  export let allowReorder = false;
  // let currentTree = [];
  export let movingNode = null;
  export let nodeToDelete = null;
  export let onMoveEnd: (evt: any) => void = null;

  let parentCategoryName = 'Root';

  let isCreateModalOpen = false;
  let isUpdateModalOpen = false;
  let categoryData: any = {};

  let isDeleteModalOpen = false;
  let deleteType = TreeDeleteType.DELETE_CHILDREN;
  let currentTree = [];
  let path = [];
  let showSearch = false,
          searchTerm = '';

  simpleTreeSelectorStore.subscribe(state => handleStateChanges(state));

  onMount(() => {
    if (allowMove) {
      addSortable();
    }
    currentTree = getCurrentTree(tree, path);
  });



  function addSortable() {
    const el = document.getElementById('tree');
    const s = new Sortable(el, {
      animation: 150,
      handle: '.handle',
      dataIdAttr: 'data-id',
      ghostClass: 'blue-background-class',
      onEnd: async function (/**Event*/ evt) {
        if (onMoveEnd) {
            onMoveEnd(evt);
        }
      }
    });
  }

  function toggleAllowMove() {
    allowMove = !allowMove;
    if (allowMove) {
      addSortable();
    }
  }

  async function deleteNode(node) {
    nodeToDelete = node;
    if (Array.isArray(node.children) && node.children.length > 0) {
      isDeleteModalOpen = true;
      return
    }

    if (!confirm(`Are you sure?`)) {
      return;
    }

    await handleDelete(nodeToDelete, TreeDeleteType.DELETE_CHILDREN);
  }

  function handleStateChanges(state: Partial<ISimpleTreeSelectorState>) {
    if (Object.keys(state).length === 0) {return;}
    switch (state.action) {
      case 'goTo': {
        goToNode(state.value);
        break;
      }
      case 'reordered' : {
        currentTree = getCurrentTree(state.value, path);
      }
      case "itemAdded": {
        currentTree = getCurrentTree(state.value, path);
      }
      case "itemRemoved": {
        currentTree = getCurrentTree(state.value, path);
      }
    }

    resetSimpleTreeSelectorState();
  }

  async function confirmDelete() {
    await handleDelete(nodeToDelete, deleteType);
    isDeleteModalOpen = false;
    nodeToDelete = null;
    deleteType = TreeDeleteType.DELETE_CHILDREN;
  }

  function cancelDelete() {
    isDeleteModalOpen = false;
    nodeToDelete = null;
  }




  function getCurrentTree(tree, path) {
    let tempTree = tree;
    for (let node of path) {
      const children = tempTree.find((item) => item[leafKey] === node[leafKey]).children;
      if (children) tempTree = children;
    }
    return tempTree;
  }



  function goToNode(node) {
    if (node.children && node.children.length > 0) {
      path = [...path, node];
    }

    currentTree = getCurrentTree(tree, path);
    dispatch('goToNode', { node, path })
  }

  function goToBreadcrumb(index) {
    path = path.slice(0, index + 1);
    currentTree = getCurrentTree(tree, path);
    dispatch('goToNode', { node: path[index], path })
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

    dispatch('openCreateModal', node)
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
    parentCategoryName = path.length ? path[path.length - 1] : 'Root';

    categoryData = node;

    isUpdateModalOpen = true;

    dispatch('openUpdateModal', { node, parentCategoryName, categoryData })
  }

  async function confirmUpdate() {
    await handleUpdate(categoryData.uuid, categoryData);
    isUpdateModalOpen = false;
    categoryData = { title: '', description: '', parentUuid: null };
  }

  function cancelUpdate() {
    isUpdateModalOpen = false;
    categoryData = { title: '', description: '', parentUuid: null };
  }

  function search() {
    if (searchTerm.length === 0 || searchTerm === '') {
        currentTree = getCurrentTree(tree, path);
        return;
    }

    const flat = flattenTree(tree);
    const res = uniqBy(filter(flat, (item) => {

      if (item[labelKey].toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
        item.highlighted = true;
        return item;
      } else {
        item.highlighted = false;
        return  null;
      }
    }), labelKey);

    currentTree = getCurrentTree(res, path);
  }

</script>

<Modal bind:open={isDeleteModalOpen}>
  <h2 class="flowbite-modal-title">Confirm Delete</h2>
  <p>Are you sure you want to delete {nodeToDelete ? nodeToDelete[labelKey] : ''}?</p>
  <div class="space-y-2">
    <p>Select delete type:</p>
    <button
      class="rounded-md block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 {deleteType ===
      TreeDeleteType.DELETE_CHILDREN
        ? 'bg-gray-300'
        : ''}"
      on:click={() => (deleteType = TreeDeleteType.DELETE_CHILDREN)}
    >
      Delete with children
    </button>
    <button
      class="rounded-md block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 {deleteType ===
      TreeDeleteType.MOVE_CHILDREN_TO_ROOT
        ? 'bg-gray-300'
        : ''}"
      on:click={() => (deleteType = TreeDeleteType.MOVE_CHILDREN_TO_ROOT)}
    >
      Delete and move children to root
    </button>
    <button
      class="rounded-md block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 {deleteType ===
      TreeDeleteType.MOVE_CHILDREN_TO_PARENT
        ? 'bg-gray-300'
        : ''}"
      on:click={() => (deleteType = TreeDeleteType.MOVE_CHILDREN_TO_PARENT)}
    >
      Delete and move children to parent
    </button>
  </div>
  <svelte:fragment slot="footer">
    <Button color="red" on:click={confirmDelete}>Confirm</Button>
    <Button color="alternative" on:click={cancelDelete}>Cancel</Button>
  </svelte:fragment>
</Modal>
{#if $$slots.createModal}

  <slot name="createModal"></slot>
{:else}
<Modal bind:open={isCreateModalOpen} size="xl">

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
    <Button color="green" on:click={confirmCreate}>Create</Button>
    <Button color="red" on:click={cancelCreate}>Cancel</Button>
  </svelte:fragment>

</Modal>
{/if}
{#if $$slots.updateModal}
  <slot name="updateModal"></slot>
  {:else}
<Modal bind:open={isUpdateModalOpen} size="xl">
  {#if module === 'page'}
    <PageCategoryEdit uuid={categoryData.uuid} on:change={(e) => (categoryData = e.detail)} />
  {/if}

  {#if module === 'product'}
    <ProductCategoryEdit uuid={categoryData.uuid} on:change={(e) => (categoryData = e.detail)} />
  {/if}

  <svelte:fragment slot="footer">
    <Button color="green" on:click={confirmUpdate}>Update</Button>
    <Button color="alternative" on:click={cancelUpdate}>Cancel</Button>
  </svelte:fragment>
</Modal>
  {/if}
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
          <button type="button" title="Find Item" on:click={() => showSearch = !showSearch}>
            <SearchOutline />
          </button>
          <button type="button" title="Re-Order List" on:click={toggleAllowMove}>
            <Bars3 size="35" />
          </button>
          <button class="text-gray-500" on:click={() => openCreateModal(path.length ? path[path.length - 1] : null)}
            ><Plus size="35px" color="white" /></button>

        {/if}
      </div>
    </div>

    <div class="mb-4">
      {#if movingNode}
        <button on:click={() => dropInRoot()} class="text-gray-100 text-sm font-normal">Move to root</button>
      {/if}
    </div>
    {#if showSearch}
<div class="my-4">
  <Search placeholder="Search" bind:value={searchTerm} on:keyup={search} on:input={search} />
</div>
      {/if}
    <ul class:highlighted={movingNode} id="tree">
      {#each currentTree as leaf}
        <li class="flex items-center justify-between my-2 py-2 border-b border-gray-800">
          <div>
          {#if allowMove}
            <button type="button" title="move image" class="image-btn handle">
              <Bars3 size="16" />
            </button>
            {/if}
          <button on:click={() => goToNode(leaf)} class="category text-gray-100 hover:underline text-lg"
            >{leaf[labelKey]}</button
          >
          </div>
          <div class="flex items-center space-x-4">
            {#if leaf.children && leaf.children.length > 0 && !(movingNode && leaf[leafKey] === movingNode[leafKey])}
              <button on:click={() => goToNode(leaf)} class="text-gray-500"><ArrowRight color="white" /></button>
            {/if}
            {#if !movingNode}
              <button on:click={() => openCreateModal(leaf)} class="text-gray-500"
                ><Plus size="35px" color="white" /></button
              >

              <button on:click={() => openUpdateModal(leaf)} class="text-gray-500" title="Edit"
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

<style>
  .blue-background-class {
    background-color: #c8ebfb;
  }

  .handle {
    cursor: grab;
  }
</style>
