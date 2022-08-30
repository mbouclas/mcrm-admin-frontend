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
  <div class="dynamic-field">
    {#if !multiple}
      <Select class="mt-2" {items} bind:value={model.select} />
    {:else}
      <!-- TODO: styling -->
      <div class="custom-multiselect">
        <MultiSelect bind:selected={model.select} options={items} />
      </div>
    {/if}
  </div>
</Label>

<style global>
  .custom-multiselect .multiselect {
    background-color: #2e3446 !important;
    border: 1px solid #32394e !important;
    color: #bfc8e2 !important;
    border: none;
    height: 42px;
    padding: 6px;
    border-radius: 10px;
  }
  .custom-multiselect .multiselect {
    background-color: #2e3445 !important;
  }

  .dynamic-field select {
    background-color: #2e3446 !important;
    border: 1px solid #32394e !important;
    color: #bfc8e2 !important;
    outline: none !important;
    box-shadow: none !important;
  }
</style>
