<script>
  import { Label, Select } from "flowbite-svelte";
  import MultiSelect from "svelte-multiselect";

  export let model;
  export let multiple;
  export let items;
  //    = [
  //     { value: "us", label: "United States" },
  //     { value: "ca", label: "Canada" },
  //     { value: "fr", label: "France" },
  //   ];
</script>

<!-- {selected} -->
<Label>
  {#if multiple}
    <Select multiple class="mt-2" {items} bind:value={model.select} />
  {:else}
    <!-- TODO: styling -->
    <MultiSelect bind:selected={model.select} options={items} />
  {/if}
</Label>
