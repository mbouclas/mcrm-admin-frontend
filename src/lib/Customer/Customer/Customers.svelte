<script lang="ts">
  import { onMount } from 'svelte';
  import { CustomerService } from '../services/customer/customer.service';
  import { formatDate } from '../../helpers/dates';
  import Paginator from '../../Shared/Paginator.svelte';
  import SortButton from '../../Shared/SortTableHeadButton.svelte';
  import Loading from '../../Shared/Loading.svelte';
  import ItemSelectorModal from '../../DynamicFields/fields/item-selector-modal.svelte';
  import { Button } from 'flowbite-svelte';
  import { userItemSelectorConfig } from '../../Shared/item-selector-configs';
  import Modal from '../../Shared/Modal.svelte';
  import CustomFilters from '../../Shared/CustomFilters.svelte';
  import { navigate, useLocation } from 'svelte-navigator';

  let showModal = false;
  let searchVal = '';
  const location = useLocation();
  const currentPath = $location.pathname;
  const queryParams = new URLSearchParams($location.search);

  const service = new CustomerService();
  let customers = {
      page: 1,
      data: [],
      total: 0,
    },
    loading = false;
  const defaultFilters = {
    limit: 12,
    page: 1,
    way: 'desc',
    isCustomer: true,
    q: '',
  };
  let filters: typeof defaultFilters;
  reset();

  const customerSelectorConfig = userItemSelectorConfig;

  onMount(async () => {
    await search();
  });

  async function search() {
    customers.data = [];

    loading = true;
    customers = await service.find(filters, ['orderCount']);

    loading = false;
  }

  async function handlePageChange(e) {
    filters.page = e.detail;
    await search();
  }

  async function viewCustomer(uuid: number) {
    // await service.edit(id);
  }

  async function changeStatus(uuid: number) {
    // await service.edit(id);
  }

  async function editCustomer(uuid: number) {
    // await service.edit(id);
  }

  async function deleteCustomer(uuid: number) {
    // await service.edit(id);
  }

  async function changeCustomerBy(customer: string, way: string) {
    if (filters.customer === customer) {
      filters.way = filters.way === 'asc' ? 'desc' : 'asc';
    }

    filters.customer = customer;

    await search();
  }

  async function setFilter(name: string, value: any) {
    filters.page = 1;
    filters[name] = value;
    await search();
  }

  async function reset() {
    filters = Object.assign({}, defaultFilters);
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
</script>

<Modal bind:showModal>
  <div slot="header">Filters</div>
  <div slot="content">
    <CustomFilters
      filterByPrice={false}
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

<div class="max-w-screen-xl">
  <div class="max-w-screen-sm">
    <h2 class="mb-4 text-xl lg:text-2xl tracking-tight font-extrabold text-gray-900 dark:text-white">
      <span class="text-blue-400"> {customers.total}</span> Customers
    </h2>
  </div>
</div>

<div
  class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 overflow-y-hidden overflow-x-auto"
>
  <ul class="flex space-x-4 items-center -mb-px w-full py-2">
    <li>
      <button on:click={() => (showModal = true)} class="bg-blue-500 rounded p-2">Filters</button>
    </li>
    <li>
      <button on:click={reset} class="bg-red-500 rounded p-2">Reset Filters</button>
    </li>
  </ul>
</div>

<div class="flex flex-col mt-6">
  <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
      <div class="overflow-hidden bcustomer bcustomer-gray-200 dark:bcustomer-gray-700 md:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                >Customer
                <ItemSelectorModal
                  config={customerSelectorConfig}
                  on:select={(e) => setFilter('user', e.detail.uuid)}
                  closeOnSelect={true}
                  label="Select Customer"
                  selectMode="single"
                >
                  <Button>
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                      ><path fill="currentColor" d="M10 20v-7L2.95 4h18.1L14 13v7h-4Z" /></svg
                    >
                  </Button>
                </ItemSelectorModal>
              </th>

              <th
                scope="col"
                class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                >Email
                <ItemSelectorModal
                  config={customerSelectorConfig}
                  on:select={(e) => setFilter('user', e.detail.uuid)}
                  closeOnSelect={true}
                  label="Select Customer"
                  selectMode="single"
                >
                  <Button>
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                      ><path fill="currentColor" d="M10 20v-7L2.95 4h18.1L14 13v7h-4Z" /></svg
                    >
                  </Button>
                </ItemSelectorModal>
              </th>

              <th
                scope="col"
                class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                >Order number
                <ItemSelectorModal
                  config={customerSelectorConfig}
                  on:select={(e) => setFilter('user', e.detail.uuid)}
                  closeOnSelect={true}
                  label="Select Customer"
                  selectMode="single"
                >
                  <Button>
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
                <SortButton
                  name="createdAt"
                  way={filters.way}
                  activeFilter={filters.customer}
                  onChange={changeCustomerBy}>Date</SortButton
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
            {#each customers.data as customer}
              <tr>
                <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                  <a
                    href={`/customers/${customer.uuid}`}
                    class="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    {customer.lastName}
                    {customer.firstName}
                  </a>
                </td>

                <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{customer.email}</td>

                <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"
                  >{customer.orderCount}</td
                >

                <td class="px-4 py-4 text-sm whitespace-nowrap">
                  {formatDate(customer.createdAt)}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <Paginator
        totalPages={parseInt(customers.pages)}
        baseURL={`/customers`}
        total={parseInt(customers.total)}
        currentPage={parseInt(customers.page)}
        on:pageChange={handlePageChange}
      />
    </div>
  </div>
</div>
