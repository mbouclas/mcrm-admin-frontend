<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from 'flowbite-svelte';
  import type { IPagination } from '../../../Shared/models/generic';
  import Toggle from '../../../Shared/Toggle.svelte';
  import { ImportTemplatesService } from '../../services/import/import-templates.service';
  import SortButton from '../../../Shared/SortTableHeadButton.svelte';
  import Loading from '../../../Shared/Loading.svelte';
  import { formatDate } from '../../../helpers/dates';
  import Paginator from '../../../Shared/Paginator.svelte';
  import Modal from '../../../Shared/Modal.svelte';
  import { navigate, useLocation } from 'mcrm-svelte-navigator';
  import Input from '../../../Shared/Input.svelte';
  import ImportTemplateFieldMaps from './ImportTemplateFieldMaps.svelte';
  import ImportTemplateSettings from './ImportTemplateSettings.svelte';

  const defaultTemplateData = {
    uuid: '',
    type: '',
    name: '',
    default: false,
    fieldMap: [],
    processor: '',
    settings: { delimiter: '' },
  };

  let importTemplateData = defaultTemplateData;
  let isImportTemplateModalOpen = false;

  let isEditImportTemplateModalOpen = false;
  let editImportTemplateIndex = null;

  let isDeleteImportTemplateModalOpen = false;

  const location = useLocation();
  const currentPath = $location.pathname;
  const queryParams = new URLSearchParams($location.search);

  let items = {
    data: [],
  } as IPagination<any>;
  const service = new ImportTemplatesService();
  const defaultFilters = {
    limit: 12,
    page: 1,
    orderBy: 'createdAt',
    way: 'desc',
    q: '',
  };
  let filters: typeof defaultFilters,
    appliedFilters = [],
    loading = false;
  reset();

  onMount(async () => {
    await search();
  });

  async function search() {
    items.data = [];

    loading = true;
    items = await service.find(filters, []);

    loading = false;
  }

  async function reset() {
    filters = Object.assign({}, defaultFilters);
    navigate(currentPath);
    await search();
  }

  async function changeOrderBy(order: string, way: string) {
    if (filters.orderBy === order) {
      filters.way = filters.way === 'asc' ? 'desc' : 'asc';
    }

    filters.orderBy = order;

    await search();
  }

  async function handlePageChange(e) {
    filters.page = e.detail;
    await search();
  }

  const confirmImportTemplateAdd = async () => {
    await service.store(importTemplateData);
    await search();
    isImportTemplateModalOpen = false;
    importTemplateData = defaultTemplateData;
  };

  const cancelImportTemplateAdd = () => {
    isImportTemplateModalOpen = false;
  };

  const confirmImportTemplateEdit = async () => {
    await service.update(importTemplateData.uuid, importTemplateData);
    await search();
    isEditImportTemplateModalOpen = false;
    importTemplateData = defaultTemplateData;
  };

  const cancelImportTemplateEdit = () => {
    isEditImportTemplateModalOpen = false;
  };

  const handleDeleteModalOpen = (item) => {
    importTemplateData = item;
    isDeleteImportTemplateModalOpen = true;
  };

  const deleteImportTemplate = async () => {
    await service.deleteRow(importTemplateData.uuid);
    isDeleteImportTemplateModalOpen = false;
    importTemplateData = defaultTemplateData;

    await search();
  };

  const cancelDeleteImportTemplate = () => {
    isDeleteImportTemplateModalOpen = false;
    importTemplateData = defaultTemplateData;
  };

  async function toggleStatus(item, value) {
    await service.update(item.uuid, { default: value });
  }
</script>

<Modal bind:showModal={isDeleteImportTemplateModalOpen}>
  <div slot="header">Confirm delete import template</div>

  <div slot="content">
    <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
      Are you sure you want to <span class="text-lg font-bold">permanently delete</span>
      import template
      <span class="text-lg font-bold">{importTemplateData.name}</span>?
    </p>
  </div>

  <div slot="footer">
    <Button on:click={() => deleteImportTemplate()}>Confirm</Button>
    <Button color="alternative" on:click={() => cancelDeleteImportTemplate()}>Cancel</Button>
  </div>
</Modal>

<Modal className="w-3/4" bind:showModal={isImportTemplateModalOpen}>
  <div slot="header">Add import template</div>

  <div slot="content">
    <div class="mb-4 mt-4">
      <Input label="Name" placeholder="Enter name" bind:value={importTemplateData.name} required />
    </div>

    <div class="mb-4">
      <Input label="Type" placeholder="Type" bind:value={importTemplateData.type} required />
    </div>

    <div class="mb-4">
      <Input label="Processor" placeholder="Processor" bind:value={importTemplateData.processor} required />
    </div>

    <div class="mb-4"><Toggle label="Default" bind:value={importTemplateData.default} /></div>

    <div class="mb-4"><ImportTemplateSettings bind:item={importTemplateData.settings} /></div>

    <ImportTemplateFieldMaps bind:items={importTemplateData.fieldMap} />
  </div>
  <svelte:fragment slot="footer">
    <Button on:click={confirmImportTemplateAdd}>Add</Button>
    <Button color="alternative" on:click={cancelImportTemplateAdd}>Cancel</Button>
  </svelte:fragment>
