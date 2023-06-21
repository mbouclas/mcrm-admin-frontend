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
  import { createEventDispatcher } from "svelte";

  export let items = [];
  export let pagination;
  export let fields;

  let searchTerm = "";

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
      dispatch("reload", { pagination });
    }
  };
  const next = () => {
    if (pagination.page < pagination.totalPages) {
      pagination.page = pagination.page + 1;
      dispatch("reload", { pagination });
    }
  };
  const handleClick = (page) => {
    const clickedPage = page.name;
    if (pagination.page !== clickedPage) {
      pagination.page = clickedPage;
      console.log("activePageName ", activePageName);
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
  <nav aria-label="Page navigation example">
    <ul class="inline-flex -space-x-px">
      <li on:click={() => previous()}>
        <a
          href="#"
          class="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >Previous</a
        >
      </li>

      {#each pages as page}
        <li on:click={() => handleClick(page)}>
          <a
            href="#"
            class={`${
              pagination.page === page.name
                ? "dark:bg-gray-700"
                : "dark:bg-gray-800"
            } px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
            >{page.name}</a
          >
        </li>
      {/each}
      <li on:click={() => next()}>
        <a
          aria-current="page"
          href="#"
          class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >Next</a
        >
      </li>
    </ul>
  </nav>
</div>
