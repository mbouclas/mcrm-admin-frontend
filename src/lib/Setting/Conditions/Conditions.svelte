<script lang="ts">
  import { onMount } from 'svelte';
  import type { IPagination } from '../../Shared/models/generic';
  import { ConditionsService } from '../services/conditions/condition.service';
  import SortButton from '../../Shared/SortTableHeadButton.svelte';
  import Loading from '../../Shared/Loading.svelte';
  import { formatDate } from '../../helpers/dates';
  import Paginator from '../../Shared/Paginator.svelte';
  import Modal from '../../Shared/Modal.svelte';
  import CustomFilters from '../../Shared/CustomFilters.svelte';
  import { navigate } from 'svelte-navigator';
  import DropDown from '../../Shared/DropDown.svelte';
  import { AppService } from '../../Shared/app.service';
  import Input from '../../Shared/Input.svelte';
  import type { IDynamicFieldConfigBlueprint } from '../../DynamicFields/types';

  let showModal = false;
  let fields: IDynamicFieldConfigBlueprint[] = [];

  let items = {
    data: [],
  } as IPagination<any>;
  const service = new ConditionsService();
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
    fields = AppService.getModel('CartConditionModel').fields;
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
    const newActive = !items.data[foundIndex].active;

    await service.update(uuid, { active: newActive });

    items.data[foundIndex].active = newActive;
  }

  async function deleteItem(uuid: string) {}

  async function quickEditItem(uuid: string) {}

  async function setFilter(name: string, value: any) {
    filters.page = 1;
    filters[name] = value;
    appliedFilters = [...appliedFilters, { name, value }];
    await search();
  }

  async function handleConditionChange(e) {
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
      filterByPrice={false}
      filterByDate={false}
    >
      <div class="w-full" slot="fields">
        <div class="relative z-0 w-full mb-6 group">
          <Input bind:value={filters['title']} placeholder="Title" label="Title" />
        </div>

        <div class="mb-4">
          <DropDown
            placeholder="Type"
            label="Type"
            bind:value={filters['Type']}
            values={fields
              .find((field) => field.varName === 'type')
              .ui.defaultValues.map((item) => ({
                key: item,
                value: item,
              }))}
          />
        </div>

        <div class="mb-4">
          <DropDown
            placeholder="Target"
            label="Target"
            bind:value={filters['target']}
            values={fields
              .find((field) => field.varName === 'target')
              .ui.defaultValues.map((item) => ({
                key: item,
                value: item,
              }))}
          />
        </div>
      </div></CustomFilters
    >
  </div>
  <div slot="footer">
    <button class="bg-blue-500 px-2 py-1 rounded" autofocus on:click={searchByFilters}>Search</button>
  </div>
</Modal>

<div class="max-w-screen-xl">
  <div class="max-w-screen-sm">
    <h2 class="mb-4 text-xl lg:text-2xl tracking-tight font-extrabold text-gray-900 dark:text-white outline-none">
      <span class="text-blue-400"> {items.total}</span> Conditions
    </h2>
  </div>
</div>

<div class="flex items-center space-x-4">
  <button on:click={() => navigate('/settings/conditions/new')} class="bg-green-500 rounded p-2">Add condition</button>

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
                  <SortButton name="title" way={filters.way} activeFilter={filters.orderBy} onChange={changeOrderBy}
                    >Title</SortButton
                  >
                </div>
              </th>

              <th
                scope="col"
                class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                <div class="flex items-center gap-x-3">
                  <SortButton name="title" way={filters.way} activeFilter={filters.orderBy} onChange={changeOrderBy}
                    >Type</SortButton
                  >
                </div>
              </th>

              <th
                scope="col"
                class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                <div class="flex items-center gap-x-3">
                  <SortButton name="title" way={filters.way} activeFilter={filters.orderBy} onChange={changeOrderBy}
                    >Target</SortButton
                  >
                </div>
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

                  <a
                    class="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer"
                    href={`/settings/conditions/${item.uuid}`}
                  >
                    {item.title}
                  </a>
                </div>
              </td>

              <td class="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                <div>
                  {item.type}
                </div>
              </td>

              <td class="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                <div>
                  {item.target}
                </div>
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
    totalConditions={parseInt(items.pages)}
    baseURL={`/settings/conditions`}
    total={parseInt(items.total)}
    currentCondition={parseInt(items.page)}
    on:pageChange={handleConditionChange}
  />
</div>
