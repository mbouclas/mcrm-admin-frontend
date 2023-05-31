<script lang="ts">
  import { h } from "gridjs";
  import { useParams, useLocation, useNavigate } from "svelte-navigator";

  import Grid from "gridjs-svelte";

  export let model;
  export let field;

  let gridInstance;
  console.log(field, model);

  const navigate = useNavigate();

  $: addedValues = model[field.varName] || [];

  let doneActivate = false;
  let doneDeactivate = false;
  let doneDelete = false;

  let openFilter = false;
  let openProductEditModal = false;
  let itemId;

  let selectedRows = [];

  const firstColumns = [
    {
      name: "uuid",
      id: "uuid",
      hidden: true,
    },
  ];

  $: columns = [
    ...firstColumns,
    ...field.fields.map((fieldItem) => ({
      name: fieldItem.placeholder,
      id: fieldItem.varName,
    })),
  ];

  $: data = addedValues.map((item) => {
    // Map each field into an array in the correct column order
    return columns.map((column) => item[column.id]);
  });

  function handleRowClick(...args) {
    // console.log("row: " + JSON.stringify(args), args);
  }

  function handleCellClick(...args) {
    // console.log('cell: ' + JSON.stringify(args), args)
  }

  function log(...args) {
    // console.log(...args);
  }

  async function activateRows() {}

  async function activateRow(itemId) {}

  async function de_activateRows(selectedRows) {}
  async function de_activateRow(itemId) {}

  async function deleteItems() {}

  async function deleteItem(itemId) {}
</script>

<div class="grid-wrapper p-4 bg-[#2a3042] rounded-md text-[#a6b0cf]">
  <h1 class="mt-4 mb-2 text-lg">{field.placeholder}</h1>

  <div class="toolbar flex justify-end bg-[#517acd]">
    <div class="p-6">
      <i
        class="fa-solid fa-bars-filter text-white cursor-pointer mr-2"
        on:click={() => (openFilter = true)}
      />
      <i
        class="fa-solid fa-plus text-white cursor-pointer"
        on:click={() => navigate("/catalogue/properties/new")}
      />
      {#if Array.isArray(selectedRows) && selectedRows.length > 0}
        <i
          class="fa-solid fa-eye text-white cursor-pointer ml-6 mr-2"
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

  <Grid
    {columns}
    bind:instance={gridInstance}
    {data}
    resizable
    autoWidth
    fixedHeader
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

  td[data-column-id="propertyValue"] {
    width: 300px !important;
    max-width: 300px !important;
  }
</style>
