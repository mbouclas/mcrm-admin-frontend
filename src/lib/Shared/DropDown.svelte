<script lang="ts">
  import { Label, Dropdown, Search } from 'flowbite-svelte';

  import { ArrowDown } from 'svelte-heros-v2';

  export let values = [];
  export let value = '';
  export let label;
  export let errors = [];
  export let placeholder = '';

  let dropDownOpen = false;
  export let searchText = '';

  const setValue = (selectedValue) => {
    value = selectedValue;
    dropDownOpen = false;
  };

  $: filterdValues = searchText ? values.filter((value) => value.includes(searchText)) : values;
</script>

{#if label}
  <Label color={errors.length ? 'red' : 'gray'} for={label} class="block mb-2">{label}:</Label>
{/if}

<div
  class="flex items-center justify-between mt-2 bg-gray-700 py-1 pl-2 pr-10 rounded-md py-3 cursor-pointer hover:bg-gray-600"
  on:click|preventDefault={() => (dropDownOpen = true)}
>
  {#if value}
    <span class="text-md">{value}</span>
  {:else}
    <span class="text-md text-gray-400">{placeholder}</span>
  {/if}
  <ArrowDown size="20px" />
</div>
<Dropdown bind:open={dropDownOpen} class="overflow-y-auto px-3 pb-3 text-sm h-64 z-20">
  <div slot="header" class="p-3">
    <Search size="md" bind:value={searchText} />
  </div>
  {#each filterdValues as value}
    <li on:click={() => setValue(value)} class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
      {value}
    </li>
  {/each}
</Dropdown>
