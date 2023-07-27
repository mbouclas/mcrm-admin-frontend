<script lang="ts">
  import { onMount } from 'svelte';
  import { CustomerService } from '../services/customer/customer.service';
  import { app } from '../../stores';
  import { moneyFormat } from '../../helpers/money';
  import { formatDate } from '../../helpers/dates';
  import Paginator from '../../Shared/Paginator.svelte';
  import SortButton from '../../Shared/SortTableHeadButton.svelte';
  import Loading from '../../Shared/Loading.svelte';
  import ItemSelectorModal from '../../DynamicFields/fields/item-selector-modal.svelte';
  import { MenuButton, Button, Dropdown, DropdownItem, DropdownDivider, Search } from 'flowbite-svelte';
  import type { IItemSelectorConfig } from '../../DynamicFields/types';
  import { productCategoryItemSelectorConfig, userItemSelectorConfig } from '../../Shared/item-selector-configs';
  import ItemSelector from '../../DynamicFields/fields/item-selector.svelte';
  let dropdownOpen = false;

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
    await search();
  }
</script>

<div class="flex items-center justify-center p-4">
  <button on:click={reset}>Reset Filters</button>
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
            {#each customers.data as customer}
              <tr>
                <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                  <a href={`/customers/${customer.uuid}`} class="hover:underline">
                    {customer.lastName} {customer.firstName}</a
                  ></td
                >

                <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{customer.email}</td>

                <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"
                  >{customer.orderCount}</td
                >

                <td class="px-4 py-4 text-sm whitespace-nowrap">
                  {formatDate(customer.createdAt)}
                </td>
                <td class="px-4 py-4 text-sm whitespace-nowrap">
                  <div class="flex items-center gap-x-6">
                    <button
                      title="View Customer"
                      on:click={viewCustomer.bind(this, customer.uuid)}
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
                      title="Edit Customer"
                      on:click={editCustomer.bind(this, customer.uuid)}
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
                      title="Delete Customer"
                      on:click={deleteCustomer.bind(this, customer.uuid)}
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
