<script>
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    TableSearch,
  } from "flowbite-svelte";

  export let items = [];
  export let fields;

  let searchTerm = "";
</script>

<TableSearch
  placeholder="Search by maker name"
  hoverable={true}
  bind:inputValue={searchTerm}
>
  <TableHead>
    {#each fields as field}
      <TableHeadCell>{field.label}</TableHeadCell>
    {/each}
  </TableHead>
  <TableBody class="divide-y">
    {#if items && items.length}
      {#each items as item}
        <TableBodyRow>
          {#each fields as field}
            <TableBodyCell>{item[field.varName]}</TableBodyCell>
          {/each}
        </TableBodyRow>
      {/each}
    {/if}
  </TableBody>
</TableSearch>
