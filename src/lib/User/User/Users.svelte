<script lang="ts">
  import { onMount } from 'svelte';
  import { UserService } from '../services/user/user.service';
  import { formatDate } from '../../helpers/dates';
  import Paginator from '../../Shared/Paginator.svelte';
  import SortButton from '../../Shared/SortTableHeadButton.svelte';
  import Input from '../../Shared/Input.svelte';
  import Loading from '../../Shared/Loading.svelte';
  import ItemSelectorModal from '../../DynamicFields/fields/item-selector-modal.svelte';
  import { Button } from 'flowbite-svelte';
  import { userItemSelectorConfig } from '../../Shared/item-selector-configs';
  import { navigate, useLocation } from 'mcrm-svelte-navigator';
  import { RequestErrorException, handleValidationErrors, clearErrors } from '../../helpers/helperErrors';
  import Modal from '../../Shared/Modal.svelte';
  import CustomFilters from '../../Shared/CustomFilters.svelte';

  let isUserModalOpen = false;
  const service = new UserService();
  let showModal = false;
  let searchVal = '';
  const location = useLocation();
  const currentPath = $location.pathname;
  const queryParams = new URLSearchParams($location.search);

  const userDefault = {
    uuid: null,
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  };
  let userData = userDefault;

  const defaultUserStatus = {
    email: {
      errors: [],
    },
    firstName: {
      errors: [],
    },
    lastName: {
      errors: [],
    },
    password: {
      errors: [],
    },
  };

  let userStatus = defaultUserStatus;

  $: hasUserErrors = Object.values(userStatus).some((field) => field.errors.length > 0);

  let users = {
      page: 1,
      data: [],
      total: 0,
    },
    loading = false;

  const defaultFilters = {
    limit: 12,
    page: 1,
    way: 'desc',
    isUser: true,
    q: '',
  };
  let filters: typeof defaultFilters;
  reset();

  const userSelectorConfig = userItemSelectorConfig;

  onMount(async () => {
    await search();
  });

  async function search() {
    users.data = [];

    loading = true;
    users = await service.find(filters, ['orderCount']);
    loading = false;
  }

  async function handlePageChange(e) {
    filters.page = e.detail;
    await search();
  }

  async function viewUser(uuid: number) {
    // await service.edit(id);
  }

  async function changeStatus(uuid: number) {
    // await service.edit(id);
  }

  async function editUser(uuid: number) {
    // await service.edit(id);
  }

  async function deleteUser(uuid: number) {
    // await service.edit(id);
  }

  async function changeUserBy(user: string, way: string) {
    if (filters.user === user) {
      filters.way = filters.way === 'asc' ? 'desc' : 'asc';
    }

    filters.user = user;

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

  const confirmAddUserModal = async () => {
    try {
      userStatus = clearErrors(userStatus);
      const create = await service.create(userData);

      if (create) {
        navigate(`/users/${create.uuid}`);
      }
    } catch (e) {
      if (e instanceof RequestErrorException) {
        userStatus = handleValidationErrors(e.details.validationErrors, userStatus);
        return null;
      }
    }
  };

  const openAddUserModal = () => {
    isUserModalOpen = true;
  };

  const cancelAddUserModal = () => {
    isUserModalOpen = false;
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
    <button class="bg-blue-500 px-2 py-1 rounded" autofocus on:click={searchByFilters}>Search</button>
  </div>
</Modal>

<Modal bind:showModal={isUserModalOpen}>
  <h2 class="flowbite-modal-title text-xl font-bold" slot="header">Add new user</h2>
  <div class="mt-4" slot="content">
    <div class="mb-4">
      <Input label="Email" bind:errors={userStatus.email.errors} bind:value={userData.email} required />
    </div>

    <div class="mb-4">
      <Input label="First name" bind:errors={userStatus.firstName.errors} bind:value={userData.firstName} required />
    </div>

    <div class="mb-4">
      <Input label="Last name" bind:errors={userStatus.lastName.errors} bind:value={userData.lastName} required />
    </div>

    <div class="mb-4">
      <Input label="Password" bind:errors={userStatus.password.errors} bind:value={userData.password} required />
    </div>
  </div>

  <div slot="footer">
    <Button disabled={hasUserErrors} on:click={confirmAddUserModal}>Create</Button>
    <Button color="alternative" on:click={cancelAddUserModal}>Cancel</Button>
  </div>
</Modal>

<div class="max-w-screen-xl">
  <div class="max-w-screen-sm">
    <h2 class="mb-4 text-xl lg:text-2xl tracking-tight font-extrabold text-gray-900 dark:text-white outline-none">
      <span class="text-blue-400"> {users.total}</span> Users
    </h2>
  </div>
</div>

<div
  class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 overflow-y-hidden overflow-x-auto"
>
  <ul class="flex space-x-4 items-center -mb-px w-full py-2">
    <li>
      <button on:click={() => openAddUserModal()} class="bg-green-500 rounded p-2">Add user</button>
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
      <div class="overflow-hidden buser buser-gray-200 dark:buser-gray-700 md:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                >User
                <ItemSelectorModal
                  config={userSelectorConfig}
                  on:select={(e) => setFilter('user', e.detail.uuid)}
                  closeOnSelect={true}
                  label="Select User"
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
                  config={userSelectorConfig}
                  on:select={(e) => setFilter('user', e.detail.uuid)}
                  closeOnSelect={true}
                  label="Select User"
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
                <SortButton name="createdAt" way={filters.way} activeFilter={filters.user} onChange={changeUserBy}
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
            {#each users.data as user}
              <tr>
                <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                  <a
                    href={`/users/${user.uuid}`}
                    class="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    {user.lastName}
                    {user.firstName}
                  </a>
                </td>

                <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{user.email}</td>

                <td class="px-4 py-4 text-sm whitespace-nowrap">
                  {formatDate(user.createdAt)}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <Paginator
        totalPages={parseInt(users.pages)}
        baseURL={`/users`}
        total={parseInt(users.total)}
        currentPage={parseInt(users.page)}
        on:pageChange={handlePageChange}
      />
    </div>
  </div>
</div>
