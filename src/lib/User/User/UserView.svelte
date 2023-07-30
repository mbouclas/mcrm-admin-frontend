<script lang="ts">
  import { UserService } from '../services/user/user.service';
  import { Input, Modal, Button, Toggle, Select, Label } from 'flowbite-svelte';
  import { Trash, PencilSquare } from 'svelte-heros-v2';

  import { useParams } from 'svelte-navigator';
  import { onMount } from 'svelte';
  import getModelPrototypeFromFields from '../../helpers/model-prototype';
  import type { IDynamicFieldConfigBlueprint } from '../../DynamicFields/types';

  const s = new UserService();

  let deleteItemId = null;

  const userDefault = {
    uuid: null,
    email: '',
    firstName: '',
    lastName: '',
  };

  const params = useParams();

  let userData = userDefault;

  let isUserModalOpen = false;
  let deleteModalOpen = true;
  let user;
  let fields: IDynamicFieldConfigBlueprint[] = [];
  export let itemId;

  const getUser = async () => {
    if (itemId) {
      user = await s.findOne(itemId, ['*']);
    } else {
      if ($params.id === 'new') {
        user = getModelPrototypeFromFields(fields);
      } else {
        user = await s.findOne($params.id, ['address', 'orders']);
      }
    }
  };
  onMount(async () => {
    await getUser();
  });

  const cancelAddressModal = () => {};

  const openUserModal = () => {
    isUserModalOpen = true;
    console.log(user);
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
    await a.deleteRow(deleteItemId);
    await getUser();
    deleteItemId = null;
  };

  const handleDeleteModalOpen = async (id) => {
    deleteModalOpen = true;
    deleteItemId = id;
  };
  const handleModalCancel = () => {
    deleteModalOpen = false;
    deleteItemId = null;
  };

  const updateUser = async (user) => {
    await s.update(user.uuid, user);
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

<Modal title="Confirm delete" bind:open={deleteModalOpen} autoclose outsideclose>
  <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">Are you sure you want to delete this item?</p>
  <svelte:fragment slot="footer">
    <Button on:click={() => handleDelete()}>Confirm</Button>
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
          <span
            >{user.active ? 'Active' : 'Inactive'}<span>
              <Toggle
                on:click={(e) => updateUser({ ...user, active: !user.active })}
                color="green"
                checked={user.active}
              />
            </span></span
          >
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
    </div>
  </section>
{/if}
