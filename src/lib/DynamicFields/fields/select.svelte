<script lang="ts">
  import { Label, Select } from "flowbite-svelte";
  import MultiSelect from "svelte-multiselect";
  import type { IDynamicFieldConfigBlueprint } from "../types";

  export let field: IDynamicFieldConfigBlueprint =
    {} as IDynamicFieldConfigBlueprint;

  export let model;
  export let multiple;
  export let items = [
    { value: "us", name: "United States", label: "United States" },
    { value: "ca", name: "Canada", label: "Canada" },
    { value: "fr", name: "France", label: "France" },
  ];
</script>

{#if field.label}
  <Label for="success" class="block mb-2 !text-gray-400">{field.label}</Label>
{/if}

<Label>
  {#if multiple}
    <Select class="mt-2" {items} bind:value={model.select} />
  {:else}
    <!-- TODO: styling -->
    <div class="custom-multiselect">
      <MultiSelect bind:selected={model.select} options={items} />
    </div>
  {/if}
</Label>

<style global>
  .custom-multiselect .multiselect {
    background: white;
    border: none;
    height: 42px;
    padding: 6px;
    border-radius: 10px;
  }
</style>
