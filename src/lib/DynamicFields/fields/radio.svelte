<script lang="ts">
  import { Radio, Label, Helper } from "flowbite-svelte";
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

  <div class="dynamic-field mb-1">
    {#each options as option, index}
      <Radio
        class="p-3"
        bind:name={field.varName}
        bind:value={model}
        on:change={(e) => onChange(field.varName, e.currentTarget.value)}
      >
        {option}
      </Radio>
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
