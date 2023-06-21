<script>
  import { TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Table, Checkbox } from 'flowbite-svelte';
  import { createEventDispatcher } from 'svelte';

  export let items = [];
  export let pagination;
  export let fields;

  let searchTerm = '';

  let activePageName = 1;
  const dispatch = createEventDispatcher();

  const generatePages = (currentPage) => {
    let between = [];

    if (currentPage !== 1 && currentPage !== pagination.totalPages) {
      between = [{ name: currentPage }];
    }

    pages = [{ name: 1 }, ...between, { name: pagination.totalPages }];
  };

  $: generatePages(pagination.page || 1);

  let pages = [];

  const previous = () => {
    if (pagination.page > 1) {
      pagination.page = pagination.page - 1;
      dispatch('reload', { pagination });
    }
  };
  const next = () => {
    if (pagination.page < pagination.totalPages) {
      pagination.page = pagination.page + 1;
      dispatch('reload', { pagination });
    }
  };
  const handleClick = (page) => {
    const clickedPage = page.name;
    if (pagination.page !== clickedPage) {
      pagination.page = clickedPage;
      dispatch('reload', { pagination });
    }
  };

  const handleAction = (actionType, item) => {
    dispatch('action', { actionType, item });
  };

  $: fields = [{ varName: 'checkbox', label: 'Checkbox' }, ...fields, { varName: 'action', label: 'Actions' }];
</script>

<Table hoverable={true} bind:inputValue={searchTerm}>
  <TableHead>
    {#each fields as field}
      {#if field.varName === 'checkbox'}
        <TableHeadCell class="!p-2 justify-content-center">
          <Checkbox />
        </TableHeadCell>
      {:else}
        <TableHeadCell>
          {field.label}
        </TableHeadCell>
      {/if}
    {/each}
  </TableHead>
  <TableBody>
    {#if items && items.length}
      {#each items as item}
        <TableBodyRow>
          {#each fields as field}
            {#if field.varName === 'action'}
              <TableBodyCell
                ><a
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
                </a></TableBodyCell
              >
            {:else if field.varName === 'checkbox'}
              <TableBodyCell class="!p-2 justify-content-center">
                <Checkbox />
              </TableBodyCell>
            {:else}
              <TableBodyCell
                >{typeof item[field.varName] !== 'undefined' ? item[field.varName] : 'No value'}</TableBodyCell
              >
            {/if}
          {/each}
        </TableBodyRow>
      {/each}
    {/if}
  </TableBody>
</Table>
