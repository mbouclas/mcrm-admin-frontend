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
  export let step = field.type === 'float' ? 0.01 : 1;
  let pristine = true;
  let value = field.value || '';

  let hasError = false;

  let onValueChange = (key, value) => {
    if (value === '' && field.required) {
      hasError = true;
      helperText = 'This field is required';
    } else if (parseFloat(value) < 0 && ['weight', 'quantity', 'price'].indexOf(model)) {
      hasError = true;
      helperText = 'Should be positive value';
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
    <Label class={`block mb-2 !text-gray-400 ${hasError ? 'has-error' : ''}`}>
      {field.label}
    </Label>
  {/if}

  <div class={`dynamic-field ${hasError ? 'has-error' : ''}`}>
    <Input
      type="number"
      bind:value={model}
      placeholder={field.placeholder}
      {step}
      autoCompleteKey="name"
      on:blur={(e) => {
        onValueChange(field.varName, e.currentTarget.value);
      }}
      on:keyup={(e) => {
        onValueChange(field.varName, e.currentTarget.value);
      }}
    />
  </div>
  {#if helperText}
    <Helper class={hasError ? 'helper-text has-error' : 'helper-text'}>
      {helperText}
    </Helper>
  {/if}
</div>
