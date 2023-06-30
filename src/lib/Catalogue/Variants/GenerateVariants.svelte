<script lang="ts">
  import { onMount } from 'svelte';
  import { useParams } from 'svelte-navigator';

  import { VariantsService } from '../services/variants/variants.service';
  import { PropertiesService } from '../services/properties/properties.service';
  import { Search } from 'flowbite-svelte';
  import Table from './VariantsTable.svelte';
  import GenerateVariants from './GenerateVariants.svelte';

  const p = new PropertiesService();

  let propertyValues = [];
  let properties = [];
  let selectedValues = [];
  let selectedProperty = null;
  let searchValue = '';

  $: selectedProperty?.uuid && findValuesByPropertyId(selectedProperty.uuid);

  const reloadData = async (searchValue) => {
    if (searchValue) {
    } else {
      const response = await p.find();
      if (response.data) {
        properties = response.data;
      }
    }
  };

  const findValuesByPropertyId = async (id) => {
    const response = await p.findOne(selectedProperty.uuid, ['*']);
    propertyValues = response.propertyValue;
    console.log(response);
  };
  const selectProperty = (index) => {
    selectedProperty = properties[index];
  };

  const selectPropertyValue = (index) => {
    selectedValues = [...selectedValues, propertyValues[index]];
  };

  onMount(async () => {
    reloadData(searchValue);
  });

  $: console.log(propertyValues);
</script>

<Search value={searchValue} placeholder="Search property values" class="mb-4" />

<div class="flex">
  <div class="w-1/2 border-r-2 border-gray-200 pr-2">
    <ul>
      {#each properties as property, index}
        <li
          class={`cursor-pointer p-2 ${selectedProperty === property ? 'bg-blue-400' : ''}`}
          on:click={() => selectProperty(index)}
        >
          {property.title}
        </li>
      {/each}
    </ul>
  </div>
  <div class="w-1/2 pl-2">
    <ul>
      {#each propertyValues as propertyValue, index}
        <li
          class={`cursor-pointer p-2 ${selectedValues.includes(propertyValue) ? 'bg-blue-400' : ''}`}
          on:click={() => selectPropertyValue(index)}
        >
          {propertyValue.name}
        </li>
      {/each}
    </ul>
  </div>
</div>
