<script lang="ts">
  import { RoleService } from '../services/role/role.service';
  import { Input, Modal, Button } from 'flowbite-svelte';
  import { Trash } from 'svelte-heros-v2';
  import { navigate } from 'svelte-navigator';

  import { useParams } from 'svelte-navigator';
  import { onMount } from 'svelte';
  import { AuthService } from '../../Auth/auth.service';

  const r = new RoleService();

  const roleDefault = {
    uuid: null,
    name: '',
    level: 0,
    description: '',
  };

  const params = useParams();

  let roleData = roleDefault;

  let isRoleModalOpen = false;
  let deleteRoleModalOpen = false;

  let role;

  let hasRoleDeleteGate = AuthService.hasGate('mcms.admin.role.delete');

  const getRole = async () => {
    role = await r.findOne($params.id, ['*']);
  };
  onMount(async () => {
    await getRole();
  });

  const cancelAddressModal = () => {};

  const openRoleModal = () => {
    isRoleModalOpen = true;
    roleData = {
      uuid: role.uuid,
      name: role.displayName,
      level: role.level,
      description: role.description,
    };
  };

  const confirmRoleModal = async () => {
    await r.update(roleData.uuid, roleData);

    await getRole();
    isRoleModalOpen = false;
    roleData = roleDefault;
  };

  const handleDeleteModalOpen = async () => {
    deleteRoleModalOpen = true;
  };

  const deleteRole = async () => {
    await r.delete(role.uuid);
    navigate('/roles/list');
  };
</script>

<Modal bind:open={isRoleModalOpen}>
  <div class="p-4">
    <h2 class="flowbite-modal-title mb-4 text-xl font-bold">Update role info</h2>

    <div class="mb-4">
      <label for="firstName" class="block mb-2">Name:</label>
      <Input id="firstName" bind:value={roleData.name} required class="w-full" />
    </div>

    <div class="mb-4">
      <label for="firstName" class="block mb-2">Level:</label>
      <Input id="firstName" bind:value={roleData.level} required class="w-full" />
    </div>

    <div class="mb-4">
      <label for="lastName" class="block mb-2">Description:</label>
      <Input id="lastName" bind:value={roleData.description} required class="w-full" />
    </div>
  </div>

  <svelte:fragment slot="footer">
    <Button on:click={confirmRoleModal}>Create</Button>
    <Button color="alternative" on:click={cancelAddressModal}>Cancel</Button>
  </svelte:fragment>
</Modal>

<Modal title="Confirm delete role" bind:open={deleteRoleModalOpen} autoclose outsideclose>
  <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
    Are you sure you want to <span class="text-lg font-bold">permanently delete</span>
    role
    <span class="text-lg font-bold">{role.displayName}</span>?
  </p>
  <svelte:fragment slot="footer">
    <Button on:click={() => deleteRole()}>Confirm</Button>
    <Button color="alternative">Cancel</Button>
  </svelte:fragment>
</Modal>

{#if !role}
  <div class="w-full text-center items-center h-64">
    <p>Loading...</p>
  </div>
{:else}
  <section class="bg-white dark:bg-gray-900">
    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div class="flex justify-between items-center">
        <div class="w-40" />
        <h2 class="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
          Role {role.displayName}
        </h2>
        <div class="flex items-center w-40">
          {#if hasRoleDeleteGate}
            <button on:click={() => handleDeleteModalOpen()} class="text-gray-500"><Trash color="white" /></button>
          {/if}
        </div>
      </div>
      <div class="flex my-10">
        <div
          class="flex-1 p-3 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700"
        >
          <div class="flex flex-col md:flex-row justify-between items-start">
            <div>
              <p class="font-semibold text-gray-600 dark:text-gray-400 mb-1">Uuid:</p>
              <p class="font-light text-gray-500 dark:text-gray-400 mb-3">{role.uuid}</p>
              <p class="font-semibold text-gray-600 dark:text-gray-400 mb-1">Name:</p>
              <p class="font-light text-gray-500 dark:text-gray-400 mb-3">{role.displayName}</p>
              <p class="font-semibold text-gray-600 dark:text-gray-400 mb-1">Description:</p>
              <p class="font-light text-gray-500 dark:text-gray-400 mb-3">{role.description}</p>
              <p class="font-semibold text-gray-600 dark:text-gray-400 mb-1">Level:</p>
              <p class="font-light text-gray-500 dark:text-gray-400">{role.level}</p>
            </div>
            <div class="flex mt-4 md:mt-0">
              <Button size="md" on:click={() => openRoleModal()}>Edit</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
{/if}
