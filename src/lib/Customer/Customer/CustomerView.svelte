<script lang="ts">
  import { CustomerService } from '../services/customer/customer.service';
  import { Button, Select, Label } from 'flowbite-svelte';
  import Loading from '../../Shared/Loading.svelte';
  import { useParams } from 'svelte-navigator';
  import { onMount } from 'svelte';
  import getModelPrototypeFromFields from '../../helpers/model-prototype';
  import type { IDynamicFieldConfigBlueprint } from '../../DynamicFields/types';
  import { formatDate } from '../../helpers/dates.js';
  import { moneyFormat } from '../../helpers/money';
  import { app, setNotificationAction } from '../../stores';

  const s = new CustomerService();
  const params = useParams();
  let customer;
  let fields: IDynamicFieldConfigBlueprint[] = [];
  let relationships: any[] = [];
  export let itemId;

  onMount(async () => {
    if (itemId) {
      customer = await s.findOne(itemId, ['*']);
    } else {
      if ($params.id === 'new') {
        customer = getModelPrototypeFromFields(fields);
      } else {
        customer = await s.findOne($params.id, ['*']);
      }
    }
  });
</script>

{#if !customer}
  <div class="w-full text-center items-center h-64">
    <p>Loading...</p>
  </div>
{:else}
  <section class="bg-white dark:bg-gray-900">
    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <!-- Customer Info Box -->
      <div class="flex justify-center">
        <h2 class="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
          Customer {customer.firstName}
          {customer.lastName}
        </h2>
      </div>

      <div class="flex mb-10">
        <div
          class="flex-1 p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700"
        >
          <div class="flex justify-between items-start">
            <div>
              <p class="font-light text-gray-500 dark:text-gray-400">{customer.email}</p>
              <p class="font-light text-gray-500 dark:text-gray-400">{customer.uuid}</p>
              <p class="font-light text-gray-500 dark:text-gray-400">{customer.phone}</p>
              <p class="font-semibold text-gray-500 dark:text-gray-400">Customer type: {customer.type}</p>
              <p class="font-semibold text-gray-500 dark:text-gray-400">Active: {customer.active ? 'Yes' : 'No'}</p>
            </div>
            <Button size="sm">Edit</Button>
          </div>
        </div>

        <div class="flex-1">
          <!-- Empty div with 50% width -->
        </div>
      </div>

      <!-- Addresses Table -->
      <div class="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 mb-10">
        <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Addresses</h2>
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

      <!-- Orders Table -->
      <div class="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
        <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Orders</h2>
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
              {#each customer.order as order (order.uuid)}
                <tr
                  class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td class="px-6 py-4">{order.uuid}</td>
                  <td class="px-6 py-4">{order.street}</td>
                  <td class="px-6 py-4">{order.city}</td>
                  <td class="px-6 py-4">{order.region}</td>
                  <td class="px-6 py-4">{order.country}</td>
                  <td class="px-6 py-4">{order.phone}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
{/if}
