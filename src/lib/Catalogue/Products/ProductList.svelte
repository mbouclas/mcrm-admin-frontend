<script>
  import queryString from "query-string";
  import { useParams, useLocation, useNavigate } from "svelte-navigator";
  import { ProductsService } from "../services/products/products.service";
  import { onMount } from "svelte";
  import { Checkbox, Label, Helper } from "flowbite-svelte";
  import Grid from "gridjs-svelte";
  import { h, html } from "gridjs";
  import { RowSelection } from "gridjs/plugins/selection";
  import { SvelteWrapper } from "gridjs-svelte/plugins";
  import { ChartPie, ShoppingCart, ViewGrid, InboxIn } from "svelte-heros";
  const service = new ProductsService();
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
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
        onChange: (e) => {
          console.log(e);
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
      formatter: (cell, row) => {
        return h(
          "p",
          {
            // className:
            //   "py-2 mb-4 px-4 border rounded-md text-white bg-blue-600",
            onClick: (e) => {
              e.preventDefault();
              navigate("/catalogue/products/" + row.cells[1].data);
            },
          },
          cell
        );
      },
    },
    // {
    //   name: "Title",
    //   id: "title",
    // },
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
      sort: false,
      // formatter: (cell, row, idx) => {
      //   let el = document.querySelector(`#abc-${row.id}`);
      //   setTimeout(() => {
      //     if (el) {
      //       const element = new Button({
      //         target: el,
      //         props: { title: "edit" },
      //       });
      //     }
      //     // console.log(row.cells[1].data);
      //   });
      //   return h("div", { id: `abc-${row.id}` }, "");
      // },
      formatter: (cell, row) => {
        return h(
          "button",
          {
            className:
              "py-2 mb-4 px-4 border rounded-full text-white border-none",
            onClick: () => {
              // alert(`Editing "${row.cells[0].data}" "${row.cells[1].data}"`);
              navigate("/catalogue/products/" + row.cells[1].data);
            },
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
    // console.log("row: " + JSON.stringify(args), args);
  }

  function handleCellClick(...args) {
    // console.log('cell: ' + JSON.stringify(args), args)
  }

  function log(...args) {
    // console.log(...args);
  }
</script>

<div class="grid-wrapper p-4 bg-[#2a3042] rounded-md text-[#a6b0cf]">
  <h1 class="mt-4 mb-2 text-lg">Product List 12</h1>
  <div class="toolbar flex justify-end bg-[#517acd]">
    <div class="items flex gap-4 p-6">
      <i class="fa-solid fa-bars-filter text-white cursor-pointer" />
      <i class="fa-solid fa-message text-white cursor-pointer" />
      <i class="fa-solid fa-plus text-white cursor-pointer" />
      <i class="fa-solid fa-database text-white cursor-pointer" />
      <!-- <ChartPie color="#FFFFFF" class="cursor-pointer" />
      <ShoppingCart color="#FFFFFF" class="cursor-pointer" />
      <ViewGrid color="#FFFFFF" class="cursor-pointer" />
      <InboxIn color="#FFFFFF" class="cursor-pointer" /> -->
    </div>
  </div>
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
  td,
  th {
    color: #a6b0cf !important;
    font-size: 14px;
  }
  th {
    font-weight: 600;
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
    border-bottom: 2px solid #32394e !important;
  }
  th[data-column-id="actions"],
  td[data-column-id="actions"] {
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
    margin: auto;
    padding: 5px 15px;
    font-size: 12px;
    border: 1px solid #556ee6;
    background-color: #556ee6;
  }
  td[data-column-id="actions"] button:hover {
    background-color: #485ec4;
  }
  td[data-column-id="actions"] button:focus {
    box-shadow: 0 0 0 0.15rem rgb(111 132 234 / 50%);
  }
  .gridjs-checkbox:not(:checked) {
    background-color: #9daad1;
  }

  .gridjs-th-content input[type="checkbox"]:not(:checked) {
    background-color: #9daad1;
  }
  .gridjs-wrapper {
    border: none !important;
  }
  th.gridjs-th-fixed {
    box-shadow: none !important;
  }
  .gridjs-pagination {
    color: #6b7278 !important;
  }
  .gridjs-tr-selected td.gridjs-td {
    background-color: #2e3446e8 !important;
  }
  .gridjs-table {
    width: 100% !important;
  }
</style>
