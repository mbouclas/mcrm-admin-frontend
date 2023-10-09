<script lang="ts">
  import queryString from 'query-string';
  import { useParams, useLocation, navigate } from 'mcrm-svelte-navigator';
  import { PropertiesService } from '../services/properties/properties.service';
  import { onMount } from 'svelte';

  import SortButton from '../../Shared/SortTableHeadButton.svelte';
  import { Label } from 'flowbite-svelte';
  import Loading from '../../Shared/Loading.svelte';
  import Paginator from '../../Shared/Paginator.svelte';
  import Modal from '../../Shared/Modal.svelte';
  import CustomFilters from '../../Shared/CustomFilters.svelte';

  let showModal = false;
  let searchVal = '';
  let loading = false;
  let items = {
    data: [],
  };

  const location = useLocation();
  const currentPath = $location.pathname;
  const queryParams = new URLSearchParams($location.search);

  const service = new PropertiesService();
  const params = useParams();

  let filters = {
    with: ['propertyValues'],
  };
  reset();

  let gridInstance;
  $: selectedRows = [];

  async function search() {
    items.data = [];

    loading = true;
    items = await service.find(filters);

    loading = false;
  }

  onMount(async () => {
    await search();
  });

  onMount(async () => {
    gridInstance.on('ready', () => {
      const checkboxPlugin = gridInstance.config.plugin.get('selectRow');
      checkboxPlugin.props.store.on('updated', (state) => {
        selectedRows = state.rowIds;
      });
    });
  });

  $: console.log(queryString.parse($location.search));
  $: console.log($params); // -> { id: "123", splat: "pauls-profile" }

  async function changeOrderBy(order, way) {
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
  async function reset() {
    // filters = Object.assign({}, defaultFilters);
    navigate(currentPath);
    await search();
  }

  async function searchByFilters() {
    if (searchVal.trim().length) {
      queryParams.set('q', searchVal);
      const newUrl = currentPath + '?' + queryParams.toString();
      navigate(newUrl);
      filters.q = searchVal;
    }
    await search();
    showModal = false;
  }

  async function toggleStatus(uuid: string) {
    const foundIndex = items.data.findIndex((i) => i.uuid === uuid);
    const newActive = !items.data[foundIndex].active;

    await service.update(uuid, { active: newActive });

    items.data[foundIndex].active = newActive;
  }
</script>

<Modal bind:showModal>
  <div slot="header">Filters</div>
  <div slot="content">
    <CustomFilters
      on:change={(e) => {
        filters[e.detail.key] = e.detail.value;
      }}
      bind:search={searchVal}
      filterByPrice={false}
    />
  </div>
  <div slot="footer">
    <button class="bg-blue-500 px-2 py-1 rounded" autofocus on:click={searchByFilters}>Search</button>
  </div>
</Modal>

<div class="max-w-screen-xl">
  <div class="max-w-screen-sm">
    <h2 class="mb-4 text-xl lg:text-2xl tracking-tight font-extrabold text-gray-900 dark:text-white outline-none">
      <span class="text-blue-400">{items.total}</span> Properties
    </h2>
  </div>
</div>

<div class="flex items-center space-x-4">
  <button on:click={() => navigate('/catalogue/properties/new')} class="bg-green-500 rounded p-2">Add property</button>

  <button on:click={() => (showModal = true)} class="bg-blue-500 rounded p-2">Filters</button>
  <button on:click={reset} class="bg-red-500 rounded p-2">Reset Filters</button>
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
                </div>
              </th>

              <th
                scope="col"
                class="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                <SortButton name="title" way={filters.way} activeFilter={filters.orderBy} onChange={changeOrderBy}
                  >Title</SortButton
                >
              </th>
              <th
                scope="col"
                class="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                <Label>Description</Label>
              </th>

              <th
                scope="col"
                class="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                <SortButton name="status" way={filters.way} activeFilter={filters.orderBy} onChange={changeOrderBy}
                  >Status</SortButton
                >
              </th>
              <th
                scope="col"
                class="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                <SortButton name="createdAt" way={filters.way} activeFilter={filters.orderBy} onChange={changeOrderBy}
                  >Date</SortButton
                >
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
            {#each items.data as item}
              <tr>
                <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                  <div class="inline-flex items-center gap-x-3">
                    <input
                      type="checkbox"
                      class="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
                    />
                  </div>
                </td>

                <td class="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                  <a
                    href={`/catalogue/properties/${item.uuid}`}
                    class="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    {item.title}
                  </a>
                </td>
                <td class="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                  {item.description}
                </td>

                <td class="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                  <button
                    title="Edit Order"
                    on:click={toggleStatus.bind(this, item.uuid)}
                    type="button"
                    class="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none"
                  >
                    {#if !item.active}
                      <svg
                        class="text-red-500"
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        ><path
                          fill="currentColor"
                          d="M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zM7 15c-1.66 0-3-1.34-3-3s1.34-3 3-3s3 1.34 3 3s-1.34 3-3 3z"
                        /></svg
                      >
                    {:else}
                      <svg
                        class="text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        ><path
                          fill="currentColor"
                          d="M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3s3 1.34 3 3s-1.34 3-3 3z"
                        /></svg
                      >
                    {/if}
                  </button>
                </td>
                <td class="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                  {item.createdAt}
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
    baseURL={`/catalogue/properties`}
    total={parseInt(items.total)}
    currentPage={parseInt(items.page)}
    on:pageChange={handlePageChange}
  />
</div>

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
