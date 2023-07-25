<script lang="ts">
  import { CustomerService } from '../services/customer/customer.service';
  import { AddressService } from '../services/address/address.service';
  import { Input, Modal, Button, Toggle, Select, Label } from 'flowbite-svelte';
  import { useParams } from 'svelte-navigator';
  import { onMount } from 'svelte';
  import getModelPrototypeFromFields from '../../helpers/model-prototype';
  import type { IDynamicFieldConfigBlueprint } from '../../DynamicFields/types';

  const s = new CustomerService();
  const a = new AddressService();

  const addressDefault = {
    firstName: '',
    lastName: '',
    phone: '',
    street: '',
    postCode: '',
    city: '',
    region: '',
    country: '',
    company: '',
    apartment: '',
    type: 'SHIPPING',
  };
  const params = useParams();

  let addressData = addressDefault;

  let isCreateModalOpen = false;
  let customer;
  let fields: IDynamicFieldConfigBlueprint[] = [];
  export let itemId;

  const statuses = [
    { id: 1, label: 'started' },
    { id: 2, label: 'processing' },
    { id: 3, label: 'shipped' },
    { id: 4, label: 'completed' },
    { id: 5, label: 'cancelled' },
  ];

  const paymentStatuses = [
    { id: 1, label: 'in-progress' },
    { id: 2, label: 'failed' },
    { id: 3, label: 'unconfirmed' },
    { id: 4, label: 'paid' },
    { id: 5, label: 'authorized' },
    { id: 6, label: 'refunded' },
  ];

  const shippingStatuses = [
    { id: 1, label: 'in-progress' },
    { id: 2, label: 'open' },
    { id: 3, label: 'done' },
    { id: 4, label: 'cancelled' },
  ];

  const getCustomer = async () => {
    if (itemId) {
      customer = await s.findOne(itemId, ['*']);
    } else {
      if ($params.id === 'new') {
        customer = getModelPrototypeFromFields(fields);
      } else {
        customer = await s.findOne($params.id, ['*']);
      }
    }
  };
  onMount(async () => {
    await getCustomer();
  });

  const cancelCreate = () => {};

  const openCreateModal = () => {
    isCreateModalOpen = true;
  };

  const confirmCreate = async () => {
    await a.store({
      address: addressData,
      userId: $params.id,
    });
    await getCustomer();
    isCreateModalOpen = false;
    addressData = addressDefault;
  };
</script>

<Modal bind:open={isCreateModalOpen}>
  <div class="p-4">
    <h2 class="flowbite-modal-title mb-4 text-xl font-bold">Create Address</h2>

    <div class="mb-4">
      <label for="firstName" class="block mb-2">First Name:</label>
      <Input id="firstName" bind:value={addressData.firstName} required class="w-full" />
    </div>

    <div class="mb-4">
      <label for="lastName" class="block mb-2">Last Name:</label>
      <Input id="lastName" bind:value={addressData.lastName} required class="w-full" />
    </div>

    <div class="mb-4">
      <label for="phone" class="block mb-2">Phone Number:</label>
      <Input id="phone" bind:value={addressData.phone} required class="w-full" />
    </div>

    <div class="mb-4">
      <label for="street" class="block mb-2">Street:</label>
      <Input id="street" bind:value={addressData.street} required class="w-full" />
    </div>

    <div class="mb-4">
      <label for="postCode" class="block mb-2">Post Code:</label>
      <Input id="postCode" bind:value={addressData.postCode} required class="w-full" />
    </div>

    <div class="mb-4">
      <label for="city" class="block mb-2">City:</label>
      <Input id="city" bind:value={addressData.city} required class="w-full" />
    </div>

    <div class="mb-4">
      <label for="region" class="block mb-2">Region:</label>
      <Input id="region" bind:value={addressData.region} required class="w-full" />
    </div>

    <div class="mb-4">
      <label for="country" class="block mb-2">Country:</label>
      <Input id="country" bind:value={addressData.country} required class="w-full" />
    </div>

    <div class="mb-4">
      <label for="company" class="block mb-2">Company:</label>
      <Input id="company" bind:value={addressData.company} required class="w-full" />
    </div>

    <div class="mb-4">
      <label for="apartment" class="block mb-2">Apartment:</label>
      <Input id="apartment" bind:value={addressData.apartment} required class="w-full" />
    </div>

    <div class="mb-4">
      <label for="type" class="block mb-2">Address Type:</label>
      <select id="type" bind:value={addressData.type} required class="w-full">
        <option value="SHIPPING">Shipping</option>
        <option value="BILLING">Billing</option>
        <option value="OTHER">Other</option>
      </select>
    </div>
  </div>

  <svelte:fragment slot="footer">
    <Button on:click={confirmCreate}>Create</Button>
    <Button color="alternative" on:click={cancelCreate}>Cancel</Button>
  </svelte:fragment>
