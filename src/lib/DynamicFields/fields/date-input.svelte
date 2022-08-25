<script lang="ts">
  import { Datepicker, Label, Helper } from "flowbite-svelte";
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
</script>

<div class="mb-6">
  {#if field.label}
    <Label for="success" class="block mb-2 !text-gray-400">{field.label}</Label>
  {/if}

  <Datepicker />
  {#if helperText}
    <Helper>{helperText}</Helper>
  {/if}
</div>
