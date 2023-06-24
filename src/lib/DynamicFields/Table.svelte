<script>
  import { Checkbox, Button } from 'flowbite-svelte';
  import { createEventDispatcher, onMount } from 'svelte';
  import * as Icon from 'svelte-heros-v2';

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
      <div
        class={`p-2 border-b border-gray-500 bg-gray-600 font-bold text-left flex-1
             ${field.varName === 'checkbox' ? 'flex-none w-20' : ''} 
             ${field.varName === 'action' ? 'flex-none w-40' : ''}`}
      >
        {#if field.varName === 'checkbox'}
          <Checkbox />
        {:else}
          {field.label}
        {/if}
      </div>
    {/each}
  </div>
  {#if items && items.length}
    {#each items as item, index}
      <div class={`flex even:bg-gray-700 odd:bg-gray-600 last:rounded-b-md`}>
        {#each fields as field}
          <div
            class={`p-2 text-left flex-1
             ${field.varName === 'checkbox' ? 'flex-none w-20' : ''} 
             ${field.varName === 'action' ? 'flex-none w-40' : ''}`}
          >
            <!-- svelte-ignore a11y-missing-attribute -->
            {#if field.varName === 'action'}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-missing-attribute -->
              <Button
                on:click={() => handleAction('edit', item)}
                class="font-medium bg-blue-600 text-white rounded p-2 dark:bg-blue-500"
              >
                Edit
              </Button>
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <Button
                on:click={() => handleAction('delete', item)}
                class="font-medium bg-red-600 text-white rounded p-2 dark:bg-red-500"
              >
                Delete
              </Button>
            {:else if field.varName === 'checkbox'}
              <Checkbox />
            {:else if typeof item[field.varName] !== 'undefined'}
              {#if field.varName === 'image'}
                <img src={item[field.varName]} alt={`image${index}`} width="100" height="100" />
              {:else}
                {item[field.varName]}
              {/if}
            {:else}
              <Icon.XCircle size="40" color="crimson" />
            {/if}
          </div>
        {/each}
      </div>
    {/each}
  {/if}
</div>
