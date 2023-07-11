<script lang="ts">
  import { ArrowsPointingOut, ArrowRight, ArrowLeft, Plus, Home, Trash } from 'svelte-heros-v2';

  export let tree = [];
  export let labelKey = 'title';
  export let leafKey = 'uuid';

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
  let movingNode = null;

  function findNodeInTree(tree, targetLeafKey) {
    for (let i = 0; i < tree.length; i++) {
      if (tree[i][leafKey] === targetLeafKey) {
        return tree[i];
      } else if (tree[i].children) {
        const result = findNodeInTree(tree[i].children, targetLeafKey);
        if (result) return result;
      }
    }
    return null;
  }

  // Helper function to find a node in the tree and return its parent and index
  function findNodeAndParent(tree, nodeToFind, parent = null) {
    for (let i = 0; i < tree.length; i++) {
      if (tree[i][leafKey] === nodeToFind[leafKey]) {
        return { parent, index: i };
      } else if (tree[i].children) {
        const result = findNodeAndParent(tree[i].children, nodeToFind, tree[i]);
        if (result) return result;
      }
    }
    return null;
  }

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

  function dropIn(node) {
    const { parent } = findNodeAndParent(tree, node);

    if (parent) {
      parent.children = parent.children.filter((item) => movingNode[leafKey] !== item[leafKey]);
    } else {
      tree = tree.filter((item) => movingNode[leafKey] !== item[leafKey]);
    }

    // Find the target node in the whole tree where you want to drop the movingNode
    const targetNodeInTree = findNodeInTree(tree, node[leafKey]);

    // If targetNodeInTree doesn't have a children property, initialize it with an empty array
    targetNodeInTree.children = targetNodeInTree.children || [];

    // Add the movingNode to the targetNodeInTree's children
    targetNodeInTree.children = [...targetNodeInTree.children, movingNode];

    endMove();
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
          <button class="text-gray-500" on:click={endMove}>Cancel moving</button>
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
            {:else}
              <button on:click={() => dropIn(leaf)} class="text-gray-100">Move here</button>
            {/if}
          </div>
        </li>
      {/each}
    </ul>
  </div>
</div>