</Modal>

<Modal className="w-3/4" bind:showModal={isEditImportTemplateModalOpen}>
  <div slot="header">Edit import template</div>

  <div slot="content">
    <div class="mb-4 mt-4">
      <Input label="Name" placeholder="Enter name" bind:value={importTemplateData.name} required />
    </div>

    <div class="mb-4">
      <Input label="Type" placeholder="Type" bind:value={importTemplateData.type} required />
    </div>

    <div class="mb-4">
      <Input label="Processor" placeholder="Processor" bind:value={importTemplateData.processor} required />
    </div>

    <div class="mb-4"><Toggle label="Default" bind:value={importTemplateData.default} /></div>

    <div class="mb-4"><ImportTemplateSettings bind:item={importTemplateData.settings} /></div>

    <ImportTemplateFieldMaps bind:items={importTemplateData.fieldMap} />
  </div>
  <svelte:fragment slot="footer">
    <Button on:click={confirmImportTemplateEdit}>Confirm</Button>
    <Button color="alternative" on:click={cancelImportTemplateEdit}>Cancel</Button>
  </svelte:fragment>
</Modal>

<div class="max-w-screen-xl">
  <div class="max-w-screen-sm">
    <h2 class="mb-4 text-xl lg:text-2xl tracking-tight font-extrabold text-gray-900 dark:text-white outline-none">
      <span class="text-blue-400">{items.total}</span> Import templates
    </h2>
  </div>
</div>

<div class="flex items-center space-x-4">
  <button on:click={() => (isImportTemplateModalOpen = true)} class="bg-green-500 rounded p-2"
    >Add import template</button
  >
</div>

<div class="flex flex-col mt-6">
  <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
      <div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                <div class="flex items-center gap-x-3">
                  <input
                    type="checkbox"
                    class="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
                  />

                  <span>Name</span>
                </div>
              </th>

              <th
                scope="col"
                class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                <div class="flex items-center gap-x-3">
                  <span>Type</span>
                </div>
              </th>

              <th
                scope="col"
                class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                <div class="flex items-center gap-x-3">
                  <span>Processor</span>
                </div>
              </th>

              <th
                scope="col"
                class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                <div class="flex items-center gap-x-3">
                  <span>Default</span>
                </div>
              </th>

              <th
                scope="col"
                class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                <SortButton name="createdAt" way={filters.way} activeFilter={filters.orderBy} onChange={changeOrderBy}
                  >Date</SortButton
                >
              </th>

              <th scope="col" class="relative py-3.5 px-4">
                <span class="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
            {#if loading}
              <tr>
                <td colspan="10" class="text-center py-10">
                  <Loading />
                </td>
              </tr>
            {/if}
          </tbody>
          {#if items.data}
            {#each items.data as item, index}
              <tr>
                <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                  <div class="inline-flex items-center gap-x-3">
                    <input
                      type="checkbox"
                      class="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
                    />

                    <span>
                      {item.name}
                    </span>
                  </div>
                </td>

                <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                  <div class="inline-flex items-center gap-x-3">
                    <span>
                      {item.type}
                    </span>
                  </div>
                </td>

                <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                  <div class="inline-flex items-center gap-x-3">
                    <span>
                      {item.processor}
                    </span>
                  </div>
                </td>

                <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                  <div class="inline-flex items-center gap-x-3">
                    <Toggle on:change={(e) => toggleStatus(item, e.detail.value)} bind:value={item.default} />
                  </div>
                </td>

                <td class="px-4 py-4 text-sm whitespace-nowrap">
                  {formatDate(item.createdAt)}
                </td>

                <td class="px-4 py-4 text-sm whitespace-nowrap">
                  <div class="flex items-center gap-x-6">
                    <button
                      title="Edit Rule"
                      on:click={() => {
                        isEditImportTemplateModalOpen = true;
                        importTemplateData = item;
                        editImportTemplateIndex = index;
                      }}
                      type="button"
                      class="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                    </button>

                    <button
                      title="Delete Rule"
                      on:click|preventDefault={() => {
                        handleDeleteModalOpen(item);
                      }}
                      class="text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 hover:text-red-500 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          {/if}
        </table>
      </div>
    </div>
  </div>

  <Paginator
    totalPages={parseInt(items.pages)}
    baseURL={`/orders`}
    total={parseInt(items.total)}
    currentPage={parseInt(items.page)}
    on:pageChange={handlePageChange}
  />
</div>
