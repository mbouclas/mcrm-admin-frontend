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

  const sortSelected = (data) => {
    return data.sort((a, b) => {
      const aIsSelected = selectedValues.some((val) => val.uuid === a.uuid);
      const bIsSelected = selectedValues.some((val) => val.uuid === b.uuid);

      if (aIsSelected && !bIsSelected) {
        return -1;
      }
      if (!aIsSelected && bIsSelected) {
        return 1;
      }
      return 0;
    });
  };

  const reloadData = async (searchValue) => {
    showSelectedValues = false;

    if (searchValue) {
      propertyValues = [];

      const response = await p.searchValues(searchValue);
      if (response) {
        propertyValues = sortSelected(response);
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
    propertyValues = response.propertyValue.map((value) => ({ ...value, property: { ...selectedProperty } }));
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
  };

  const deselctSelectedValue = (uuid) => {
    selectedValues = selectedValues.filter((val) => val.uuid !== uuid);
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
  <div class="w-full mr-4">
    <Search bind:value={searchValue} placeholder="Search property values" />
  </div>
  <div class="px-2 relative">
    <button
      class="bg-blue-700 hover:bg-blue-900 text-white font-bold rounded-full transition duration-200 ease-in-out text-sm"
      on:click|stopPropagation={toggleSelectedValues}
    >
      View selected
    </button>
    {#if selectedValues.length}
      <span class="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 text-sm">
        {selectedValues.length}
      </span>
    {/if}
  </div>
</div>

<div class="flex h-[400px]">
  {#if showSelectedValues}
    <div class="w-full overflow-auto h-[400px]">
      <ul>
        {#each selectedValues as propertyValue}
          <li
            class={`flex border-b-2 border-solid border-gray-300 cursor-pointer p-3 bg-blue-700 text-white`}
            on:click={() => deselctSelectedValue(propertyValue.uuid)}
          >
            <div>
              {propertyValue.property.title}
            </div>
            <div class="px-3">
              <ArrowRight class="outline-none" />
            </div>
            <div>{propertyValue.name}</div>
          </li>
        {/each}
      </ul>
    </div>
  {:else if searchValue}
    <div class="w-full overflow-auto h-[400px]">
      <ul>
        {#each propertyValues as propertyValue}
          <li
            class={`flex border-b-2 border-solid border-gray-300 cursor-pointer p-3 ${
              selectedValues.map((val) => val.uuid).includes(propertyValue.uuid) ? 'bg-blue-700 text-white' : ''
            }`}
            on:click={() => selectPropertyValue(propertyValue.uuid)}
          >
            <div>
              {propertyValue.property.title}
            </div>
            <div class="px-3">
              <ArrowRight class="outline-none" />
            </div>
            <div>{propertyValue.name}</div>
          </li>
        {/each}
      </ul>
    </div>
  {:else}
    <div class="w-1/2 border-r-2 border-gray-600 pr-2">
      <ul>
        {#each properties as property, index}
          <li
            class={`flex border-b-2 border-solid border-gray-300 cursor-pointer p-3 ${
              selectedProperty?.uuid === property?.uuid ? 'bg-blue-700 text-white' : ''
            }`}
            on:click={() => selectProperty(index)}
          >
            <div>
              {property.title}
            </div>
            <div class="px-3">
              <ArrowRight class="outline-none" />
            </div>
          </li>
        {/each}
      </ul>
    </div>
    <div class="w-1/2 pl-2">
      <div class="w-full overflow-auto h-[400px]">
        <ul>
          {#each propertyValues as propertyValue}
            <li
              class={`border-b-2 border-solid border-gray-300 cursor-pointer p-3 ${
                selectedValues.map((val) => val.uuid).includes(propertyValue.uuid) ? 'bg-blue-700 text-white' : ''
              }`}
              on:click={() => selectPropertyValue(propertyValue.uuid)}
            >
              {propertyValue.name}
            </li>
          {/each}
        </ul>
      </div>
    </div>
  {/if}
</div>
