<script>
  import queryString from "query-string";
  import { useParams, useLocation } from "svelte-navigator";
  import { ProductsService } from "../services/products/products.service";
  import { onMount } from "svelte";
  import { Checkbox, Label, Helper } from "flowbite-svelte";
  import Grid from "gridjs-svelte";
  import { h, html } from "gridjs";
  import { RowSelection } from "gridjs/plugins/selection";
  import { SvelteWrapper } from "gridjs-svelte/plugins";

  const service = new ProductsService();
  const params = useParams();
  const location = useLocation();
  const filters = {};
  let gridInstance;
  $: selectedRows = [];
  $: allRowsSelected = false;

  const server = service.getGridUrl(filters);
  const pagination = service.getGridPaginationObject();
  const search = service.getGridSearchObject();
  const sort = service.getGridSortObject(["title", "sku", "price"]);
  const columns = [
    {
      id: "selectRow",
      sort: false,
      name: h("input", {
        type: "checkbox",
        onChange: (e) => {
          allRowsSelected = e.target.checked;
          // Exceptionally hacky. There's no documented method to get the table data and do something with them
          // So we find all the checkboxes on the table and click them
          // There is of course the obvious bug where if there were selected rows, and you click on this
          // only the inverse will happen. This calls for an intermediate action, like on gmail
          gridInstance.config.tableRef.current.base
            .querySelectorAll(".gridjs-checkbox")
            .forEach((checkbox) => {
              checkbox.click();
            });
        },
      }),
      plugin: {
        // install the RowSelection plugin
        component: RowSelection,
        // RowSelection config
        props: {
          // use the "uuid" hidden column as the row identifier
          id: (row) => row.cell(1).data,
        },
      },
    },
    {
      name: "uuid",
      id: "uuid",
      hidden: true,
    },
    {
      name: "Title",
      id: "title",
    },
    {
      name: "Sku",
      id: "sku",
    },
    {
      name: "Price",
      id: "price",
    },
    {
      name: "Date",
      id: "createdAt",
      formatter: (cell) => {
        return new Date(cell).toLocaleString("el-EL", {
          month: "short",
          year: "numeric",
        });
      },
    },
    /*           {
                  name: 'Email',
                  plugin: {
                         component: SvelteWrapper,
                         props: {
                                component: Test,
                         },
                  },
           }*/
    {
      name: "Actions",
      formatter: (cell, row) => {
        return h(
          "button",
          {
            className:
              "py-2 mb-4 px-4 border rounded-md text-white bg-blue-600",
            onClick: () =>
              alert(`Editing "${row.cells[0].data}" "${row.cells[1].data}"`),
          },
          "Edit"
        );
      },
    },
  ];
  const style = {
    table: {
      "white-space": "nowrap",
    },
  };

  onMount(async () => {
    gridInstance.on("ready", () => {
      const checkboxPlugin = gridInstance.config.plugin.get("selectRow");
      checkboxPlugin.props.store.on("updated", (state) => {
        selectedRows = state.rowIds;
        console.log(selectedRows);
      });
    });
  });

  $: console.log(queryString.parse($location.search));
  $: console.log($params); // -> { id: "123", splat: "pauls-profile" }

  // Go to the service and get the products
  // We need a sidebar component to place the filters in

  function handleRowClick(...args) {
    // console.log('row: ' + JSON.stringify(args), args)
  }

  function handleCellClick(...args) {
    // console.log('cell: ' + JSON.stringify(args), args)
  }

  function log(...args) {
    // console.log(...args);
  }
</script>

<div class="grid-wrapper p-4 bg-[#2a3042] rounded-md text-[#a6b0cf]">
  <h1>Product List 12</h1>
  <Grid
    {columns}
    bind:instance={gridInstance}
    {server}
    {sort}
    {pagination}
    {search}
    {style}
    resizable
    autoWidth
    fixedHeader
    on:rowClick={handleRowClick}
    on:cellClick={handleCellClick}
    on:ready={log}
    on:beforeLoad={log}
    on:load={log}
  />
</div>

<style global>
  @import "https://cdn.jsdelivr.net/npm/gridjs/dist/theme/mermaid.min.css";
  table * {
    color: #6b7280 !important;
  }
  .gridjs-search input {
    color: #a6b0cf !important;
    background-color: #2e3446 !important;
    background-clip: padding-box !important;
    border: 1px solid #32394e !important;
    margin-top: 10px;
  }
  .gridjs-search input:focus {
    border: none;
    outline: none;
  }

  .gridjs-container {
    background-color: #2e3446 !important;
    border: 1px solid #32394e !important;
  }

  th,
  td {
    background-color: #2e3446 !important;
    border: 1px solid #32394e !important;
  }

  th[data-column-id="selectRow"] {
    text-align: center;
  }

  .gridjs-footer {
    background-color: #2e3446 !important;
    border: 1px solid #32394e !important;
  }

  .gridjs-pages button {
    background-color: #2e3446 !important;
    color: #6b7280 !important;
  }
  td[data-column-id="actions"] button {
    background-color: #101218 !important;
  }
</style>
