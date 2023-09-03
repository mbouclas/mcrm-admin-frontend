<script lang="ts">
  import { onMount } from 'svelte';
  import type { IPagination } from '../../Shared/models/generic';
  import { PagesService } from '../services/pages/page.service';
  import SortButton from '../../Shared/SortTableHeadButton.svelte';
  import Loading from '../../Shared/Loading.svelte';
  import { formatDate } from '../../helpers/dates';
  import ItemSelectorModal from '../../DynamicFields/fields/item-selector-modal.svelte';
  import { Button } from 'flowbite-svelte';
  import { pageCategoryItemSelectorConfig } from '../../Shared/item-selector-configs';
  import Paginator from '../../Shared/Paginator.svelte';
  import Modal from '../../Shared/Modal.svelte';
  import CustomFilters from '../../Shared/CustomFilters.svelte';
  import { navigate } from 'svelte-navigator';

  let showModal = false;

  let items = {
    data: [],
  } as IPagination<any>;
  const service = new PagesService();
  const defaultFilters = {
    limit: 12,
    page: 1,
    orderBy: 'createdAt',
    way: 'desc',
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
    items = await service.find(filters, ['pageCategory']);

    loading = false;
  }

  async function reset() {
    filters = Object.assign({}, defaultFilters);
    await search();
  }

  async function changeOrderBy(order: string, way: string) {
    if (filters.orderBy === order) {
      filters.way = filters.way === 'asc' ? 'desc' : 'asc';
    }

    filters.orderBy = order;

    await search();
  }

  async function toggleStatus(uuid: string) {
    const foundIndex = items.data.findIndex((i) => i.uuid === uuid);

    items.data[foundIndex].active = !items.data[foundIndex].active;
  }

  async function deleteItem(uuid: string) {}

  async function quickEditItem(uuid: string) {}

  async function setFilter(name: string, value: any) {
    filters.page = 1;
    filters[name] = value;
    appliedFilters = [...appliedFilters, { name, value }];
    await search();
  }

  async function handlePageChange(e) {
    filters.page = e.detail;
    await search();
  }

  async function searchByFilters() {
    showModal = false;
    await search();
  }
</script>

<Modal bind:showModal>
  <div slot="header">Filters</div>
  <div slot="content">
    <CustomFilters
      on:change={(e) => {
        filters[e.detail.key] = e.detail.value;
      }}
      filterBySearch={false}
    />
  </div>
  <div slot="footer">
    <button class="bg-blue-500 px-2 py-1 rounded" autofocus on:click={searchByFilters}>Search</button>
  </div>
</Modal>

<div class="px-4 mx-auto max-w-screen-xl">
  <div class="mx-auto max-w-screen-sm text-center lg:mb-16">
    <h2 class="mb-4 text-xl lg:text-2xl tracking-tight font-extrabold text-gray-900 dark:text-white">
      {items.total} Pages
    </h2>
  </div>
</div>

<div class="flex items-center justify-center space-x-4">
  <button on:click={() => navigate('/cms/pages/new')} class="bg-green-500 rounded p-2">Add page</button>

  {#each appliedFilters as filter}
    <button>{filter.name}</button>
  {/each}

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
                <SortButton name="status" way={filters.way} activeFilter={filters.orderBy} onChange={changeOrderBy}
                  >Status</SortButton
                >
              </th>
              <th
                scope="col"
                class="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                <ItemSelectorModal
                  config={pageCategoryItemSelectorConfig}
                  on:select={(e) => setFilter('category', e.detail.uuid)}
                  closeOnSelect={true}
                  label="Select Customer"
                  selectMode="single"
                >
                  <Button
                    >Categories
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                      ><path fill="currentColor" d="M10 20v-7L2.95 4h18.1L14 13v7h-4Z" /></svg
                    >
                  </Button>
                </ItemSelectorModal>
              </th>

              <th
                scope="col"
                class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
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
          {#each items.data as item}
            <tr>
              <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                <div class="inline-flex items-center gap-x-3">
                  <input
                    type="checkbox"
                    class="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
                  />
                  <a href={`/cms/pages/${item.uuid}`} class="h-12 w-12">
                    <img src={item.thumb} />
                  </a>
                </div>
              </td>
              <td class="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                <a href={`/cms/pages/${item.uuid}`} class="hover:underline">
                  {item.title}
                </a>
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
              <td class="px-4 py-4 text-sm whitespace-nowrap text-center">
                <div class="flex items-center gap-x-6">
                  {#each item.pageCategory as category, idx}
                    <button on:click={setFilter.bind(this, 'category', category.uuid)}>{category.title}</button>
                    {#if idx < item.pageCategory.length - 1}
                      ,
                    {/if}
                  {/each}
                </div>
              </td>
              <td class="px-4 py-4 text-sm whitespace-nowrap">
                {formatDate(item.createdAt)}
              </td>
            </tr>
          {/each}
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
