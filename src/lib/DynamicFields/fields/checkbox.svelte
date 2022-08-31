<script lang="ts">
  import { Checkbox, Label, Helper } from "flowbite-svelte";
  import type { IDynamicFieldConfigBlueprint } from "../types";

  export let options: string[] = ["I agree", "Dont agree", "Not sure"];
  export let field: IDynamicFieldConfigBlueprint =
    {} as IDynamicFieldConfigBlueprint;
  export let onChange;
  export let model;
  export let label;
  export let helperText;
  export let inputId: string;
  export let classes: string[] = [];
</script>

<div class="mb-6">
  {#if field.label}
    <Label for="success" class="block mb-2 !text-gray-400">{field.label}</Label>
  {/if}

  <div class="dynamic-field p-3">
    {#each options as option, index}
      <Checkbox
        class="p-3"
        bind:name={field.varName}
        bind:value={model}
        on:change={(e) => onChange(field.varName, e.currentTarget.value)}
      >
        {option}
      </Checkbox>
    {/each}
  </div>

  {#if helperText}
    <Helper>{helperText}</Helper>
  {/if}
</div>

<style global>
  .dynamic-field label {
    color: #bfc8e2 !important;
    user-select: none;
    cursor: pointer;
  }
</style>
