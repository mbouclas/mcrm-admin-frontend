<script>
  import { Label, NumberInput, Search } from 'flowbite-svelte';
  import DatePicker from './DatePicker.svelte';
  import { createEventDispatcher } from 'svelte';
  import Modal from './Modal.svelte';

  const dispatch = createEventDispatcher();

  export let filterBySearch = true;
  export let filterByPrice = true;
  export let filterByDate = true;

  export let search = '';

  let fromPriceValue = 1;
  $: fromPriceValue && dispatch('change', { key: 'priceFrom', value: fromPriceValue });

  let toPriceValue = 100;
  $: toPriceValue && dispatch('change', { key: 'priceTo', value: toPriceValue });

  let showDatePicker = null;
  let openDatePicker = false;

  let fromDate = null;
  $: fromDate && dispatch('change', { key: 'createdAtFrom', value: fromDate });

  let toDate = null;
  $: toDate && dispatch('change', { key: 'createdAtTo', value: toDate });

  const handleSelect = (e) => {
    const type = e.target.name;
    if (type === 'fromPrice') {
      fromPriceValue = e.target.value;
    }
    if (type === 'toPrice') {
      toPriceValue = e.target.value;
    }
  };
  const handleDateSelect = (date) => {
    if (showDatePicker === 'from') {
      fromDate = date;
      toDate = null;
    }
    if (showDatePicker === 'to') {
      toDate = date;
    }
    openDatePicker = false;
    showDatePicker = null;
  };
</script>

<div class="flex flex-col justify-between items-start gap-10 py-10">
  {#if filterBySearch}
    <Search bind:value={search} placeholder="Search..." />
  {/if}

  <slot name="fields" />

  {#if filterByPrice}
    <div>
      <Label class="text-2xl mb-4 flowbite-modal-title">Filter by price</Label>
      <NumberInput name="fromPrice" bind:value={fromPriceValue} on:change={handleSelect} />
      <p class="mb-8 flowbite-modal-title">From: {fromPriceValue === null ? '' : fromPriceValue}€</p>
      <NumberInput name="toPrice" min={1} bind:value={toPriceValue} />
      <p class="mb-8 flowbite-modal-title">To: {toPriceValue === null ? '' : toPriceValue}€</p>
    </div>
  {/if}
  {#if filterByDate}
    <div>
      <Label class="mb-2 text-2xl flowbite-modal-title">Choose date</Label>
      <div class="flex gap-1">
        <button
          class="bg-blue-500 min-w-[100px] rounded p-2"
          on:click={() => {
            openDatePicker = true;
            showDatePicker = 'from';
          }}>From</button
        >
        <button
          class="bg-blue-500 min-w-[100px] rounded p-2"
          on:click={() => {
            openDatePicker = true;
            showDatePicker = 'to';
          }}>To</button
        >
      </div>
      {#if fromDate || toDate}
        <Label class="my-2 text-2xl flowbite-modal-title">Dates</Label>
      {/if}
      <p class="py-1">
        {#if fromDate}
          <div class="bg-gray-700 rounded p-1 text-center flowbite-modal-title">
            From: {new Date(fromDate).toDateString()}
          </div>
        {/if}
      </p>
      <p class="py-1">
        {#if toDate}
          <div class="bg-gray-700 rounded p-1 text-center flowbite-modal-title">
            To: {new Date(toDate).toDateString()}
          </div>
        {/if}
      </p>

      <Modal bind:showModal={openDatePicker}>
        <div class="flowbite-modal-title" slot="header">Pick Date</div>
        <div slot="content">
          <DatePicker minLimitDate={showDatePicker === 'to' ? fromDate : null} onSelect={handleDateSelect} />
        </div>
      </Modal>
    </div>
  {/if}
</div>
