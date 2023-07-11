<script lang="ts">
  import { ArrowRight, ArrowLeft, Plus, Home, Trash } from 'svelte-heros-v2';

  export let tree = [];
  export let labelKey = 'title';
  export let leafKey = 'uuid';

  let currentTree = tree;
  let path = [];
  $: console.log(path);

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
</script>

<div class="text-base space-y-2">
  <div class="p-6 bg-gray-700 rounded-lg shadow-md">
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

      <button class="text-gray-500"><Plus size="35px" color="white" /></button>
    </div>

    <ul>
      {#each currentTree as leaf}
        <li class="flex items-center justify-between my-2 py-2 border-b border-gray-800">
          <button on:click={() => goToNode(leaf)} class="category text-gray-100 hover:underline text-lg"
            >{leaf[labelKey]}</button
          >
          <div class="flex items-center space-x-4">
            {#if leaf.children && leaf.children.length > 0}
              <button on:click={() => goToNode(leaf)} class="text-gray-500"><ArrowRight color="white" /></button>
            {/if}
            <button on:click={() => goToNode(leaf)} class="text-gray-500"><Trash color="white" /></button>
          </div>
        </li>
      {/each}
    </ul>
  </div>
</div>
