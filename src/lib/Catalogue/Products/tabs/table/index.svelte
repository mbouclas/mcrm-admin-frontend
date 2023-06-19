<script>
  import {
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    TableSearch,
    Checkbox,
  } from "flowbite-svelte";
  import { Pagination } from "flowbite-svelte";
  import { createEventDispatcher } from "svelte";

  export let items = [];
  export let pagination;
  export let fields;

  let searchTerm = "";

  const dispatch = createEventDispatcher();

  const generatePages = (currentPage) => {
    const itemsPerPage = pagination.limit || 10;
    const totalItems = pagination.total || 0;
    const numberOfPages = Math.ceil(totalItems / itemsPerPage);

    const startPage = Math.max(2, currentPage + 1);
    const endPage = Math.min(numberOfPages - 1, currentPage + 3);

    const between = Array.from({ length: endPage - startPage + 1 }, (_, i) => ({
      name: i + startPage,
    }));

    pages = [{ name: 1 }, ...between, { name: pagination.total }];
  };

  $: generatePages(pagination.page || 1);

  let pages = [];

  const previous = () => {
    if (pagination.page > 1) {
      pagination.page = pagination.page - 1;
      dispatch("reload", { pagination });
    }
  };
  const next = () => {
    if (pagination.page < pagination.total) {
      pagination.page = pagination.page + 1;
      dispatch("reload", { pagination });
    }
  };
  const handleClick = (e) => {
    const clickedPage = parseInt(e.target.innerHTML);
    if (pagination.page !== clickedPage) {
      pagination.page = clickedPage;
      dispatch("reload", { pagination });
    }
  };

  $: fields = [
    { varName: "checkbox", label: "Checkbox" },
    ...fields,
    { varName: "action", label: "Actions" },
  ];
</script>

<TableSearch
  placeholder="Search by maker name"
  hoverable={true}
  bind:inputValue={searchTerm}
>
  <TableHead>
    {#each fields as field}
      {#if field.varName === "checkbox"}
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
            {#if field.varName === "action"}
              <TableBodyCell
                ><a
                  href="/tables"
                  class="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Edit
                </a>
                <a
                  href="/tables"
                  class="font-medium text-red-600 hover:underline dark:text-red-500"
                >
                  Remove
                </a></TableBodyCell
              >
            {:else if field.varName === "checkbox"}
              <TableBodyCell class="!p-2 justify-content-center">
                <Checkbox />
              </TableBodyCell>
            {:else}
              <TableBodyCell
                >{typeof item[field.varName] !== "undefined"
                  ? item[field.varName]
                  : "No value"}</TableBodyCell
              >
            {/if}
          {/each}
        </TableBodyRow>
      {/each}
    {/if}
  </TableBody>
</TableSearch>

<div class="text-sm text-gray-700 dark:text-gray-400">
  Showing <span class="font-semibold text-gray-900 dark:text-white"
    >{pagination.skip}</span
  >
  to
  <span class="font-semibold text-gray-900 dark:text-white"
    >{pagination.skip + pagination.limit}</span
  >
  of
  <span class="font-semibold text-gray-900 dark:text-white"
    >{pagination.total}</span
  > Entries
</div>

<div class="flex flex-col items-center justify-center">
  <Pagination
    {pages}
    on:previous={previous}
    on:next={next}
    on:click={handleClick}
    classActive="!bg-red-500"
    table
  />
</div>
