<script lang="ts">
  import { onMount } from 'svelte';

  import { PropertiesService } from '../services/properties/properties.service';
  import { Search, Button } from 'flowbite-svelte';
  import { ArrowRight } from 'svelte-heros-v2';

  const p = new PropertiesService();

  let propertyValues = [];
  let properties = [];
  let selectedValues = [];
  let selectedProperty = null;
  let searchValue = '';
  let showSelectedValues = false;

  $: selectedProperty?.uuid && findValuesByPropertyId();

  $: reloadData(searchValue);

  const reloadData = async (searchValue) => {
    showSelectedValues = false;

    if (searchValue) {
      propertyValues = [];

      const response = await p.searchValues(searchValue);
      if (response) {
        propertyValues = response;
      }
    } else {
      propertyValues = [];
      const response = await p.find();
      if (response.data) {
        properties = response.data;
        selectedProperty = selectedProperty;
      }
    }
  };

  const findValuesByPropertyId = async () => {
    const response = await p.findOne(selectedProperty.uuid, ['*']);
    propertyValues = response.propertyValue;
  };
  const selectProperty = (index) => {
    selectedProperty = properties[index];
  };

  const selectPropertyValue = (uuid) => {
    const selectedValueIndex = propertyValues.findIndex((val) => val.uuid === uuid);
    if (selectedValueIndex === -1) {
      return;
    }

    const selectedValue = propertyValues[selectedValueIndex];
    const valueIsSelected = selectedValues.some((val) => val.uuid === selectedValue.uuid);

    if (valueIsSelected) {
      selectedValues = selectedValues.filter((val) => val.uuid !== selectedValue.uuid);
    } else {
      selectedValues = [...selectedValues, selectedValue];
    }

    if (!selectedValues.length) {
      showSelectedValues = false;
    }
  };

  const toggleSelectedValues = () => {
    showSelectedValues = !showSelectedValues;
  };

  onMount(async () => {
    reloadData(searchValue);
  });
</script>

<div class="mb-4 flex items-center">
  <Search bind:value={searchValue} placeholder="Search property values" />
  <button on:click|stopPropagation={toggleSelectedValues}> View Selected </button>
</div>

<div class="flex h-[350px]">
  {#if showSelectedValues}
    <ul class="w-full">
      {#each selectedValues as propertyValue}
        <li class={`cursor-pointer p-2 bg-blue-400`} on:click={() => selectPropertyValue(propertyValue.uuid)}>
          {propertyValue.name}
        </li>
      {/each}
    </ul>
  {:else if searchValue}
    <ul>
      {#each propertyValues as propertyValue}
        <li
          class={`cursor-pointer p-2 ${
            selectedValues.map((val) => val.uuid).includes(propertyValue.uuid) ? 'bg-blue-400' : ''
          }`}
          on:click={() => selectPropertyValue(propertyValue.uuid)}
        >
          {propertyValue.property.title} -> {propertyValue.name}
        </li>
      {/each}
    </ul>
  {:else}
    <div class="w-1/2 border-r-2 border-gray-200 pr-2">
      <ul>
        {#each properties as property, index}
          <li
            class={`cursor-pointer p-2 ${selectedProperty?.uuid === property?.uuid ? 'bg-blue-400' : ''}`}
            on:click={() => selectProperty(index)}
          >
            <div class="flex">
              {property.title}
              <div class="px-3">
                <ArrowRight />
              </div>
            </div>
          </li>
        {/each}
      </ul>
    </div>
    <div class="w-1/2 pl-2">
      <ul>
        {#each propertyValues as propertyValue}
          <li
            class={`cursor-pointer p-2 ${
              selectedValues.map((val) => val.uuid).includes(propertyValue.uuid) ? 'bg-blue-400' : ''
            }`}
            on:click={() => selectPropertyValue(propertyValue.uuid)}
          >
            {propertyValue.name}
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>
