<script lang="ts">
  import { Label, Dropdown, Search } from 'flowbite-svelte';

  import { createEventDispatcher } from 'svelte';
  import { ArrowDown } from 'svelte-heros-v2';
  import ErrorMessage from './ErrorMessage.svelte';
  import { isBoolean } from 'lodash';

  const dispatch = createEventDispatcher();

  export let values = [];
  export let value = '';

  export let label;
  export let labelClass = '';
  export let errors = [];
  export let placeholder = '';

  let dropDownOpen = false;
  export let searchText = '';

  $: key = getKey(values, value);

  $: if (isBoolean(dropDownOpen)) {
    dispatch('opened', dropDownOpen);
  }

  const getKey = (values, value) => {
    if (values.length) {
      const found = values.find((item) => item.value === value);
      if (found?.key) {
        return found.key;
      }
      return '';
    }
    return '';
  };

  const setValue = (selected) => {
    value = selected.value;
    dropDownOpen = false;
  };

  $: filterdValues = searchText ? values.filter((value) => value.value.includes(searchText)) : values;
</script>

{#if label}
  <Label color={errors.length ? 'red' : 'gray'} for={label} class={`block mb-2 text-md ${labelClass}`}>{label}:</Label>
{/if}

<div
  class="flex items-center justify-between mt-2 bg-gray-700 py-1 pl-2 pr-10 rounded-md py-3 cursor-pointer hover:bg-gray-600"
  on:click|preventDefault={() => (dropDownOpen = true)}
>
  {#if value && key}
    <span class="text-md">{key}</span>
  {:else}
    <span class="text-md text-gray-400">{placeholder}</span>
  {/if}
  <ArrowDown size="20px" />
</div>
<Dropdown bind:open={dropDownOpen} class="overflow-y-auto px-3 pb-3 text-sm max-h-[600px] z-20">
  <div slot="header" class="p-3">
    <Search size="md" bind:value={searchText} />
  </div>
  {#each filterdValues as value}
    <li
      on:click={() => {
        setValue(value);
        errors = [];
      }}
      class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
    >
      {value.key}
    </li>
  {/each}
</Dropdown>
<ErrorMessage {errors} />
