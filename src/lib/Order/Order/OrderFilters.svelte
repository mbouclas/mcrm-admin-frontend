<script>
  import { Range, Label, Select, NumberInput } from 'flowbite-svelte';
  import DatePicker from '../../Shared/DatePicker.svelte';
  import { filterStore, updateFilters } from '../../stores';
  import { onMount } from 'svelte';

  $: statusValue = '';

  let fromPriceValue = 1;
  let toPriceValue = 100;

  $: if (fromPriceValue === null) {
    fromPriceValue = 1;
  }
  $: if (toPriceValue === null) {
    toPriceValue = 1;
  }

  let filters = {
    status: statusValue,
  };

  let statuses = [
    { value: '1', name: 'Started' },
    { value: '2', name: 'Processing' },
    { value: '3', name: 'Shipped' },
    { value: '4', name: 'Completed' },
    { value: '5', name: 'Cancelled' },
  ];

  const handleSelect = (e) => {
    statusValue = e.target.value;
  };
  $: updateFilters({ status: statusValue, total: 10 });
  $: console.log($filterStore, 'fstore');
  $: console.log(statusValue, 'val');
</script>

<div class="flex items-start gap-10 py-10">
  <div>
    <Label class="text-2xl mb-4">Filter by price</Label>
    <NumberInput bind:value={fromPriceValue} />
    <p class="mb-8">From: {fromPriceValue}$</p>
    <NumberInput min={1} bind:value={toPriceValue} />
    <p class="mb-8">To: {toPriceValue}$</p>
    <Label class="mb-2 text-2xl"
      >Choose order status
      <Select
        id="select-md"
        size="md"
        items={statuses}
        class="my-6"
        on:change={handleSelect}
        bind:value={statusValue}
      />
    </Label>
  </div>
  <div>
    <Label class="mb-2 text-2xl">Choose date</Label>
    <DatePicker selectedValues={[12, 18]} onSelect={() => 12} />
  </div>
</div>
