<script lang="ts">
  import { onMount } from 'svelte';
  import { OrderService } from '../services/order/order.service';
  import { app } from '../../stores';
  import { moneyFormat } from '../../helpers/money';
  import { formatDate } from '../../helpers/dates';
  import Paginator from '../../Shared/Paginator.svelte';
  import SortButton from '../../Shared/SortTableHeadButton.svelte';
  import Loading from '../../Shared/Loading.svelte';
  import ItemSelectorModal from '../../DynamicFields/fields/item-selector-modal.svelte';
  import FiltersBar from './filters-bar.svelte';

  import {
    Button,
    Table,
    TableBody, TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell
  } from 'flowbite-svelte';
  import { customerItemSelectorConfig } from '../../Shared/item-selector-configs';
  import Modal from '../../Shared/Modal.svelte';
  import CustomFilters from '../../Shared/CustomFilters.svelte';
  import { navigate } from 'mcrm-svelte-navigator';
  import {Plus} from "svelte-heros-v2";


  let dropdownOpen = false;

  const service = new OrderService();
  let orders = {
      page: 1,
      data: [],
      total: 0,
    },
    loading = false;
  const defaultFilters = {
    limit: 12,
    page: 1,
    orderBy: 'createdAt',
    way: 'desc',
  };
  let filters: typeof defaultFilters;
  reset();

  let statuses = [];
  const statusFiltersShown = [1, 2, 3, 7];
  const customerSelectorConfig = customerItemSelectorConfig;

  let showModal = false;

  app.subscribe((state) => {
    statuses = state.configs.store.orderStatuses;
  });

  onMount(async () => {
    await search();
  });

  async function search() {
    orders.data = [];

    loading = true;
    orders = await service.find(filters, ['*']);
    loading = false;
  }

  function getStatus(id: number) {
    return statuses.find((s) => s.id === id);
  }

  async function handlePageChange(e) {
    filters.page = e.detail;
    await search();
  }

  async function viewOrder(uuid: number) {
    // await service.edit(id);
  }

  async function changeStatus(uuid: number) {
    // await service.edit(id);
  }

  async function editOrder(uuid: number) {
    // await service.edit(id);
  }

  async function deleteOrder(uuid: number) {
    // await service.edit(id);
  }

  async function changeOrderBy(order: string, way: string) {
    if (filters.orderBy === order) {
      filters.way = filters.way === 'asc' ? 'desc' : 'asc';
    }

    filters.orderBy = order;

    await search();
  }

  async function setFilter(name: string, value: any) {
    filters.page = 1;
    filters[name] = value;
    await search();
  }

  async function reset() {
    filters = Object.assign({}, defaultFilters);
    await search();
  }
  async function searchByFilters() {
    showModal = false;
    await search();
  }

  async function applyFilters() {
    await search();
  }

  async function clearFilters() {
    await reset();
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

<div class="max-w-screen-xl">
  <div class="max-w-screen-sm">
    <h2 class="mb-4 text-xl lg:text-2xl tracking-tight font-extrabold text-gray-900 dark:text-white outline-none">
      <span class="text-blue-400">{orders.total}</span> Orders
    </h2>
  </div>
</div>
<div class="flex items-center space-x-4">

  <Button on:click={() => navigate('/orders/new')} class="bg-green-500 rounded p-2">
    <Plus /></Button>
  <FiltersBar bind:filters={filters} on:filter={applyFilters} on:clear={clearFilters} />
</div>
<div
  class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 overflow-y-hidden overflow-x-auto"
>
  <ul class="flex space-x-4 items-center -mb-px w-full">
    <li>
      <a
        href="#"
        on:click|preventDefault={setFilter.bind(this, 'status', undefined)}
        class:border-blue-700={typeof filters.status === 'undefined' || !filters.status}
        class:text-blue-600={typeof filters.status === 'undefined' || !filters.status}
        class:border-transparent={filters.status}
        class="inline-block p-4 border-b-2 rounded-t-lg hover:text-blue-600 hover:border-blue-700">All</a
      >
    </li>
    {#each statuses.filter((s) => statusFiltersShown.includes(s.id)) as status}
      <li>
        <a
          href="#"
          on:click|preventDefault={setFilter.bind(this, 'status', status.id)}
          class:border-blue-700={filters.status === status.id}
          class:text-blue-600={filters.status === status.id}
          class:border-transparent={filters.status !== status.id}
          class="inline-block p-4 border-b-2 rounded-t-lg hover:text-blue-600 hover:border-blue-700">{status.label}</a
        >
      </li>
    {/each}



  </ul>
</div>

<div class="my-4">
<Table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
  <TableHead class="bg-gray-50 dark:bg-gray-800">

    <TableHeadCell>
      <div class="flex items-center gap-x-3">
        <input
                type="checkbox"
                class="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
        />
        <span>#ID</span>
      </div>
    </TableHeadCell>

    <TableHeadCell>
      <SortButton name="status" way={filters.way} activeFilter={filters.orderBy} onChange={changeOrderBy}
      >Status</SortButton
      >
    </TableHeadCell>
    <TableHeadCell>
      <ItemSelectorModal
              config={customerSelectorConfig}
              on:select={(e) => setFilter('user', e.detail.uuid)}
              closeOnSelect={true}
              label="Select Customer"
              selectMode="single"
      >
        <Button>
          Customer
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
          ><path fill="currentColor" d="M10 20v-7L2.95 4h18.1L14 13v7h-4Z" /></svg
          >
        </Button>
      </ItemSelectorModal>
    </TableHeadCell>

    <TableHeadCell>
      <SortButton name="total" way={filters.way} activeFilter={filters.orderBy} onChange={changeOrderBy}
      >Total</SortButton
      >
    </TableHeadCell>

    <TableHeadCell>
      <SortButton name="createdAt" way={filters.way} activeFilter={filters.orderBy} onChange={changeOrderBy}
      >Date</SortButton
      >
    </TableHeadCell>

    <th scope="col" class="relative py-3.5 px-4">
      <span class="sr-only">Edit</span>
    </th>

  </TableHead>
  <TableBody TableBody class="divide-y">
    {#if loading}
      <TableBodyRow>
        <TableBodyCell colspan="10">
          <Loading />
        </TableBodyCell>
      </TableBodyRow>
    {/if}
    {#each orders.data as order}
      <TableBodyRow>
        <TableBodyCell>
          <div class="inline-flex items-center gap-x-3">
            <input
                    type="checkbox"
                    class="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
            />
            <a href="#" on:click|preventDefault={() => navigate(`/orders/${order.uuid}`)} class="hover:underline">
              {order.orderId}
            </a>
          </div>
        </TableBodyCell>
        <TableBodyCell>
          <div
                  class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-emerald-100/60 dark:bg-gray-800"
          >
                    <span
                            class="h-1.5 w-1.5 rounded-full"
                            style={`background-color: ${getStatus(order.status).color}`}
                    />

            <h2 style={`color: ${getStatus(order.status).color}`} class="text-sm font-normal">
              {getStatus(order.status).label}
            </h2>
          </div>
        </TableBodyCell>

        <TableBodyCell>{order.user.lastName} {order.user.firstName}</TableBodyCell
        >
        <TableBodyCell>{moneyFormat(order.total)}</TableBodyCell
        >
        <TableBodyCell>
          {formatDate(order.createdAt)}
        </TableBodyCell>
        <TableBodyCell>
          <div class="flex items-center gap-x-6">
            <button
                    title="View Order"
                    on:click={viewOrder.bind(this, order.uuid)}
                    class="text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 hover:text-red-500 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
              ><path
                      fill="currentColor"
                      d="M12 6.5A9.77 9.77 0 0 0 3.18 12c1.65 3.37 5.02 5.5 8.82 5.5s7.17-2.13 8.82-5.5A9.77 9.77 0 0 0 12 6.5zm0 10c-2.48 0-4.5-2.02-4.5-4.5S9.52 7.5 12 7.5s4.5 2.02 4.5 4.5s-2.02 4.5-4.5 4.5z"
                      opacity=".3"
              /><path
                      fill="currentColor"
                      d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 13A9.77 9.77 0 0 1 3.18 12C4.83 8.63 8.21 6.5 12 6.5s7.17 2.13 8.82 5.5A9.77 9.77 0 0 1 12 17.5zm0-10c-2.48 0-4.5 2.02-4.5 4.5s2.02 4.5 4.5 4.5s4.5-2.02 4.5-4.5s-2.02-4.5-4.5-4.5zm0 7a2.5 2.5 0 0 1 0-5a2.5 2.5 0 0 1 0 5z"
              /></svg
              >
            </button>
            <button
                    title="Edit Order"
                    on:click={editOrder.bind(this, order.uuid)}
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
                    title="Delete Order"
                    on:click={deleteOrder.bind(this, order.uuid)}
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
        </TableBodyCell>
      </TableBodyRow>
    {/each}
  </TableBody>
</Table>
{#if !loading}
  <Paginator
          totalPages={parseInt(orders.pages)}
          baseURL={`/orders`}
          total={parseInt(orders.total)}
          currentPage={parseInt(orders.page)}
          on:pageChange={handlePageChange}
  />
{/if}
</div>
