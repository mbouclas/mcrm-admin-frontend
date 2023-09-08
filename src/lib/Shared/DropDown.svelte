<script lang="ts">
  import { Dropdown, Search } from 'flowbite-svelte';

  import { ArrowDown } from 'svelte-heros-v2';

  export let values = [];
  export let value = '';

  let dropDownOpen = false;
  export let searchText = '';

  const setValue = (selectedValue) => {
    value = selectedValue;
    dropDownOpen = false;
  };
</script>

<div
  class="flex items-center justify-between mt-2 bg-gray-700 py-1 pl-2 pr-10 rounded-md py-3 cursor-pointer hover:bg-gray-600"
  on:click|preventDefault={() => (dropDownOpen = true)}
>
  <span class="text-md">{value}</span>
  <ArrowDown size="35px" />
</div>
<Dropdown bind:open={dropDownOpen} class="overflow-y-auto px-3 pb-3 text-sm h-64 z-20">
  <div slot="header" class="p-3">
    <Search size="md" bind:value={searchText} />
  </div>
  {#each values as value}
    <li on:click={() => setValue(value)} class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
      {value}
    </li>
  {/each}
</Dropdown>
