<script lang="ts">
  import ErrorMessage from './ErrorMessage.svelte';
  import { Input, Label } from 'flowbite-svelte';

  export let label;
  export let value;
  export let errors;
  export let required = false;
  export let placeholder = `Enter ${label}`;
  export let type = 'text';
</script>

{#if label}
  <Label color={errors.length ? 'red' : 'gray'} for={label} class="block mb-2">{label}:</Label>
{/if}

<Input
  {type}
  on:input={() => {
    errors = [];
  }}
  {placeholder}
  required
  color={errors.length ? 'red' : 'base'}
  id={label}
  bind:value
/>

<ErrorMessage {errors} />
