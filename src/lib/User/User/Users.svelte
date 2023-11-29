<script lang="ts">
  import { onMount } from 'svelte';
  import { UserService } from '../services/user/user.service';
  import { formatDate } from '../../helpers/dates';
  import Paginator from '../../Shared/Paginator.svelte';
  import Input from '../../Shared/Input.svelte';
  import Loading from '../../Shared/Loading.svelte';
  import {Button, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Modal} from 'flowbite-svelte';
  import { userItemSelectorConfig } from '../../Shared/item-selector-configs';
  import { navigate, useLocation } from 'mcrm-svelte-navigator';
  import { RequestErrorException, handleValidationErrors, clearErrors } from '../../helpers/helperErrors';
  import {RoleService} from "../../Role/services/role/role.service";
  import {Plus, Trash} from "svelte-heros-v2";
  import FiltersBar from "./filters-bar.svelte";

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
    // isUser: true,
    q: '',
  };
  let filters: typeof defaultFilters;
  // reset();
  let filterableRoles = [];
  let allRoles = [];
  const userSelectorConfig = userItemSelectorConfig;
  let ready = false;
  let excludedRoles = [];

  onMount(async () => {
    allRoles = await new RoleService().find();
    filterableRoles = allRoles.data.filter(r => r.level > 1).map(r => r.name);
    excludedRoles = allRoles.data.filter(r => r.level < 1).map(r => r.uuid);
    await reset();
    ready = true;
  });

  async function search() {
    users.data = [];

    loading = true;

    users = await service.find(filters, ['*']);
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

  async function deleteUser(user) {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }
    // await service.edit(id);
    await service.delete(user.uuid);
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
    filters = Object.assign({role: filterableRoles}, defaultFilters);

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


  async function applyFilters() {
    await search();
  }

  async function clearFilters() {
    await reset();
  }
</script>


<Modal title="Add new user" autoclose={false} size="xl" bind:open={isUserModalOpen}>
  <div class="my-4">
    <Input label="Email" bind:errors={userStatus.email.errors} bind:value={userData.email} required />
  </div>

  <div class="my-4">
    <Input label="First name" bind:errors={userStatus.firstName.errors} bind:value={userData.firstName} required />
  </div>

  <div class="my-4">
    <Input label="Last name" bind:errors={userStatus.lastName.errors} bind:value={userData.lastName} required />
  </div>

  <div class="my-4">
    <Input label="Password" bind:errors={userStatus.password.errors} bind:value={userData.password} required />
  </div>
  <div class="my-4 space-x-4">
    <Button disabled={hasUserErrors} color="green" on:click={confirmAddUserModal}>Create</Button>
    <Button color="red" on:click={cancelAddUserModal}>Cancel</Button>
  </div>
</Modal>
{#if ready}
<div class="max-w-screen-xl">
  <div class="max-w-screen-sm">
    <h2 class="mb-4 text-xl lg:text-2xl tracking-tight font-extrabold text-gray-900 dark:text-white outline-none">
      <span class="text-blue-400"> {users.total}</span> Users
    </h2>
  </div>
</div>


  <div class="flex items-center space-x-4 my-4">
    <Button on:click={() => openAddUserModal()} class="bg-green-500 rounded p-2">
      <Plus /></Button>
    <FiltersBar bind:filters={filters} on:filter={applyFilters} on:clear={clearFilters} {excludedRoles} />
  </div>
<Table>
  <TableHead>
    <TableHeadCell>Name</TableHeadCell>
    <TableHeadCell>Email</TableHeadCell>
    <TableHeadCell>Date</TableHeadCell>
    <TableHeadCell>Active</TableHeadCell>
    <TableHeadCell>Role</TableHeadCell>
    <TableHeadCell></TableHeadCell>
  </TableHead>
  <TableBody class="divide-y">
    {#if loading}
      <TableBodyRow>
        <TableBodyCell colspan="10">
          <div class="flex justify-center">
            <Loading />
          </div>
        </TableBodyCell>
      </TableBodyRow>
      {/if}
    {#each users.data as user}
    <TableBodyRow>
      <TableBodyCell>
        <a href="#" on:click|preventDefault={() => navigate(`/users/${user.uuid}`)}
                class="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer">
          {user.lastName}
          {user.firstName}
        </a>
      </TableBodyCell>
      <TableBodyCell>{user.email}</TableBodyCell>
      <TableBodyCell>{formatDate(user.createdAt)}</TableBodyCell>
      <TableBodyCell>
        {#if user.active}
            <span class="bg-green-500 text-white rounded px-2 py-1">Yes</span>
            {:else}
            <span class="bg-red-500 text-white rounded px-2 py-1">No</span>
            {/if}
      </TableBodyCell>
      <TableBodyCell>
        {#if Array.isArray(user.role)}
          {#each user.role as role}
            <span class="bg-blue-500 text-white rounded px-2 py-1 mr-2">{role.name}</span>
          {/each}
        {/if}
      </TableBodyCell>
      <TableBodyCell>
        <Button on:click={deleteUser}><Trash color="red" /></Button>
      </TableBodyCell>
    </TableBodyRow>
    {/each}
  </TableBody>
</Table>

  <Paginator
          totalPages={parseInt(users.pages)}
          baseURL={`/users`}
          total={parseInt(users.total)}
          currentPage={parseInt(users.page)}
          on:pageChange={handlePageChange}
  />
  {/if}
