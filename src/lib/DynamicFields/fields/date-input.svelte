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

  let hasError = false;

  let onValueChange = (value) => {
    if (value === "") {
      hasError = true;
      helperText = "This field is required";
    } else {
      hasError = false;
      helperText = null;
    }
  };
  const todayString = () => {
    var today = new Date();
    return today.toISOString().substring(0, 10);
  };
</script>

<div class="mb-6">
  {#if field.label}
    <Label class={`block mb-2 !text-gray-400 ${hasError ? "has-error" : ""}`}>
      {field.label}
    </Label>
  {/if}
  <div class={`custom-dateinput dynamic-field ${hasError ? "has-error" : ""}`}>
    <DateInput
      bind:value={model}
      bind:format
      placeholder={todayString()}
      on:change={(e) => {
        onValueChange(e.currentTarget.value);
      }}
    />
  </div>
  {#if helperText}
    <Helper class={hasError ? "helper-text has-error" : "helper-text"}>
      {helperText}
    </Helper>
  {/if}
</div>

<style global>
  .custom-dateinput .date-time-field input {
    width: 100% !important;
    border-radius: 10px;
    height: 42px;
  }
</style>
