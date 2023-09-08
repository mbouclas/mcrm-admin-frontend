<script lang="ts">
  import { onMount } from 'svelte';
  import { PropertiesService } from '../../services/properties/properties.service';
  import { formatDate } from '../../../helpers/dates';
  import Paginator from '../../../Shared/Paginator.svelte';
  import SortButton from '../../../Shared/SortTableHeadButton.svelte';
  import Input from '../../../Shared/Input.svelte';
  import Loading from '../../../Shared/Loading.svelte';
  import { Button } from 'flowbite-svelte';
  import { navigate, useLocation } from 'svelte-navigator';
  import { RequestErrorException, handleValidationErrors, clearErrors } from '../../../helpers/helperErrors';
  import Modal from '../../../Shared/Modal.svelte';
  import { Trash } from 'svelte-heros-v2';
  import CustomFilters from '../../../Shared/CustomFilters.svelte';
  import type { IPagination } from '../../../Shared/models/generic';

  export let propertyUuid;

  let isPropertyValueModalOpen = false;
  let isDeletePropertyValueModalOpen = false;
  const service = new PropertiesService();
  let showModal = false;
  let searchVal = '';
  const location = useLocation();
  const currentPath = $location.pathname;
  const queryParams = new URLSearchParams($location.search);

  const propertyValueDefault = {
    uuid: null,
    name: '',
    icon: '',
    image: '',
  };
  let propertyValueData = propertyValueDefault;

  const defaultPropertyValueStatus = {
    name: {
      errors: [],
    },
    icon: {
      errors: [],
    },
    image: {
      errors: [],
    },
  };

  let items = {
    data: [],
  } as IPagination<any>;

  const defaultFilters = {
    limit: 12,
    page: 1,
    orderBy: 'createdAt',
    way: 'desc',
    property: propertyUuid,
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
    items = await service.findValues(filters, []);

    loading = false;
  }

  async function reset() {
    filters = Object.assign({}, defaultFilters);
    navigate(currentPath);
    await search();
  }

  let propertyValueStatus = defaultPropertyValueStatus;

  $: hasPropertyValueErrors = Object.values(propertyValueStatus).some((field) => field.errors.length > 0);

  reset();

  onMount(async () => {
    await search();
  });

  async function handlePageChange(e) {
    filters.page = e.detail;
    await search();
  }

  const handlePropertyValue = async ({ value, action }) => {
    if (action === 'create') {
      await service.storePropertyValue(value);
    }

    if (action === 'edit') {
      await service.updatePropertyValue(value);
    }

    if (action === 'delete') {
      await service.deletePropertyValue(value);
    }

    await reloadData();
  };

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

  const confirmAddPropertyValueModal = async () => {
    try {
      propertyValueStatus = clearErrors(propertyValueStatus);
      const create = await service.storePropertyValue(propertyValueData);

      if (create) {
        await search();
      }
    } catch (e) {
      if (e instanceof RequestErrorException) {
        propertyValueStatus = handleValidationErrors(e.details.validationErrors, propertyValueStatus);
        return null;
      }
    }
  };

  const openAddPropertyValueModal = () => {
    isPropertyValueModalOpen = true;
  };

  const cancelAddPropertyValueModal = () => {
    isPropertyValueModalOpen = false;
  };

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

  const confirmDeletePropertyValue = async () => {
    console.log(propertyValueData.uuid);
    await service.deletePropertyValue({ propertyUuid, propertyValueUuid: propertyValueData.uuid });
    isDeletePropertyValueModalOpen = false;
    propertyValueData = null;
    await search();
  };

  const deletePropertyValue = async (item) => {
    propertyValueData = item;
    isDeletePropertyValueModalOpen = true;
  };
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

<Modal bind:showModal={isDeletePropertyValueModalOpen}>
  <div slot="header">Delete property value</div>
  <div slot="content">
    <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
      Are you sure you want to <span class="text-lg font-bold">permanently delete</span>
      property value
      <span class="text-lg font-bold">{propertyValueData.name}</span>?
    </p>
  </div>
  <div slot="footer">
    <Button on:click={() => confirmDeletePropertyValue()}>Confirm</Button>
    <Button color="alternative">Cancel</Button>
  </div>
</Modal>

<Modal bind:showModal={isPropertyValueModalOpen}>
  <h2 class="flowbite-modal-title text-xl font-bold" slot="header">Add new propertyValue</h2>
  <div class="mt-4" slot="content">
    <div class="mb-4">
      <Input label="Name" bind:errors={propertyValueStatus.name.errors} bind:value={propertyValueData.name} required />
    </div>

    <div class="mb-4">
      <Input label="Icon" bind:errors={propertyValueStatus.icon.errors} bind:value={propertyValueData.icon} required />
    </div>

    <div class="mb-4">
      <Input
        label="Image"
        bind:errors={propertyValueStatus.image.errors}
        bind:value={propertyValueData.image}
        required
      />
    </div>
  </div>

  <div slot="footer">
    <Button disabled={hasPropertyValueErrors} on:click={confirmAddPropertyValueModal}>Create</Button>
    <Button color="alternative" on:click={cancelAddPropertyValueModal}>Cancel</Button>
  </div>
</Modal>
<div
  class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 overflow-y-hidden overflow-x-auto"
>
  <ul class="flex space-x-4 items-center -mb-px w-full py-2">
    <li>
      <button on:click={() => openAddPropertyValueModal()} class="bg-green-500 rounded p-2">Add Property Value</button>
    </li>

    <li>
      <button on:click={() => (showModal = !showModal)} class="bg-blue-500 rounded p-2">Filters</button>
    </li>
    <li>
      <button on:click={reset} class="bg-red-500 rounded p-2">Reset Filters</button>
    </li>
  </ul>
</div>

<div class="flex flex-col mt-6">
  <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
      <div class="overflow-hidden bpropertyValue bpropertyValue-gray-200 dark:bpropertyValue-gray-700 md:rounded-lg">
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
                    >Name</SortButton
                  >
                </div>
              </th>

              <th
                scope="col"
                class="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                <SortButton name="title" way={filters.way} activeFilter={filters.orderBy} onChange={changeOrderBy}
                  >Icon</SortButton
                >
              </th>

              <th
                scope="col"
                class="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                <SortButton name="title" way={filters.way} activeFilter={filters.orderBy} onChange={changeOrderBy}
                  >Image</SortButton
                >
              </th>

              <th
                scope="col"
                class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                <SortButton name="createdAt" way={filters.way} onChange={changeOrderBy}>Date</SortButton>
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
            {#each items.data as item}
              <tr>
                <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                  <div class="inline-flex items-center gap-x-3">
                    <input
                      type="checkbox"
                      class="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
                    />

                    <span class="hover:underline">
                      {item.name}
                    </span>
                  </div>
                </td>

                <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                  <img class="w-20" src={item?.icon?.url || item?.icon} />
                </td>

                <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                  <img class="w-20" src={item?.icon?.image || item?.image} />
                </td>

                <td class="px-4 py-4 text-sm whitespace-nowrap">
                  {formatDate(item.createdAt)}
                </td>

                <td class="px-4 py-4 text-sm whitespace-nowrap">
                  <button on:click={() => deletePropertyValue(item)} class="text-gray-500"
                    ><Trash color="white" /></button
                  >
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <Paginator
        totalPages={parseInt(items.pages)}
        baseURL={`/propertyValues`}
        total={parseInt(items.total)}
        currentPage={parseInt(items.page)}
        on:pageChange={handlePageChange}
      />
    </div>
  </div>
</div>
