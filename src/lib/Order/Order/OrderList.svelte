<script>
  import queryString from "query-string";
  import { useParams, useLocation, useNavigate } from "svelte-navigator";
  import { OrderService } from "../services/order/order.service";
  import { onMount } from "svelte";
  import ActionList from "./grid-actions.svelte";
  import Grid from "gridjs-svelte";
  import { h } from "gridjs";
  import { RowSelection } from "gridjs/plugins/selection";
  import Drawer from "svelte-drawer-component";
  import LuckyToast from "../../Shared/Toast.svelte";

  import { Confirm } from "svelte-confirm";
  import Modals from "../../Shared/Modals.svelte";

  let openFilter = false;
  let openProductEditModal = false;
  let itemId;

  const service = new OrderService();
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const filters = {
    with: ["user"],
  };
  let gridInstance;
  $: selectedRows = [];
  $: allRowsSelected = false;

  let doneActivate = false;
  let doneDeactivate = false;
  let doneDelete = false;

  function createActionsButton(data) {
    const { row, active, id } = data;
    const selector = document.querySelector(`#action-${row.id}`);
    if (!selector) {
      return;
    }

    // Avoid duplicates, grid fires more than once
    if (selector && selector.children && selector.children.length === 1) {
      return;
    }
    const wrapperEl = selector;

    const e = new ActionList({
      target: wrapperEl,
      props: { title: `edit ${id}`, id, active },
    });

    e.$on("grid-action", (m) => console.log(m));
    e.$on("delete-row", (e) => deleteItem(e.detail.id));
    e.$on("activate-item", (e) => activateRow(e.detail.id));
    e.$on("de-activate-item", (e) => de_activateRow(e.detail.id));
  }

  const server = service.getGridUrl(filters);
  const pagination = service.getGridPaginationObject();
  const search = service.getGridSearchObject();
  const sort = service.getGridSortObject([
    {
      id: "title",
      idx: 2,
    },
    {
      id: "sku",
      idx: 3,
    },
    {
      id: "price",
      idx: 4,
    },
    {
      id: "createdAt",
      idx: 5,
    },
  ]);
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
      name: "Date",
      id: "date",
      formatter: (cell) => {
        return new Date(cell).toLocaleString("el-EL", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
        });
      },
    },
    {
      name: "Order Id",
      id: "orderId",
    },
    {
      name: "Customer",
      id: "customer",
    },
    {
      name: "Status",
      id: "status",
    },
    {
      name: "Total",
      id: "total",
    },
    {
      name: "Actions",
      formatter: (cell, row, idx) => {
        const id = row.cells[1].data;
        const active = row.cells[7].data;
        createActionsButton({ row, active, id });

        return h("div", { id: `action-${row.id}` }, "");
      },
    },
  ];
  const style = {
    table: {
      "white-space": "nowrap",
    },
  };

  onMount(async () => {
    //gridInstance.on("ready", () => {
    //  const checkboxPlugin = gridInstance.config.plugin.get("selectRow");
    //  checkboxPlugin.props.store.on("updated", (state) => {
    //    selectedRows = state.rowIds;
    //    // console.log(selectedRows);
    //  });
    //});
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

  async function activateRows() {
    const res = await service.activateRows(selectedRows);
    if (res) {
      doneActivate = true;
      setTimeout(() => (doneActivate = false), 3000);
    }
  }

  async function activateRow(itemId) {
    console.log(itemId);
    const res = await service.activateRow(itemId);
    if (res) {
      doneActivate = true;
      setTimeout(() => (doneActivate = false), 3000);
    }
  }

  async function de_activateRows(selectedRows) {
    const res = await service.de_activateRows(selectedRows);
    if (res) {
      doneDeactivate = true;
      setTimeout(() => (doneDeactivate = false), 3000);
    }
  }
  async function de_activateRow(itemId) {
    console.log(itemId);
    const res = await service.de_activateRow(itemId);
    if (res) {
      doneDeactivate = true;
      setTimeout(() => (doneDeactivate = false), 3000);
    }
  }

  async function deleteItems() {
    const res = await service.deleteRows(selectedRows);
    if (res) {
      doneDelete = true;
      setTimeout(() => (doneDelete = false), 3000);
    }
  }

  async function deleteItem(itemId) {
    const res = await service.deleteRow(itemId);
    if (res) {
      doneDelete = true;
      setTimeout(() => (doneDelete = false), 3000);
    }
  }
</script>

<Modals />

<LuckyToast
  show={doneActivate}
  message="Activated successfully!"
  type="success"
/>
<LuckyToast
  show={doneDeactivate}
  message="De-activated successfully!"
  type="success"
/>
<LuckyToast show={doneDelete} message="Deleted successfully!" type="success" />

<div class="grid-wrapper p-4 bg-[#2a3042] rounded-md text-[#a6b0cf]">
  <h1 class="mt-4 mb-2 text-lg">Order List</h1>
  <div class="toolbar flex justify-end bg-[#517acd]">
    <div class="p-6">
      <i
        class="mr-2 text-white cursor-pointer fa-solid fa-bars-filter"
        on:click={() => (openFilter = true)}
      />
      <i
        class="text-white cursor-pointer fa-solid fa-plus"
        on:click={() => navigate("/orders/new")}
      />
      {#if Array.isArray(selectedRows) && selectedRows.length > 0}
        <i
          class="ml-6 mr-2 text-white cursor-pointer fa-solid fa-eye"
          on:click={() => activateRows()}
        />
        <i
          class="fa-solid fa-eye-slash text-[#9f9f9f] cursor-pointer mr-6"
          on:click={() => de_activateRows()}
        />
        <Confirm
          confirmTitle="Delete"
          cancelTitle="Cancel"
          let:confirm={confirmThis}
        >
          <i
            class="fa-solid fa-trash-can text-[#892626] cursor-pointer"
            on:click={() => confirmThis(deleteItems)}
          />
          <span slot="title"> Are you sure? </span>
          <span slot="description"> You won't be able to revert this! </span>
        </Confirm>
      {/if}
    </div>
  </div>

  <div class="grid-filter-drawer">
    <Drawer
      open={openFilter}
      size="300px"
      placement="right"
      on:clickAway={() => (openFilter = false)}
    >
      <div class=" w-full h-full bg-[#222736]">
        <div class="flex justify-between w-full p-4 text-white">
          <p>Filters</p>
          <i
            class="text-xl cursor-pointer fa-solid fa-xmark"
            on:click={() => (openFilter = false)}
          />
        </div>
        <div class="w-full">
          <input
            type="text"
            placeholder="filter"
            class="bg-[#222736] w-full grid-filter-input"
          />
        </div>
      </div>
    </Drawer>
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
  td[data-column-id="actions"] div[data-testid="tooltip"] {
    right: 0;
  }
  td[data-column-id="actions"] div[role="tooltip"] ul {
    background-color: #222736 !important;
  }
  td[data-column-id="actions"] div[role="tooltip"] ul > div {
    background-color: #2e3446 !important;
  }
  td[data-column-id="actions"] div[role="tooltip"] li > div {
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 20px;
    opacity: 0.8 !important;
  }
  td[data-column-id="actions"] div[role="tooltip"] li:hover {
    background-color: #222736 !important;
  }
  td[data-column-id="actions"] div[role="tooltip"] li > div:hover {
    opacity: 1 !important;
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
    overflow-x: hidden;
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
  .grid-filter-drawer {
    position: relative;
    overflow-x: hidden;
  }
  .grid-filter-drawer .drawer {
    position: absolute !important;
  }
  .grid-filter-drawer .drawer > div {
    position: absolute !important;
  }
  .grid-filter-input {
    outline: none;
    border: none;
    border-bottom: 1px solid #b9b9b9 !important;
    color: #b9b9b9;
  }
  .grid-filter-input:focus {
    box-shadow: none !important;
  }

  .confirm-dialog {
    position: fixed !important;
    text-align: center !important;
  }
  .confirm-dialog .actions {
    display: flex;
    justify-content: space-around;
  }
  .confirm-dialog .cancel-button:hover {
    background: none !important;
  }
</style>
