<script lang="ts">
  import { ArrowsPointingOut, ArrowRight, ArrowLeft, Plus, Home, Trash } from 'svelte-heros-v2';

  export let tree = [];
  export let labelKey = 'title';
  export let leafKey = 'uuid';

  let currentTree = tree;
  let path = [];
  let movingNode = null;

  $: console.log(movingNode);

  function goToNode(node) {
    if (node.children && node.children.length > 0) {
      path = [...path, node];
      currentTree = node.children;
    }
  }

  function goToBreadcrumb(index) {
    path = path.slice(0, index + 1);
    currentTree = path.length > 0 ? path[path.length - 1].children : tree;
  }

  function startMove(node) {
    movingNode = node;
  }

  function endMove() {
    movingNode = null;
  }

  function dropIn(node) {
    // Here you should add logic to insert movingNode into node.children and remove it from its old location
    endMove();
  }

  function cancelMove() {
    movingNode = null;
  }
</script>

<div class="text-base space-y-2">
  <div class="p-6 rounded-lg shadow-md {movingNode ? 'bg-gray-400' : 'bg-gray-700'}">
    <div class="font-semibold text-xl text-gray-100 mb-4 flex justify-between items-center space-x-2">
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
          <button class="text-gray-500" on:click={cancelMove}>Cancel</button>
          <button class="text-gray-500" on:click={dropIn}>Apply</button>
        {:else}
          <button class="text-gray-500"><Plus size="35px" color="white" /></button>
        {/if}
      </div>
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
              <button on:click={() => goToNode(leaf)} class="text-gray-500"><Trash color="white" /></button>
            {/if}
          </div>
        </li>
      {/each}
    </ul>
  </div>
</div>
