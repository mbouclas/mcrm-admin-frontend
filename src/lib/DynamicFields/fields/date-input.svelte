<script lang="ts">
  import { Datepicker, Label, Helper } from "flowbite-svelte";
  import { DateInput } from "date-picker-svelte";
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

  export let format = "yyyy-MM-dd";

  let pristine = true;
  let value = field.value || "";

  let onValueChange = (key, value) => {
    pristine = false;
    if (typeof onChange === "function") {
      onChange(key, value);
    }
  };

  const todayString = () => {
    var today = new Date();
    return today.toISOString().substring(0, 10);
  };
</script>

<div class="mb-6">
  {#if field.label}
    <Label for="success" class="block mb-2 !text-gray-400">{field.label}</Label>
  {/if}

  <div class="custom-dateinput">
    <DateInput bind:value={model} bind:format placeholder={todayString()} />
  </div>
  {#if helperText}
    <Helper>{helperText}</Helper>
  {/if}
</div>

<style global>
  .custom-dateinput .date-time-field input {
    width: 100% !important;
    border-radius: 10px;
    height: 42px;
  }
</style>
