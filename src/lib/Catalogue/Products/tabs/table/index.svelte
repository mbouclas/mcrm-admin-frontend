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

  export let items = [];
  export let pagination;
  export let fields;

  let searchTerm = "";

  import { Pagination } from "flowbite-svelte";

  const generatePages = (currentPage) => {
    const itemsPerPage = pagination.limit || 10;
    const totalItems = pagination.total || 0;
    const numberOfPages = Math.ceil(totalItems / itemsPerPage);

    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(numberOfPages, currentPage + 3);

    console.log(startPage, endPage);
    pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => ({
      name: i + startPage,
    }));
  };

  $: generatePages(pagination.page || 1);

  let pages = [];

  const previous = () => {
    alert("Previous btn clicked. Make a call to your server to fetch data.");
  };
  const next = () => {
    alert("Next btn clicked. Make a call to your server to fetch data.");
  };
  const handleClick = (e) => {
    const clickedPage = parseInt(e.target.innerHTML);
    pagination.page = clickedPage;
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
    >{pagination.limit}</span
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
  >
    <div class="flex items-center gap-2">
      <svg
        class="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        ><path
          fill-rule="evenodd"
          d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
          clip-rule="evenodd"
        /></svg
      >
      Prev
    </div>
    <div class="flex items-center gap-2">
      Next
      <svg
        class="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        ><path
          fill-rule="evenodd"
          d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
          clip-rule="evenodd"
        /></svg
      >
    </div>
  </Pagination>
</div>
