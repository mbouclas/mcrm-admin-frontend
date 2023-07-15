<script lang="ts">
  import { Input, Label, Helper } from "flowbite-svelte";
  import type { IDynamicFieldConfigBlueprint } from "../types";

  export let field: IDynamicFieldConfigBlueprint =
    {} as IDynamicFieldConfigBlueprint;
  export let onChange;
  export let onInput;
  export let model;
  export let placeholder;
  export let label;
  export let helperText;
  export let inputId: string;
  export let classes: string[] = [];
  export let type: 'email'|'search'|'text' = 'text';

  let pristine = true;
  let value = field.value || "";

  let onValueChange = (key, value) => {
    pristine = false;
    if (typeof onChange === "function") {
      onChange(key, value);
    }
  };
  //   alert(label);
</script>

<div class="mb-6">
  {#if field.label || label}
    <Label for="success" class="block mb-2 !text-gray-400">{field.label || label}</Label>
  {/if}

  <Input
          type={type}
    bind:value={model}
    placeholder={field.placeholder || placeholder}
    on:blur={(e) => {
      onValueChange(field.varName, e.currentTarget.value);
    }}
    on:keyup={(e) => {
      onValueChange(field.varName, e.currentTarget.value);
    }}
    on:input={(e) => {
      onInput(field.varName, e.currentTarget.value, e);
    }}
  />
  {#if helperText}
    <Helper>{helperText}</Helper>
  {/if}
</div>