</Modal>

{#if !customer}
  <div class="w-full text-center items-center h-64">
    <p>Loading...</p>
  </div>
{:else}
  <section class="bg-white dark:bg-gray-900">
    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <!-- Customer Info Box -->

      <div class="flex justify-between items-center">
        <div class="w-20" />
        <h2 class="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
          Customer {customer.firstName}
          {customer.lastName}
        </h2>
        <div class="flex items-center w-20">
          <span
            >{customer.active ? 'Active' : 'Inactive'}<span>
              <Toggle color="green" bind:checked={customer.active} />
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
              <p class="font-light text-gray-500 dark:text-gray-400">{customer.uuid}</p>
              <p class="font-light text-gray-500 dark:text-gray-400">{customer.email}</p>
              <p class="font-light text-gray-500 dark:text-gray-400">{customer.firstName}</p>
              <p class="font-light text-gray-500 dark:text-gray-400">{customer.lastName}</p>
              <p class="font-semibold text-gray-500 dark:text-gray-400">Active: {customer.active ? 'Yes' : 'No'}</p>
            </div>
            <Button size="sm">Edit</Button>
          </div>
        </div>
      </div>

      <!-- Addresses Table -->

      <div class="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 mb-10">
        <div class="flex justify-between items-center">
          <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Addresses</h2>
          <Button on:click={openCreateModal}>New Address</Button>
        </div>
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th class="px-6 py-3">UUID</th>
                <th class="px-6 py-3">Street</th>
                <th class="px-6 py-3">City</th>
                <th class="px-6 py-3">Region</th>
                <th class="px-6 py-3">Country</th>
                <th class="px-6 py-3">Phone</th>
              </tr>
            </thead>
            <tbody>
              {#each customer.address as address (address.uuid)}
                <tr
                  class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td class="px-6 py-4">{address.uuid}</td>
                  <td class="px-6 py-4">{address.street}</td>
                  <td class="px-6 py-4">{address.city}</td>
                  <td class="px-6 py-4">{address.region}</td>
                  <td class="px-6 py-4">{address.country}</td>
                  <td class="px-6 py-4">{address.phone}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>

      <div class="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
        <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Orders</h2>
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3">Order ID</th>
                <th scope="col" class="px-6 py-3">Total</th>
                <th scope="col" class="px-6 py-3">Status</th>
                <th scope="col" class="px-6 py-3">Payment Status</th>
                <th scope="col" class="px-6 py-3">Shipping Status</th>
                <th scope="col" class="px-6 py-3">Created At</th>
              </tr>
            </thead>
            <tbody>
              {#each customer.order as order}
                <tr
                  class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td class="px-6 py-4">
                    <a href={`/orders/${order.uuid}`} class="hover:underline">{order.orderId}</a></td
                  >
                  <td class="px-6 py-4">{Number(order.total).toFixed(2)}</td>
                  <td class="px-6 py-4">{statuses.find((status) => status.id === order.status).label}</td>
                  <td class="px-6 py-4">{paymentStatuses.find((status) => status.id === order.paymentStatus).label}</td>
                  <td class="px-6 py-4"
                    >{shippingStatuses.find((status) => status.id === order.shippingStatus).label}</td
                  >

                  <td class="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
{/if}
