<script lang="ts">
  import { Modal, Button } from 'flowbite-svelte';

  import { createEventDispatcher } from 'svelte';
  import Table from './Table.svelte';
  import Fields from './Renderer.svelte';

  let selectedItem;
  export let model;
  export let field;
  export let onModelChangeItem;
  export let onReloadData;

  let gridInstance;

  let deleteModalOpen = false;
  let editModalOpen = false;

  let modalValue = {};
  const dispatch = createEventDispatcher();

  let selectedRows = [];
  let pagination = { limit: 10, enabled: true };

  const handleAction = (actionType, item) => {
    selectedItem = item;
    if (actionType === 'delete') {
      deleteModalOpen = true;
      editModalOpen = false;
    }

    if (actionType === 'edit') {
      editModalOpen = true;
      deleteModalOpen = false;
    }
  };

  async function deleteItem(itemId) {
    const valueIndex = model.findIndex((value) => value.uuid === itemId);
    if (valueIndex !== -1) {
      onModelChangeItem({ value: { uuid: itemId }, action: 'delete', name: field.varName });
    }
  }

  const handleModalConfirm = (type) => {
    if (type === 'add') {
      onModelChangeItem({ value: modalValue, action: type, name: field.varName });
    }
    if (type === 'edit') {
      const valueIndex = model.findIndex((value) => value.uuid === modalValue.uuid);
      if (valueIndex !== -1) {
        onModelChangeItem({ value: modalValue, action: type, name: field.varName });
      }
    }
  };

  const handleModalClose = () => {
    modalValue = {};
  };
</script>

<Modal title="Confirm delete" bind:open={deleteModalOpen} autoclose outsideclose>
  <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
    Are you sure you want to delete this variant?
  </p>
  <svelte:fragment slot="footer">
    <Button on:click={() => handleDeleteConfirm()}>Confirm</Button>
    <Button on:click={() => handleDeleteCancel()} color="alternative">Cancel</Button>
  </svelte:fragment>
</Modal>

<Modal title="Update variant" bind:open={editModalOpen} autoclose outsideclose>
  <Fields fields={field.fields} bind:model={modalValue} module="Product" itemId={modalValue?.uuid || ''} />

  <svelte:fragment slot="footer">
    <Button on:click={() => alert('Handle "success"')}>Confirm</Button>
    <Button color="alternative">Cancel</Button>
  </svelte:fragment>
</Modal>

<div class="grid-wrappe bg-[#2a3042] rounded-md text-[#a6b0cf]">
  <div class="toolbar flex justify-between bg-[#517acd] overflow-hidden">
    <h1 class="mt-4 mb-2 text-lg justify-self-start pl-2">
      {field.placeholder}
    </h1>
    <div class="flex justify-center items-center">
      <i class="fa-solid fa-plus text-white cursor-pointer text-xl p-3 pr-5" on:click={() => openQuickModal('add')} />
      {#if Array.isArray(selectedRows) && selectedRows.length > 0}
        <i class="fa-solid fa-eye text-white cursor-pointer ml-6 mr-2 text-xl p-3" on:click={() => activateRows()} />
        <i
          class="fa-solid fa-eye-slash text-[#9f9f9f] cursor-pointer mr-6 texl-xl p-3"
          on:click={() => de_activateRows()}
        />
      {/if}
    </div>
  </div>
</div>

<Table
  fields={field.fields}
  items={model}
  bind:pagination
  on:reload={(e) => onReloadData()}
  on:action={(e) => handleAction(e.detail.actionType, e.detail.item)}
/>

<style global>
  @import 'https://cdn.jsdelivr.net/npm/gridjs/dist/theme/mermaid.min.css';
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

  th[data-column-id='selectRow'] {
    text-align: center;
    border-bottom: 2px solid #32394e !important;
  }
  th[data-column-id='actions'],
  td[data-column-id='actions'] {
    text-align: center;
  }
  td[data-column-id='actions'] div[data-testid='tooltip'] {
    right: 0;
  }
  td[data-column-id='actions'] div[role='tooltip'] ul {
    background-color: #222736 !important;
  }
  td[data-column-id='actions'] div[role='tooltip'] ul > div {
    background-color: #2e3446 !important;
  }
  td[data-column-id='actions'] div[role='tooltip'] li > div {
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 20px;
    opacity: 0.8 !important;
  }
  td[data-column-id='actions'] div[role='tooltip'] li:hover {
    background-color: #222736 !important;
  }
  td[data-column-id='actions'] div[role='tooltip'] li > div:hover {
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
  td[data-column-id='actions'] button {
    margin: auto;
    padding: 5px 15px;
    font-size: 12px;
    border: 1px solid #556ee6;
    background-color: #556ee6;
  }
  td[data-column-id='actions'] button:hover {
    background-color: #485ec4;
  }
  td[data-column-id='actions'] button:focus {
    box-shadow: 0 0 0 0.15rem rgb(111 132 234 / 50%);
  }
  .gridjs-checkbox:not(:checked) {
    background-color: #9daad1;
  }

  .gridjs-th-content input[type='checkbox']:not(:checked) {
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

  td[data-column-id='propertyValue'] {
    width: 300px !important;
    max-width: 300px !important;
  }
</style>
