<script lang="ts">
  import { onMount } from 'svelte';
  import { GateService } from '../services/gate/gate.service';
  import Paginator from '../../Shared/Paginator.svelte';
  import SortButton from '../../Shared/SortTableHeadButton.svelte';
  import Input from '../../Shared/Input.svelte';
  import Loading from '../../Shared/Loading.svelte';
  import ItemSelectorModal from '../../DynamicFields/fields/item-selector-modal.svelte';
  import { Button } from 'flowbite-svelte';
  import { userItemSelectorConfig } from '../../Shared/item-selector-configs';
  import { navigate, useLocation } from 'svelte-navigator';
  import { RequestErrorException, handleValidationErrors, clearErrors } from '../../helpers/helperErrors';
  import Modal from '../../Shared/Modal.svelte';
  import CustomFilters from '../../Shared/CustomFilters.svelte';

  let isGateModalOpen = false;
  const service = new GateService();
  let showModal = false;
  let searchVal = '';
  const location = useLocation();
  const currentPath = $location.pathname;
  const queryParams = new URLSearchParams($location.search);

  $: console.log('here');

  const gateDefault = {
    uuid: null,
    name: '',
    level: 1,
    gate: '',
    provider: '',
    q: '',
  };
  let gateData = gateDefault;

  const defaultGateStatus = {
    name: {
      errors: [],
    },
    level: {
      errors: [],
    },
    gate: {
      errors: [],
    },

    provider: {
      errors: [],
    },
  };

  let gateStatus = defaultGateStatus;

  $: hasGateErrors = Object.values(gateStatus).some((field) => field.errors.length > 0);

  let gates = {
      page: 1,
      data: [],
      total: 0,
    },
    loading = false;

  const defaultFilters = {
    limit: 12,
    page: 1,
    way: 'desc',
    isGate: true,
  };
  let filters: typeof defaultFilters;
  reset();

  const gateSelectorConfig = userItemSelectorConfig;

  onMount(async () => {
    await search();
  });

  async function search() {
    gates.data = [];

    loading = true;
    gates = await service.find(filters, ['orderCount']);
    loading = false;
  }

  async function handlePageChange(e) {
    filters.page = e.detail;
    await search();
  }

  async function viewGate(uuid: number) {
    // await service.edit(id);
  }

  async function changeStatus(uuid: number) {
    // await service.edit(id);
  }

  async function editGate(uuid: number) {
    // await service.edit(id);
  }

  async function deleteGate(uuid: number) {
    // await service.edit(id);
  }

  async function changeGateBy(gate: string, way: string) {
    if (filters.gate === gate) {
      filters.way = filters.way === 'asc' ? 'desc' : 'asc';
    }

    filters.gate = gate;

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

  const confirmAddGateModal = async () => {
    try {
      gateStatus = clearErrors(gateStatus);
      const create = await service.create({ ...gateData, level: parseInt(gateData.level) });

      if (create) {
        navigate(`/gates/${create.uuid}`);
      }
    } catch (e) {
      if (e instanceof RequestErrorException) {
        gateStatus = handleValidationErrors(e.details.validationErrors, gateStatus);
        return null;
      }
    }
  };

  const openAddGateModal = () => {
    isGateModalOpen = true;
  };

  const cancelAddGateModal = () => {
    isGateModalOpen = false;
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
    <Button class="bg-blue-500 px-2 py-1 rounded" autofocus on:click={searchByFilters}>Search</Button>
  </div>
</Modal>
<Modal bind:showModal={isGateModalOpen}>
  <h2 class="flowbite-modal-title text-xl font-bold" slot="header">Add new gate</h2>
  <div class="p-4" slot="content">
    <div class="mb-4">
      <Input label="Name" bind:errors={gateStatus.name.errors} bind:value={gateData.name} required />
    </div>

    <div class="mb-4">
      <Input label="Level" bind:errors={gateStatus.level.errors} bind:value={gateData.level} required />
    </div>

    <div class="mb-4">
      <Input label="Gate" bind:errors={gateStatus.gate.errors} bind:value={gateData.gate} required />
    </div>

    <div class="mb-4">
      <Input label="Provider" bind:errors={gateStatus.provider.errors} bind:value={gateData.provider} required />
    </div>
  </div>

  <div slot="footer">
    <Button disabled={hasGateErrors} on:click={confirmAddGateModal}>Create</Button>
    <Button color="alternative" on:click={cancelAddGateModal}>Cancel</Button>
  </div>
</Modal>

<div
  class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 overflow-y-hidden overflow-x-auto"
>
  <ul class="flex space-x-4 items-center -mb-px w-full py-2">
    <li>
      <button on:click={() => openAddGateModal()} class="bg-green-500 rounded p-2">Add gate</button>
    </li>

    <li>
      <button on:click={() => {}} class="bg-blue-500 rounded p-2">Filters</button>
    </li>
    <li>
      <button on:click={reset} class="bg-red-500 rounded p-2">Reset Filters</button>
    </li>
  </ul>
</div>

<div class="flex flex-col mt-6">
  <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
      <div class="overflow-hidden bgate bgate-gray-200 dark:bgate-gray-700 md:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                >Name
                <ItemSelectorModal
                  config={gateSelectorConfig}
                  on:select={(e) => setFilter('gate', e.detail.uuid)}
                  closeOnSelect={true}
                  label="Select Gate"
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
                >Level
                <ItemSelectorModal
                  config={gateSelectorConfig}
                  on:select={(e) => setFilter('gate', e.detail.uuid)}
                  closeOnSelect={true}
                  label="Select Gate"
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
                >Provider
                <ItemSelectorModal
                  config={gateSelectorConfig}
                  on:select={(e) => setFilter('gate', e.detail.uuid)}
                  closeOnSelect={true}
                  label="Select Gate"
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
                >Gate
                <ItemSelectorModal
                  config={gateSelectorConfig}
                  on:select={(e) => setFilter('gate', e.detail.uuid)}
                  closeOnSelect={true}
                  label="Select Gate"
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
                <SortButton name="createdAt" way={filters.way} activeFilter={filters.gate} onChange={changeGateBy}
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
            <!-- {#each gates.data as gate}
              <tr>
                <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                  <a
                    href={`/gates/${gate.uuid}`}
                    class="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    {gate.name}
                  </a>
                </td>

                <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{gate.level}</td>

                <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{gate.provider}</td>

                <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{gate.gate}</td>

                <td class="px-4 py-4 text-sm whitespace-nowrap">
                  {formatDate(gate.createdAt)}
                </td>
              </tr>
            {/each} -->
          </tbody>
        </table>
      </div>

      <Paginator
        totalPages={parseInt(gates.pages)}
        baseURL={`/gates`}
        total={parseInt(gates.total)}
        currentPage={parseInt(gates.page)}
        on:pageChange={handlePageChange}
      />
    </div>
  </div>
</div>
