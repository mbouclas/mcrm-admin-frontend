<script>
  import { Range, Label, Select, NumberInput } from 'flowbite-svelte';
  import DatePicker from '../../Shared/DatePicker.svelte';
  import { filterStore } from '../../stores';
  import { onMount, createEventDispatcher } from 'svelte';
  import Modal from '../../Shared/Modal.svelte';

  const dispatch = createEventDispatcher();

  $: statusValue = '';

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
    }
    if (showDatePicker === 'to') {
      toDate = date;
    }
    openDatePicker = false;
    showDatePicker = null;
  };
</script>

<div class="flex items-start gap-10 py-10">
  <div>
    <Label class="text-2xl mb-4">Filter by price</Label>
    <NumberInput name="fromPrice" bind:value={fromPriceValue} on:change={handleSelect} />
    <p class="mb-8">From: {fromPriceValue}$</p>
    <NumberInput name="toPrice" min={1} bind:value={toPriceValue} />
    <p class="mb-8">To: {toPriceValue}$</p>
  </div>
  <div>
    <Label class="mb-2 text-2xl">Choose date</Label>
    <div class="flex flex-col gap-1">
      <button
        class="bg-blue-500 rounded p-2"
        on:click={() => {
          openDatePicker = true;
          showDatePicker = 'from';
        }}>From</button
      >
      <button
        class="bg-blue-500 rounded p-2"
        on:click={() => {
          openDatePicker = true;
          showDatePicker = 'to';
        }}>To</button
      >
      {#if fromDate || toDate}
        <Label class="mb-2 text-2xl">Dates</Label>
      {/if}
      <p>
        {#if fromDate}
          <div class="bg-gray-700 rounded p-1 text-center">
            From: {new Date(fromDate).toDateString()}
          </div>
        {/if}
      </p>
      <p>
        {#if toDate}
          <div class="bg-gray-700 rounded p-1 text-center">
            To: {new Date(toDate).toDateString()}
          </div>
        {/if}
      </p>
    </div>

    <Modal bind:showModal={openDatePicker}>
      <div slot="header">Pick Date</div>
      <div slot="content">
        <DatePicker onSelect={handleDateSelect} />
      </div>
    </Modal>
  </div>
</div>
