<script lang="ts">
  import { OrderService } from '../services/order/order.service';
  import { Button, Select, Label } from 'flowbite-svelte';
  import Loading from '../../Shared/Loading.svelte';
  import { navigate, useParams } from 'svelte-navigator';
  import { Trash } from 'svelte-heros-v2';
  import { onMount } from 'svelte';
  import getModelPrototypeFromFields from '../../helpers/model-prototype';
  import type { IDynamicFieldConfigBlueprint } from '../../DynamicFields/types';
  import {
    shippingMethodItemSelectorConfig,
    paymentMethodItemSelectorConfig,
    addressItemSelectorConfig,
    customerItemSelectorConfig,
  } from '../../Shared/item-selector-configs';
  import ItemSelectorModal from '../../DynamicFields/fields/item-selector-modal.svelte';
  import Modal from '../../Shared/Modal.svelte';

  import { formatDate } from '../../helpers/dates.js';
  import { moneyFormat } from '../../helpers/money';
  import { app } from '../../stores';

  import ProductAndVariantSelector from '../../Catalogue/Products/ProductAndVariantSelector.svelte';
  const s = new OrderService();
  let loading = false;
  const params = useParams();
  let model;
  let fields: IDynamicFieldConfigBlueprint[] = [];
  export let itemId;
  let shippingAddress;
  let billingAddress;
  let statuses = [];

  let showModal = false;

  app.subscribe((state) => {
    statuses = state.configs.store.orderStatuses;
  });

  onMount(async () => {
    if (itemId) {
      model = await s.findOne(itemId, ['*']);
    } else {
      if ($params.id === 'new') {
        model = getModelPrototypeFromFields(fields);
        model.metaData = {
          cart: {
            items: [],
          },
        };
        model.address = [];
      } else {
        model = await s.findOne($params.id, ['*']);
      }
    }
  });

  $: {
    if (model && Array.isArray(model.address)) {
      shippingAddress = model.address.find((a) => a.type.map((i) => i.toLowerCase()).includes('shipping'));
      billingAddress = model.address.find((a) => a.type.map((i) => i.toLowerCase()).includes('billing'));
    }
  }

  async function changeOrderStatus(e) {
    if ($params.id !== 'new') {
      await s.updateOrderStatus(model.uuid, model.status);
    }
  }

  const onSubmitWithLoader = async (data) => {
    try {
      loading = true;
      await onSubmit(data);
    } finally {
      loading = false;
    }
  };

  const onSubmit = async (data) => {
    if ($params.id === 'new') {
      const order = await s.store(data);
      model = null;
      navigate(`/orders/${order.uuid}`);
      location.reload();
      return null;
    }
    await s.update($params.id, data);
  };

  const removeItem = (index) => {
    model.metaData.cart.items = model.metaData.cart.items.filter((item, itemIndex) => index !== itemIndex);
  };

  function increaseQuantity(index) {
    model.metaData.cart.items[index].quantity += 1;
  }

  function decreaseQuantity(index) {
    if (model.metaData.cart.items[index].quantity > 1) {
      model.metaData.cart.items[index].quantity -= 1;
    }
  }

  const selectUser = (item) => {
    model.user = item;
  };

  async function generatePdf() {
    const pdf = await s.generatePdf(model.uuid)
    window.open(pdf.filename, '_blank')
  }
</script>

<Modal bind:showModal className="w-3/4">
  <div slot="header">Select product</div>
  <div slot="content" class="h-[600px]">
    <ProductAndVariantSelector
      on:selectProduct={(e) => {
        model.metaData.cart.items = [...model.metaData.cart.items, e.detail];
        showModal = false;
      }}
      on:selectVariant={(e) => {
        model.metaData.cart.items = [...model.metaData.cart.items, e.detail];
        showModal = false;
      }}
    />
  </div>
  <div slot="footer">
    <button class="bg-blue-500 px-2 py-1 rounded" autofocus on:click={() => {}}>Select</button>
  </div>
</Modal>

