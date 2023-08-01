<script lang="ts">
  import { useNavigate } from 'svelte-navigator';
  import { UserService } from '../services/user/user.service';
  import { RoleService } from '../services/role/role.service';
  import { Input, Modal, Button, Toggle, Select, Label } from 'flowbite-svelte';
  import { Trash, PencilSquare } from 'svelte-heros-v2';

  import { useParams } from 'svelte-navigator';
  import { onMount } from 'svelte';
  import getModelPrototypeFromFields from '../../helpers/model-prototype';
  import type { IDynamicFieldConfigBlueprint } from '../../DynamicFields/types';
  import { AuthService } from '../../Auth/auth.service';

  const navigate = useNavigate();

  const s = new UserService();
  const r = new RoleService();

  let deleteRoleItem = null;
  let assignableRoles = [];

  const userDefault = {
    uuid: null,
    email: '',
    firstName: '',
    lastName: '',
  };

  const params = useParams();

  let userData = userDefault;

  let isUserModalOpen = false;
  let deleteModalOpen = false;

  let unassignRoleModalOpen = false;
  let assignRoleModalOpen = false;
  let user;
  let fields: IDynamicFieldConfigBlueprint[] = [];

  let hasUserRolesGates = AuthService.hasGate('users.menu.roles');

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

  const handleDelete = async () => {
    await s.deleteRow($params.id);

    navigate('/users/list');
  };

  const handleDeleteModalOpen = async () => {
    deleteModalOpen = true;
  };
  const handleModalCancel = () => {
    deleteModalOpen = false;
  };

  const roleHandleDelete = async () => {
    await s.deleteRow(deleteRoleItem.uuid);
    await getUser();
    deleteRoleItem = null;
  };

  const roleHandleDeleteModalOpen = async (role) => {
    unassignRoleModalOpen = true;
    deleteRoleItem = role;
  };
  const roleHandleModalCancel = () => {
    deleteModalOpen = false;
    deleteRoleItem = null;
  };

  const openAssignRoleModal = async () => {
    assignRoleModalOpen = true;

    const roles = await r.find();
    assignableRoles = roles.data;
  };

  const manageRole = async (roleUuid, type) => {
    await r.manageRole(user.uuid, roleUuid, type);
    await getUser();
  };
</script>

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

<Modal title="Confirm unassign role" bind:open={unassignRoleModalOpen} autoclose outsideclose>
  <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
    Are you sure you want to unassign role <span>{deleteRoleItem.name}</span> from
    <span>{user.firstName} {user.lastName}</span>?
  </p>
  <svelte:fragment slot="footer">
    <Button on:click={() => manageRole(deleteRoleItem.uuid, 'UNASSIGN')}>Confirm</Button>
    <Button on:click={() => handleModalCancel()} color="alternative">Cancel</Button>
  </svelte:fragment>
</Modal>

<Modal title="Assign roles to user" bind:open={assignRoleModalOpen} autoclose outsideclose>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <tbody>
        {#each assignableRoles as role (role.uuid)}
          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td class="px-6 py-4">{role.name}</td>
            <td class="px-6 py-4">{role.level}</td>
            <td class="px-6 py-4">
              <button on:click={() => manageRole(role.uuid, 'ASSIGN')} class="text-gray-200">Assign</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
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
            <Button on:click={() => openAssignRoleModal()}>Assign role</Button>
          </div>
          <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th class="px-6 py-3">UUID</th>
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
                    <td class="px-6 py-4">{role.uuid}</td>
                    <td class="px-6 py-4">{role.name}</td>
                    <td class="px-6 py-4">{role.description}</td>
                    <td class="px-6 py-4">{role.level}</td>
                    <td class="px-6 py-4">{role.createdAt}</td>
                    <td class="px-6 py-4">
                      <button on:click={() => roleHandleDeleteModalOpen(role)} class="text-gray-200">Unassign</button>
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