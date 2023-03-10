<script lang="ts">
  import { Label, Helper } from "flowbite-svelte";
  import type { IDynamicFieldConfigBlueprint } from "../types";
  import { Button, Dropdown, DropdownItem } from "flowbite-svelte";
  import { ChevronDown } from "svelte-heros-v2";

  export let field: IDynamicFieldConfigBlueprint =
    {} as IDynamicFieldConfigBlueprint;
  export let onChange;
  export let model;
  export let placeholder;
  export let label;
  export let helperText;
  export let inputId: string;
  export let classes: string[] = [];

  let dropDownOpened = false;
  let pristine = true;
  let value = field.value || "";

  let hasError = false;

  let onValueChange = (key, value) => {
    if (value === "") {
      hasError = true;
      helperText = "This field is required";
    } else {
      hasError = false;
      helperText = null;
    }
    pristine = false;
    if (typeof onChange === "function") {
      onChange(key, value);
    }
  };
</script>

<div class="mb-6">
  {#if field.label}
    <Label class={`block mb-2 !text-gray-400 ${hasError ? "has-error" : ""}`}
      >{field.label}</Label
    >
  {/if}

  <div
    class={`dynamic-field grid grid-flow-col justify-between ${
      hasError ? "has-error" : ""
    }`}
  >
    <div class="text-xl my-auto pl-2">
      {field.ui.values.find((value) => value.value === model).label}
    </div>
    <Button
      class="action-button"
      on:click={() => (dropDownOpened = !dropDownOpened)}
      ><ChevronDown>Dropdown button</ChevronDown></Button
    >

    <Dropdown open={dropDownOpened} class="w-44">
      {#each field.ui.values as value}
        <DropdownItem liClass="p-0 cursor-pointer"
          ><div
            class="w-full h-full text-xl p-2"
            on:click={() => {
              model = value.value;
              dropDownOpened = false;
            }}
          >
            {value.label}
          </div></DropdownItem
        >
      {/each}
    </Dropdown>
  </div>
  {#if helperText}
    <Helper class={hasError ? "helper-text has-error" : "helper-text"}
      >{helperText}</Helper
    >
  {/if}
</div>

<style global>
  .dynamic-field input {
    background-color: #2e3446 !important;
    border: 1px solid #32394e !important;
    color: #bfc8e2 !important;
    outline: none !important;
    box-shadow: none !important;
  }

  .dynamic-field input:focus {
    background-color: #303648 !important;
    border: 1px solid #32394e !important;
    color: #bfc8e2 !important;
    outline: none !important;
    box-shadow: none !important;
  }

  .dynamic-field.has-error input {
    background-color: #ff000011 !important;
    border: 1px solid #970000 !important;
  }

  label.has-error {
    color: red !important;
  }

  p.helper-text {
    margin: 2px !important;
  }
  p.helper-text.has-error {
    color: red !important;
  }
</style>
