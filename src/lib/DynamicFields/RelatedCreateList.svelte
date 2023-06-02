<script lang="ts">
  import { v4 as uuidv4 } from "uuid";
  import { h } from "gridjs";
  import { useParams, useLocation, useNavigate } from "svelte-navigator";
  import Modals from "../Shared/Modals.svelte";
  import { RowSelection } from "gridjs/plugins/selection";

  import Grid from "gridjs-svelte";
  import RelatedCreateListAddModal from "./RelatedCreateListAddModal.svelte";
  import { openModal } from "svelte-modals";

  export let model;
  export let field;

  let gridInstance;

  const navigate = useNavigate();

  let addedValues = model[field.varName]
    ? JSON.parse(JSON.stringify(model[field.varName]))
    : [];

  $: model[field.varName] = addedValues;

  let doneActivate = false;
  let doneDeactivate = false;
  let doneDelete = false;
  $: allRowsSelected = false;

  let openFilter = false;
  let openProductEditModal = false;
  import ActionList from "./grid-actions.svelte";

  let selectedRows = [];
  let pagination = { limit: 10, enabled: true };

  const firstColumns = [
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
  ];

  const lastColumns = [
    {
      name: "Actions",
      formatter: (cell, row, idx) => {
        setTimeout(() => {
          if (
            document.querySelector(`#action-${row.id}`).children.length === 1
          ) {
            return;
          }
          const wrapperEl = document.querySelector(`#action-${row.id}`);
          const id = row.cells[1].data;
          const active = row.cells[5].data;

          // console.log(row.cells[6].data)

          const e = new ActionList({
            target: wrapperEl,
            props: { title: "edit", id, active },
          });
          e.$on("grid-action", (m) => console.log(m));
          e.$on("delete-row", (e) => deleteItem(id));
          e.$on("activate-item", (e) => activateRow(e.detail.id));
          e.$on("de-activate-item", (e) => de_activateRow(e.detail.id));
        });
        return h("div", { id: `action-${row.id}` }, "");
      },
    },
  ];

  $: columns = [
    ...firstColumns,
    ...field.fields.map((fieldItem) => ({
      name: fieldItem.placeholder,
      id: fieldItem.varName,
    })),
    ...lastColumns,
  ];

  $: data = addedValues.map((item, valueIndex) => {
    // Map each field into an array in the correct column order
    return [
      item[columns[1].id] || valueIndex,
      ...columns.slice(2, columns.length - 1).map((column, index) => {
        return item[column.id];
      }),
    ];
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

  async function deleteItem(itemId) {
    console.log(itemId, addedValues);
    addedValues = addedValues.filter((item) => item.uuid !== itemId);
  }

  const handleAddItem = (item) => {
    addedValues = [...addedValues, item];
  };

  function openAddModal() {
    openModal(RelatedCreateListAddModal, {
      uuid: uuidv4(),
      fields: field.fields,
      model,
      handleAddItem,
    });
  }
</script>

<Modals />

<div class="grid-wrappe bg-[#2a3042] rounded-md text-[#a6b0cf]">
  <div class="toolbar flex justify-between bg-[#517acd] overflow-hidden">
    <h1 class="mt-4 mb-2 text-lg justify-self-start pl-2">
      {field.placeholder}
    </h1>
    <div class="flex justify-center items-center">
      <i
        class="fa-solid fa-plus text-white cursor-pointer text-xl p-3 pr-5"
        on:click={openAddModal}
      />
      {#if Array.isArray(selectedRows) && selectedRows.length > 0}
        <i
          class="fa-solid fa-eye text-white cursor-pointer ml-6 mr-2 text-xl p-3"
          on:click={() => activateRows()}
        />
        <i
          class="fa-solid fa-eye-slash text-[#9f9f9f] cursor-pointer mr-6 texl-xl p-3"
          on:click={() => de_activateRows()}
        />
      {/if}
    </div>
  </div>
</div>

<Grid
  {columns}
  bind:instance={gridInstance}
  {data}
  {pagination}
  resizable
  autoWidth
  fixedHeader
/>

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