{#if !model}
  <div class="w-full text-center items-center h-64">
    <Loading />
  </div>
{:else}

  <section class="bg-white dark:bg-gray-900">
    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div class="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">
        <h2 class="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white inline-flex">
          {#if $params.id === 'new'}New Order{:else}
            <span>Order {model.orderId}</span>

              <button on:click={generatePdf} title="Generate PDF" class="ml-4 ">
                              <svg class="w-5 h-5" width="512" height="512" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
    <path fill="currentColor" d="M2.5 6.5V6H2v.5h.5Zm4 0V6H6v.5h.5Zm0 4H6v.5h.5v-.5Zm7-7h.5v-.207l-.146-.147l-.354.354Zm-3-3l.354-.354L10.707 0H10.5v.5ZM2.5 7h1V6h-1v1Zm.5 4V8.5H2V11h1Zm0-2.5v-2H2v2h1Zm.5-.5h-1v1h1V8Zm.5-.5a.5.5 0 0 1-.5.5v1A1.5 1.5 0 0 0 5 7.5H4ZM3.5 7a.5.5 0 0 1 .5.5h1A1.5 1.5 0 0 0 3.5 6v1ZM6 6.5v4h1v-4H6Zm.5 4.5h1v-1h-1v1ZM9 9.5v-2H8v2h1ZM7.5 6h-1v1h1V6ZM9 7.5A1.5 1.5 0 0 0 7.5 6v1a.5.5 0 0 1 .5.5h1ZM7.5 11A1.5 1.5 0 0 0 9 9.5H8a.5.5 0 0 1-.5.5v1ZM10 6v5h1V6h-1Zm.5 1H13V6h-2.5v1Zm0 2H12V8h-1.5v1ZM2 5V1.5H1V5h1Zm11-1.5V5h1V3.5h-1ZM2.5 1h8V0h-8v1Zm7.646-.146l3 3l.708-.708l-3-3l-.708.708ZM2 1.5a.5.5 0 0 1 .5-.5V0A1.5 1.5 0 0 0 1 1.5h1ZM1 12v1.5h1V12H1Zm1.5 3h10v-1h-10v1ZM14 13.5V12h-1v1.5h1ZM12.5 15a1.5 1.5 0 0 0 1.5-1.5h-1a.5.5 0 0 1-.5.5v1ZM1 13.5A1.5 1.5 0 0 0 2.5 15v-1a.5.5 0 0 1-.5-.5H1Z"/>
</svg>
              </button>

          {/if}
        </h2>
        {#if model.user}
          <div class="grid sm:grid-cols-4 grid-cols-2 gap-4">
            <p class="font-light text-gray-500 dark:text-gray-400">{model.user.firstName} {model.user.lastName}</p>
            <p class="font-light text-gray-500 dark:text-gray-400">{model.user.email}</p>

            {#if $params.id !== 'new'}
              <p class="font-light text-gray-500 dark:text-gray-400">{formatDate(model.createdAt)}</p>
              <p class="font-semibold text-gray-500 dark:text-gray-400">{moneyFormat(model.total)}</p>
            {/if}
          </div>
        {/if}
        {#if $params.id === 'new'}
          <ItemSelectorModal
            config={customerItemSelectorConfig}
            on:select={(e) => selectUser(e.detail)}
            closeOnSelect={true}
            label="Select User"
            selectMode="single"
          >
            <Button>
              Select user <svg
                class="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"><path fill="currentColor" d="M10 20v-7L2.95 4h18.1L14 13v7h-4Z" /></svg
              >
            </Button>
          </ItemSelectorModal>
        {/if}
        <div class="my-4">
          <Label for="status">Order Status</Label>
          <Select id="status" size="sm" class="mt-2" bind:value={model.status} on:change={changeOrderStatus}>
            {#each statuses as status}
              <option value={status.id} disabled={false}>{status.label}</option>
            {/each}
          </Select>
        </div>
      </div>
      <div class="grid gap-8 md:grid-cols-2">
        {#if model.user}
          <div class="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
            <div class="flex justify-between items-center mb-2">
              <h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Shipping Address</h2>

              <ItemSelectorModal
                config={addressItemSelectorConfig(model.user.uuid)}
                on:select={(e) => {
                  const addressIndex = model.address.findIndex((address) => address.type.includes('shipping'));
                  if (addressIndex !== -1) {
                    const type = [...new Set([...model.address[addressIndex].type, 'shipping'])];

                    model.address[addressIndex] = {
                      ...e.detail,
                      type,
                    };
                    return null;
                  }
                  model.address = [...model.address, { ...e.detail, type: ['shipping'] }];
                }}
                closeOnSelect={true}
                label="Select Shipping address"
                selectMode="single"
              >
                <Button>Edit</Button>
              </ItemSelectorModal>
            </div>

            <div class="flex justify-between items-center">
              <div class="flex items-center space-x-4">
                {#if shippingAddress}
                  <address class="not-italic">
                    <span class="block">{shippingAddress.lastName} {shippingAddress.firstName}</span>
                    <span class="block"
                      >{shippingAddress.street}, {shippingAddress.region}, {shippingAddress.postCode}, {shippingAddress.country}</span
                    >
                    {#if shippingAddress.apartment}
                      <span class="block">Apartment: {shippingAddress.apartment}</span>
                    {/if}
                    {#if shippingAddress.company}
                      <span class="block">Company: {shippingAddress.company}</span>
                    {/if}
                  </address>
                {/if}
              </div>
            </div>
          </div>
        {/if}

        {#if model.user}
          <div class="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
            <div class="flex justify-between items-center mb-2">
              <h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Billing Address</h2>

              <ItemSelectorModal
                config={addressItemSelectorConfig(model.user.uuid)}
                on:select={(e) => {
                  const addressIndex = model.address.findIndex((address) => address.type.includes('billing'));

                  if (addressIndex !== -1) {
                    const type = [...new Set([...model.address[addressIndex].type, 'billing'])];

                    model.address[addressIndex] = {
                      ...e.detail,
                      type,
                    };
                    return null;
                  }

                  model.address = [...model.address, { ...e.detail, type: ['billing'] }];
                }}
                closeOnSelect={true}
                label="Select Billing address"
                selectMode="single"
              >
                <Button>Edit</Button>
              </ItemSelectorModal>
            </div>
            {#if billingAddress}
              <address class="not-italic">
                <span class="block">{billingAddress.lastName} {billingAddress.firstName}</span>
                <span class="block">
                  {billingAddress.street}, {billingAddress.region}, {billingAddress.postCode}, {billingAddress.country}
                </span>
                {#if billingAddress.apartment}
                  <span class="block">Apartment: {billingAddress.apartment}</span>
                {/if}
                {#if billingAddress.company}
                  <span class="block">Company: {billingAddress.company}</span>
                {/if}
              </address>
            {/if}
          </div>
        {/if}
      </div>

      <div class="border-gray-100 border-t my-6" />

      <div class="grid gap-8 md:grid-cols-2">
        <div class="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
          <div class="flex justify-between items-center mb-2">
            <h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Payment Method</h2>

            <ItemSelectorModal
              config={paymentMethodItemSelectorConfig}
              on:select={(e) => {
                model.paymentMethod = e.detail;
              }}
              closeOnSelect={true}
              label="Select Payment Method"
              selectMode="single"
            >
              <Button>Edit</Button>
            </ItemSelectorModal>
          </div>

          {#if model.paymentMethod}
            <div class="flex items-center space-x-4">
              <ul>
                <li>
                  {model.paymentMethod.description}
                </li>
              </ul>
            </div>
          {/if}
        </div>

        <div class="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
          <div class="flex justify-between items-center mb-2">
            <h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Shipping Method</h2>

            <ItemSelectorModal
              config={shippingMethodItemSelectorConfig}
              on:select={(e) => {
                model.shippingMethod = e.detail;
              }}
              closeOnSelect={true}
              label="Select Shipping Method"
              selectMode="single"
            >
              <Button>Edit</Button>
            </ItemSelectorModal>
          </div>

          {#if model.shippingMethod}
            <div class="flex items-center space-x-4">
              <ul>
                <li>{model.shippingMethod.title}</li>
                <li>{model.shippingMethod.shippingTime}</li>
              </ul>
            </div>
          {/if}
        </div>
      </div>

      <div class="border-gray-100 border-t my-6" />

      <div class="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
        <div class="flex gap-x-2 m-3">
          <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Items</h2>

          <button on:click={() => (showModal = true)} class="bg-green-500 rounded p-2">Add item</button>
        </div>

        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3">
                  <span class="sr-only">Image</span>
                </th>
                <th scope="col" class="px-6 py-3"> Product </th>
                <th scope="col" class="px-6 py-3"> SKU </th>
                <th scope="col" class="px-6 py-3"> Properties </th>
                <th scope="col" class="px-6 py-3"> Qty </th>
                <th scope="col" class="px-6 py-3"> Price </th>
                <th scope="col" class="px-6 py-3"> Action </th>
              </tr>
            </thead>
            <tbody>
              {#if model?.metaData?.cart?.items}
                {#each model.metaData.cart.items as item, index}
                  <tr
                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td class="w-32 p-4">
                      <img src={item?.thumb?.url || item?.thumb} />
                    </td>
                    <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      <a href={`/catalogue/products/${item.productId}`}>{item.title}</a>
                    </td>
                    <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      {item?.sku}
                    </td>
                    <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      {#if item.color && item.metaData && item.metaData.color}
                        Color: {item.metaData.color.name}
                      {/if}
                    </td>

                    <td class="px-6 py-4">
                      <div class="flex items-center justify-between">
                        <button on:click={() => decreaseQuantity(index)} class="bg-red-500 text-white px-2 py-1 rounded"
                          >-</button
                        >
                        {item.quantity}
                        <button
                          on:click={() => increaseQuantity(index)}
                          class="bg-green-500 text-white px-2 py-1 rounded">+</button
                        >
                      </div>
                    </td>

                    <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      {moneyFormat(item.price * item.quantity)}
                    </td>

                    <td class="px-6 py-4">
                      <button on:click={() => removeItem(index)} class="text-gray-500"><Trash color="white" /></button>
                    </td>
                  </tr>
                {/each}
              {/if}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
{/if}

<div
  class="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600"
>
  <div class="grid h-full max-w-lg grid-cols-1 mx-auto font-medium">
    {#if loading}
      <button
        class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
      >
        <Loading />
      </button>
    {:else}
      <button
        on:click={() => onSubmitWithLoader(model)}
        type="button"
        class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
      >
        <svg
          class="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          ><path
            fill="currentColor"
            d="M21 7v12q0 .825-.588 1.413T19 21H5q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h12l4 4Zm-9 11q1.25 0 2.125-.875T15 15q0-1.25-.875-2.125T12 12q-1.25 0-2.125.875T9 15q0 1.25.875 2.125T12 18Zm-6-8h9V6H6v4Z"
          /></svg
        >
        <span class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
          >Save</span
        >
      </button>
    {/if}
  </div>
</div>
