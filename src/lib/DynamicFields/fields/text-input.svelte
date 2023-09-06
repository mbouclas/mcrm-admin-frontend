<script lang="ts">
  import { Input, Label, Helper } from 'flowbite-svelte';
  import type { IDynamicFieldConfigBlueprint } from '../types';

  export let field: IDynamicFieldConfigBlueprint = {} as IDynamicFieldConfigBlueprint;
  export let onChange;
  export let model;
  export let placeholder;
  export let label;
  export let helperText;
  export let inputId: string;
  export let classes: string[] = [];

  let pristine = true;
  let value = field.value || '';

  let hasError = false;

  let onValueChange = (key, value) => {
    if (value === '' && field.required) {
      hasError = true;
      helperText = 'This field is required';
    } else {
      hasError = false;
      helperText = null;
    }
    pristine = false;
    if (typeof onChange === 'function') {
      onChange(key, value);
    }
  };
</script>

<div class="mb-6">
  {#if field.label}
    <Label class={`block mb-2 !text-gray-400 ${hasError ? 'has-error' : ''}`}>{field.label}</Label>
  {/if}

  <div class={`dynamic-field ${hasError ? 'has-error' : ''}`}>
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
  </div>
  {#if helperText}
    <Helper class={hasError ? 'helper-text has-error' : 'helper-text'}>{helperText}</Helper>
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
