<script lang="ts">
  import { onMount } from 'svelte';
  import type { IPagination } from '../../Shared/models/generic';
  import { ProductsService } from '../services/products/products.service';
  import SortButton from '../../Shared/SortTableHeadButton.svelte';
  import Loading from '../../Shared/Loading.svelte';
  import { formatDate } from '../../helpers/dates';
  import ItemSelectorModal from '../../DynamicFields/fields/item-selector-modal.svelte';
  import { Button } from 'flowbite-svelte';
  import { productCategoryItemSelectorConfig } from '../../Shared/item-selector-configs';
  import Paginator from '../../Shared/Paginator.svelte';
  import { moneyFormat } from '../../helpers/money';
  import Modal from '../../Shared/Modal.svelte';
  import CustomFilters from '../../Shared/CustomFilters.svelte';

  let showModal = false;

  let items = {
    data: [],
  } as IPagination<any>;
  const service = new ProductsService();
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
    items = await service.find(filters, ['category', 'variants']);

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
    />
  </div>
  <div slot="footer">
    <button class="bg-blue-500 px-2 py-1 rounded" autofocus on:click={searchByFilters}>Search</button>
  </div>
</Modal>

<div class="px-4 mx-auto max-w-screen-xl">
  <div class="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">
    <h2 class="mb-4 text-xl lg:text-2xl tracking-tight font-extrabold text-gray-900 dark:text-white">
      {items.total} Products
    </h2>
  </div>
</div>

<div class="flex items-center justify-center p-4 space-x-4">
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
                <SortButton name="sku" way={filters.way} activeFilter={filters.orderBy} onChange={changeOrderBy}
                  >SKU</SortButton
                >
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
                  config={productCategoryItemSelectorConfig}
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
                class="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                #Variants
              </th>
              <th
                scope="col"
                class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                <SortButton name="price" way={filters.way} activeFilter={filters.orderBy} onChange={changeOrderBy}
                  >Price</SortButton
                >
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
          {#each items.data as item}
            <tr>
              <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                <div class="inline-flex items-center gap-x-3">
                  <input
                    type="checkbox"
                    class="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
                  />
                  <a href={`/catalogue/products/${item.uuid}`} class="h-12 w-12">
                    <img src={item.thumb} />
                  </a>
                </div>
              </td>
              <td class="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                <a href={`/catalogue/products/${item.uuid}`} class="hover:underline">
                  {item.sku}
                </a>
              </td>
              <td class="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                <a href={`/catalogue/products/${item.uuid}`} class="hover:underline">
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
                  {#each item.productCategory as category, idx}
                    <button on:click={setFilter.bind(this, 'category', category.uuid)}>{category.title}</button>
                    {#if idx < item.productCategory.length - 1}
                      ,
                    {/if}
                  {/each}
                </div>
              </td>
              <td class="px-4 py-4 text-sm whitespace-nowrap text-center">
                {item.variants.length}
              </td>
              <td class="px-4 py-4 text-sm whitespace-nowrap text-center">
                {moneyFormat(item.price)}
              </td>
              <td class="px-4 py-4 text-sm whitespace-nowrap">
                {formatDate(item.createdAt)}
              </td>
              <td class="px-4 py-4 text-sm whitespace-nowrap">
                <div class="flex items-center gap-x-6">
                  <button
                    title="Quick Edit Item"
                    on:click={quickEditItem.bind(this, item.uuid)}
                    class="text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 hover:text-red-500 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                      ><path
                        fill="currentColor"
                        d="M14 11c0 .55-.45 1-1 1H4c-.55 0-1-.45-1-1s.45-1 1-1h9c.55 0 1 .45 1 1zM3 7c0 .55.45 1 1 1h9c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1zm7 8c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1h5c.55 0 1-.45 1-1zm8.01-2.13l.71-.71a.996.996 0 0 1 1.41 0l.71.71c.39.39.39 1.02 0 1.41l-.71.71l-2.12-2.12zm-.71.71l-5.16 5.16c-.09.09-.14.21-.14.35v1.41c0 .28.22.5.5.5h1.41c.13 0 .26-.05.35-.15l5.16-5.16l-2.12-2.11z"
                      /></svg
                    >
                  </button>
                  <button
                    title="Delete Item"
                    on:click={deleteItem.bind(this, item.uuid)}
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
