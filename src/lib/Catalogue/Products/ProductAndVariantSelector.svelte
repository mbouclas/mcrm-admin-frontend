<script lang="ts">
  import { onMount } from 'svelte';
  import type { IPagination } from '../../Shared/models/generic';
  import { ProductsService } from '../services/products/products.service';
  import SortButton from '../../Shared/SortTableHeadButton.svelte';
  import Loading from '../../Shared/Loading.svelte';
  import Paginator from '../../Shared/Paginator.svelte';
  import { moneyFormat } from '../../helpers/money';
  import Modal from '../../Shared/Modal.svelte';
  import CustomFilters from '../../Shared/CustomFilters.svelte';
  import { navigate, useLocation } from 'mcrm-svelte-navigator';

  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let showModal = false;
  let searchVal = '';

  const location = useLocation();
  const currentPath = $location.pathname;
  const queryParams = new URLSearchParams($location.search);

  let items = {
    data: [],
  } as IPagination<any>;
  let variants = [];
  const service = new ProductsService();
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

  let selectedProduct = null;
  onMount(async () => {
    await search();
  });

  async function search() {
    items.data = [];

    loading = true;
    items = await service.find(filters, ['productCategory', 'variants']);

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
</script>

<Modal bind:showModal>
  <div slot="header">Filters</div>
  <div slot="content">
    <CustomFilters
      on:change={(e) => {
        filters[e.detail.key] = e.detail.value;
      }}
      bind:search={searchVal}
    />
  </div>
  <div slot="footer">
    <button class="bg-blue-500 px-2 py-1 rounded" autofocus on:click={searchByFilters}>Search</button>
  </div>
</Modal>

{#if variants && variants.length}<div class="max-w-screen-xl">
    <div class="max-w-screen-sm">
      <h2 class="mb-4 text-xl lg:text-2xl tracking-tight font-extrabold text-gray-900 dark:text-white outline-none">
        <span class="text-blue-400"> {items.total}</span> Variants
      </h2>
    </div>
  </div>

  <div class="flex items-center space-x-4">
    {#each appliedFilters as filter}
      <button>{filter.name}</button>
    {/each}

    <button on:click={() => (showModal = true)} class="bg-blue-500 rounded p-2">Filters</button>
    <button on:click={reset} class="bg-red-500 rounded p-2">Reset Filters</button>
  </div>

  <div class="flex flex-col mt-6">
    <div class="-my-2 overflow-x-auto">
      <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
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
                    >Name</SortButton
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
                  Action
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
            {#if variants}
              {#each variants as item}
                <tr>
                  <td class="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                    <a
                      href="#" on:click|preventDefault={() => navigate(`/catalogue/products/${item.uuid}`)}
                      class="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      {item.variantId}
                    </a>
                  </td>
                  <td class="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                    <a href="#" on:click|preventDefault={() => navigate(`/catalogue/products/${item.uuid}`)} class="hover:underline">
                      {item.name}
                    </a>
                  </td>

                  <td class="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                    <button
                      title="Edit Order"
                      type="button"
                      class="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none"
                      disabled={true}
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
                    {moneyFormat(item.price)}
                  </td>
                  <td class="px-4 py-4 text-sm whitespace-nowrap text-center">
                    <button
                      class="bg-blue-500 px-2 py-1 rounded text-white"
                      autofocus
                      on:click={() => {
                        dispatch('selectVariant', {
                          ...item,
                          variantId: item.uuid,
                          productId: selectedProduct.uuid,
                          quantity: 1,
                        });
                      }}>Select variant</button
                    >
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
  </div>{:else}
  <div class="max-w-screen-xl">
    <div class="max-w-screen-sm">
      <h2 class="mb-4 text-xl lg:text-2xl tracking-tight font-extrabold text-gray-900 dark:text-white outline-none">
        <span class="text-blue-400"> {items.total}</span> Products
      </h2>
    </div>
  </div>

  <div class="flex items-center space-x-4">
    {#each appliedFilters as filter}
      <button>{filter.name}</button>
    {/each}

    <button on:click={() => (showModal = true)} class="bg-blue-500 rounded p-2">Filters</button>
    <button on:click={reset} class="bg-red-500 rounded p-2">Reset Filters</button>
  </div>

  <div class="flex flex-col mt-6">
    <div class="-my-2 overflow-x-auto">
      <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  scope="col"
                  class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                />
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
                  Action
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
                      <a href="#" on:click|preventDefault={() => navigate(`/catalogue/products/${item.uuid}`)} class="h-12 w-12">
                        <img src={item?.thumb?.url || item?.thumb} />
                      </a>
                    </div>
                  </td>
                  <td class="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                    <a
                      href="#" on:click|preventDefault={() => navigate(`/catalogue/products/${item.uuid}`)}
                      class="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      {item.sku}
                    </a>
                  </td>
                  <td class="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                    <a href="#" on:click|preventDefault={() => navigate(`/catalogue/products/${item.uuid}`)} class="hover:underline">
                      {item.title}
                    </a>
                  </td>

                  <td class="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                    <button
                      title="Edit Order"
                      type="button"
                      class="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none"
                      disabled={true}
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
                    {item.variants.length}
                  </td>
                  <td class="px-4 py-4 text-sm whitespace-nowrap text-center">
                    {moneyFormat(item.price)}
                  </td>
                  <td class="px-4 py-4 text-sm whitespace-nowrap text-center">
                    {#if item.variants.length}
                      <button
                        class="bg-blue-700 px-2 py-1 rounded text-white"
                        autofocus
                        on:click={() => {
                          variants = [...item.variants];
                          selectedProduct = item;
                        }}>Select variants</button
                      >
                    {:else}
                      <button
                        class="bg-blue-500 px-2 py-1 rounded text-white"
                        autofocus
                        on:click={() => {
                          dispatch('selectProduct', {
                            ...item,
                            productId: item.uuid,
                            quantity: 1,
                          });
                        }}>Select product</button
                      >
                    {/if}
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
{/if}
