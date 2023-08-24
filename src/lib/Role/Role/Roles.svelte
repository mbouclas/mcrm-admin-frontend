<script lang="ts">
  import { onMount } from 'svelte';
  import { RoleService } from '../services/role/role.service';
  import { formatDate } from '../../helpers/dates';
  import Paginator from '../../Shared/Paginator.svelte';
  import SortButton from '../../Shared/SortTableHeadButton.svelte';
  import Input from '../../Shared/Input.svelte';
  import Loading from '../../Shared/Loading.svelte';
  import ItemSelectorModal from '../../DynamicFields/fields/item-selector-modal.svelte';
  import { Button, Modal } from 'flowbite-svelte';
  import { userItemSelectorConfig } from '../../Shared/item-selector-configs';
  import { navigate } from 'svelte-navigator';
  import { RequestErrorException, handleValidationErrors, clearErrors } from '../../helpers/helperErrors';

  let isRoleModalOpen = false;
  const service = new RoleService();

  const roleDefault = {
    uuid: null,
    name: '',
    level: 1,
    description: '',
  };
  let roleData = roleDefault;

  const defaultRoleStatus = {
    name: {
      errors: [],
    },
    level: {
      errors: [],
    },
    description: {
      errors: [],
    },
  };

  let roleStatus = defaultRoleStatus;

  $: hasRoleErrors = Object.values(roleStatus).some((field) => field.errors.length > 0);

  let roles = {
      page: 1,
      data: [],
      total: 0,
    },
    loading = false;

  const defaultFilters = {
    limit: 12,
    page: 1,
    way: 'desc',
    isRole: true,
  };
  let filters: typeof defaultFilters;
  reset();

  const roleSelectorConfig = userItemSelectorConfig;

  onMount(async () => {
    await search();
  });

  async function search() {
    roles.data = [];

    loading = true;
    roles = await service.find(filters, ['orderCount']);
    loading = false;
  }

  async function handlePageChange(e) {
    filters.page = e.detail;
    await search();
  }

  async function viewRole(uuid: number) {
    // await service.edit(id);
  }

  async function changeStatus(uuid: number) {
    // await service.edit(id);
  }

  async function editRole(uuid: number) {
    // await service.edit(id);
  }

  async function deleteRole(uuid: number) {
    // await service.edit(id);
  }

  async function changeRoleBy(role: string, way: string) {
    if (filters.role === role) {
      filters.way = filters.way === 'asc' ? 'desc' : 'asc';
    }

    filters.role = role;

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

  const confirmAddRoleModal = async () => {
    try {
      roleStatus = clearErrors(roleStatus);
      const create = await service.create({ ...roleData, level: parseInt(roleData.level) });

      if (create) {
        navigate(`/roles/${create.uuid}`);
      }
    } catch (e) {
      if (e instanceof RequestErrorException) {
        roleStatus = handleValidationErrors(e.details.validationErrors, roleStatus);
        return null;
      }
    }
  };

  const openAddRoleModal = () => {
    isRoleModalOpen = true;
  };

  const cancelAddRoleModal = () => {};
</script>

<Modal bind:open={isRoleModalOpen}>
  <div class="p-4">
    <h2 class="flowbite-modal-title mb-4 text-xl font-bold">Add new role</h2>

    <div class="mb-4">
      <Input label="Name" bind:errors={roleStatus.name.errors} bind:value={roleData.name} required />
    </div>

    <div class="mb-4">
      <Input label="Level" bind:errors={roleStatus.level.errors} bind:value={roleData.level} required />
    </div>

    <div class="mb-4">
      <Input
        label="Description"
        bind:errors={roleStatus.description.errors}
        bind:value={roleData.description}
        required
      />
    </div>
  </div>

  <svelte:fragment slot="footer">
    <Button disabled={hasRoleErrors} on:click={confirmAddRoleModal}>Create</Button>
    <Button color="alternative" on:click={cancelAddRoleModal}>Cancel</Button>
  </svelte:fragment>
</Modal>

<div
  class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 overflow-y-hidden overflow-x-auto"
>
  <ul class="flex space-x-4 items-center -mb-px w-full py-2">
    <li>
      <button on:click={() => openAddRoleModal()} class="bg-green-500 rounded p-2">Add role</button>
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
      <div class="overflow-hidden brole brole-gray-200 dark:brole-gray-700 md:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                >Role
                <ItemSelectorModal
                  config={roleSelectorConfig}
                  on:select={(e) => setFilter('role', e.detail.uuid)}
                  closeOnSelect={true}
                  label="Select Role"
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
                  config={roleSelectorConfig}
                  on:select={(e) => setFilter('role', e.detail.uuid)}
                  closeOnSelect={true}
                  label="Select Role"
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
                >Description
                <ItemSelectorModal
                  config={roleSelectorConfig}
                  on:select={(e) => setFilter('role', e.detail.uuid)}
                  closeOnSelect={true}
                  label="Select Role"
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
                <SortButton name="createdAt" way={filters.way} activeFilter={filters.role} onChange={changeRoleBy}
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
            {#each roles.data as role}
              <tr>
                <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                  <a
                    href={`/roles/${role.uuid}`}
                    class="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    {role.displayName}
                  </a>
                </td>

                <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{role.level}</td>

                <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{role.description}</td>

                <td class="px-4 py-4 text-sm whitespace-nowrap">
                  {formatDate(role.createdAt)}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <Paginator
        totalPages={parseInt(roles.pages)}
        baseURL={`/roles`}
        total={parseInt(roles.total)}
        currentPage={parseInt(roles.page)}
        on:pageChange={handlePageChange}
      />
    </div>
  </div>
</div>
