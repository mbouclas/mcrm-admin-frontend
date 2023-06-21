<script>
  import { Checkbox } from 'flowbite-svelte';
  import { createEventDispatcher } from 'svelte';

  export let items = [];
  export let fields;

  const dispatch = createEventDispatcher();

  const handleAction = (actionType, item) => {
    dispatch('action', { actionType, item });
  };

  $: fields = [{ varName: 'checkbox', label: 'Checkbox' }, ...fields, { varName: 'action', label: 'Actions' }];
</script>

<div class="flex flex-col w-full">
  <div class="flex">
    {#each fields as field}
      <div class="flex-1 p-2 border-b border-gray-500 text-center bg-gray-500 font-bold">
        {#if field.varName === 'checkbox'}
          <Checkbox />
        {:else}
          {field.label}
        {/if}
      </div>
    {/each}
  </div>
  {#if items && items.length}
    {#each items as item}
      <div class="flex">
        {#each fields as field}
          <div class="flex-1 p-2 border-b border-gray-500 text-center bg-gray-700">
            {#if field.varName === 'action'}
              <a
                on:click={() => handleAction('edit', item)}
                class="font-medium text-blue-600 hover:underline dark:text-blue-500"
              >
                Edit
              </a>
              <a
                on:click={() => handleAction('delete', item)}
                class="font-medium text-red-600 hover:underline dark:text-red-500"
              >
                Delete
              </a>
            {:else if field.varName === 'checkbox'}
              <Checkbox />
            {:else}
              {typeof item[field.varName] !== 'undefined' ? item[field.varName] : 'No value'}
            {/if}
          </div>
        {/each}
      </div>
    {/each}
  {/if}
</div>
