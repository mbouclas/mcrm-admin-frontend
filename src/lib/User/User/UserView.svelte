<script lang="ts">
  import { UserService } from '../services/user/user.service';
  import { RoleService } from '../services/role/role.service';
  import { Search, Input, Modal, Button, Toggle, Select, Label } from 'flowbite-svelte';
  import { Trash, PencilSquare } from 'svelte-heros-v2';
  import Paginator from '../../Shared/Paginator.svelte';

  import { useParams } from 'svelte-navigator';
  import { onMount } from 'svelte';
  import getModelPrototypeFromFields from '../../helpers/model-prototype';
  import type { IDynamicFieldConfigBlueprint } from '../../DynamicFields/types';
  import { AuthService } from '../../Auth/auth.service';
  import type { IPagination } from 'src/lib/Shared/models/generic';

  const s = new UserService();
  const r = new RoleService();

  let defaultRoleFilters = {
    limit: 7,
    page: 1,
  };

  let roleItem = null;

  let assignableRoles = {
    data: [],
  } as IPagination<any>;

  let searchRoleText = '';

  $: searchRoles({ name: searchRoleText });

  const userDefault = {
    uuid: null,
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  };

  const params = useParams();

  let userData = userDefault;

  let isUserModalOpen = false;
  let deleteModalOpen = false;

  let manageRoleModalOpen = false;
  let assignRoleModalOpen = false;
  let changePasswordModalOpen = false;
  let user;
  let fields: IDynamicFieldConfigBlueprint[] = [];

  let hasUserRolesGates = AuthService.hasGate('users.menu.roles');
  let hasUserPasswordUpdateGate = AuthService.hasGate('mcms.user.password.update');

  export let itemId;

  const getUser = async () => {
    if (itemId) {
      user = await s.findOne(itemId, ['*']);
    } else {
      if ($params.id === 'new') {
        user = getModelPrototypeFromFields(fields);
      } else {
        user = await s.findOne($params.id, ['role']);
      }
    }
  };
  onMount(async () => {
    await getUser();
  });

  const cancelAddressModal = () => {};

  const openUserModal = () => {
    isUserModalOpen = true;
    userData = {
      uuid: user.uuid,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  };

  const confirmUserModal = async () => {
    await s.update(userData.uuid, userData);

    await getUser();
    isUserModalOpen = false;
    userData = userDefault;
  };

  const handleDeleteModalOpen = async () => {
    deleteModalOpen = true;
  };
  const handleModalCancel = () => {
    deleteModalOpen = false;
  };

  const roleHandleManageModalOpen = async (role, manageType) => {
    manageRoleModalOpen = true;
    roleItem = {
      ...role,
      manageType,
    };
  };
  const openAssignRoleModal = async () => {
    assignRoleModalOpen = true;

    await searchRoles();
  };

  const searchRoles = async (params = {}) => {
    const roles = await r.find({ ...defaultRoleFilters, ...params });
    assignableRoles = roles;
  };

  const manageRole = async (roleUuid, type) => {
    await r.manageRole(user.uuid, roleUuid, type);
    await getUser();
  };

  const handleRolePageChange = async (e) => {
    await searchRoles({ page: e.detail });
  };

  const handleChangePasswordModal = () => {
    changePasswordModalOpen = true;
  };

  const confirmChangePasswordModal = async () => {
    await s.changePassword(user.uuid, userData.password);
    await getUser();
    closeChangePasswordModal();
  };

  const closeChangePasswordModal = async () => {
    userData = userDefault;
    changePasswordModalOpen = false;
  };
</script>

<Modal bind:open={changePasswordModalOpen}>
  <div class="p-4">
    <h2 class="flowbite-modal-title mb-4 text-xl font-bold">Change user password</h2>

    <div class="mb-4">
      <label for="firstName" class="block mb-2">New password :</label>
      <Input id="firstName" bind:value={userData.password} required class="w-full" />
    </div>
  </div>

  <svelte:fragment slot="footer">
    <Button on:click={confirmChangePasswordModal}>Change</Button>
    <Button color="alternative" on:click={closeChangePasswordModal}>Cancel</Button>
  </svelte:fragment>
</Modal>

<Modal bind:open={isUserModalOpen}>
  <div class="p-4">
    <h2 class="flowbite-modal-title mb-4 text-xl font-bold">Update user info</h2>

    <div class="mb-4">
      <label for="firstName" class="block mb-2">Email:</label>
      <Input id="firstName" bind:value={userData.email} required class="w-full" />
    </div>

    <div class="mb-4">
      <label for="firstName" class="block mb-2">First Name:</label>
      <Input id="firstName" bind:value={userData.firstName} required class="w-full" />
    </div>

    <div class="mb-4">
      <label for="lastName" class="block mb-2">Last Name:</label>
      <Input id="lastName" bind:value={userData.lastName} required class="w-full" />
    </div>
  </div>

  <svelte:fragment slot="footer">
    <Button on:click={confirmUserModal}>Create</Button>
    <Button color="alternative" on:click={cancelAddressModal}>Cancel</Button>
  </svelte:fragment>
</Modal>

<Modal style="height: 800px;" size="xl" title="Assign roles to user" bind:open={assignRoleModalOpen} outsideclose>
  <div class="relative flex flex-col h-full overflow-x-auto shadow-md sm:rounded-lg">
    <div class="my-2">
      <Search bind:value={searchRoleText} placeholder="Search roles" />
    </div>

    <div class="flex-grow">
      <table class="w-full table-fixed text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th class="px-6 py-4 w-1/3">Name</th>
            <th class="px-6 py-4 w-1/3">Level</th>
            <th scope="col" class="relative py-3.5 px-4 w-1/3">
              <span class="sr-only">Edit</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {#each assignableRoles.data as role (role.uuid)}
            <tr
              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 h-16"
            >
              <td class="px-6 py-4 w-1/3">{role.name}</td>
              <td class="px-6 py-4 w-1/3">{role.level}</td>
              <td class="px-6 py-4 w-1/3">
                {#if user.role.some((userRole) => userRole.uuid === role.uuid)}
                  <button
                    on:click={() => roleHandleManageModalOpen(role, 'UNASSIGN')}
                    class="bg-red-500 rounded p-2 text-white">Unassign</button
                  >
                {:else}
                  <button
                    on:click={() => roleHandleManageModalOpen(role, 'ASSIGN')}
                    class="bg-blue-500 rounded p-2 text-white">Assign</button
                  >
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <div class="mt-auto">
      <Paginator
        totalPages={parseInt(assignableRoles.pages)}
        baseURL={`/roles`}
        total={parseInt(assignableRoles.total)}
        currentPage={parseInt(assignableRoles.page)}
        on:pageChange={handleRolePageChange}
      />
    </div>
  </div>
</Modal>

<Modal title="Confirm unassign role" bind:open={manageRoleModalOpen} autoclose outsideclose>
  <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
    Are you sure you want to <span class="text-lg font-bold"
      >{roleItem.manageType === 'ASSIGN' ? 'assign' : 'unassign'}</span
    >
    role
    <span class="text-lg font-bold">{roleItem.name}</span>
    from
    <span class="text-lg font-bold">{user.firstName} {user.lastName}</span>?
  </p>
  <svelte:fragment slot="footer">
    <Button on:click={() => manageRole(roleItem.uuid, roleItem.manageType)}>Confirm</Button>
    <Button on:click={() => handleModalCancel()} color="alternative">Cancel</Button>
  </svelte:fragment>
</Modal>

{#if !user}
  <div class="w-full text-center items-center h-64">
    <p>Loading...</p>
  </div>
{:else}
  <section class="bg-white dark:bg-gray-900">
    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <!-- User Info Box -->

      <div class="flex justify-between items-center">
        <div class="w-20" />
        <h2 class="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
          User {user.firstName}
          {user.lastName}
        </h2>
        <div class="flex items-center w-20">
          {#if hasUserPasswordUpdateGate}
            <button on:click={() => handleChangePasswordModal()} class="text-gray-500">Change password</button>
          {/if}
          <button on:click={() => handleDeleteModalOpen()} class="text-gray-500"><Trash color="white" /></button>
        </div>
      </div>
      <div class="flex my-10">
        <div
          class="flex-1 p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700"
        >
          <div class="flex justify-between items-start">
            <div>
              <p class="font-light text-gray-500 dark:text-gray-400">{user.uuid}</p>
              <p class="font-light text-gray-500 dark:text-gray-400">{user.email}</p>
              <p class="font-light text-gray-500 dark:text-gray-400">{user.firstName}</p>
              <p class="font-light text-gray-500 dark:text-gray-400">{user.lastName}</p>
              <p class="font-semibold text-gray-500 dark:text-gray-400">Active: {user.active ? 'Yes' : 'No'}</p>
            </div>
            <Button size="md" on:click={() => openUserModal()}>Edit</Button>
          </div>
        </div>
      </div>

      {#if hasUserRolesGates}
        <div
          class="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 mb-10"
        >
          <div class="flex justify-between items-center">
            <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Roles</h2>
            <button class="text-white bg-blue-500 rounded p-2 my-2" on:click={() => openAssignRoleModal()}
              >Assign role</button
            >
          </div>
          <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th class="px-6 py-3">Name</th>
                  <th class="px-6 py-3">Description</th>
                  <th class="px-6 py-3">Level</th>
                  <th class="px-6 py-3">Created at</th>
                  <th scope="col" class="relative py-3.5 px-4">
                    <span class="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {#each user.role as role (role.uuid)}
                  <tr
                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td class="px-6 py-4">{role.name}</td>
                    <td class="px-6 py-4">{role.description}</td>
                    <td class="px-6 py-4">{role.level}</td>
                    <td class="px-6 py-4">{role.createdAt}</td>
                    <td class="px-6 py-4">
                      <button
                        on:click={() => roleHandleManageModalOpen(role, 'UNASSIGN')}
                        class="text-white bg-red-500 rounded p-2">Unassign</button
                      >
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {/if}
    </div>
  </section>
{/if}
