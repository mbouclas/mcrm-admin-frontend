<script lang="ts">
  import { Input, Label, Helper } from "flowbite-svelte";
  import type { IDynamicFieldConfigBlueprint } from "../types";

  export let field: IDynamicFieldConfigBlueprint =
    {} as IDynamicFieldConfigBlueprint;
  export let onChange;
  export let model;
  export let placeholder;
  export let label;
  export let helperText;
  export let inputId: string;
  export let classes: string[] = [];

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
  {#if label}
    <Label for="success" color="green" class="block mb-2">{label}</Label>
  {/if}

  <Input
    bind:value={model}
    placeholder={field.placeholder}
    on:blur={(e) => {
      onValueChange(field.varName, e.currentTarget.value);
    }}
    on:keyup={(e) => {
      onValueChange(field.varName, e.currentTarget.value);
    }}
  />
  {#if helperText}
    <Helper>{helperText}</Helper>
  {/if}
</div>
