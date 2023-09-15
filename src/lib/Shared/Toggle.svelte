<script lang="ts">
  import { Label, Toggle } from 'flowbite-svelte';
  import { createEventDispatcher } from 'svelte';

  let dispatch = createEventDispatcher();

  import ErrorMessage from './ErrorMessage.svelte';

  export let label = '';
  export let value;
  export let color = 'green';

  export let errors = [];
</script>

{#if label}
  <Label color={errors.length ? 'red' : 'gray'} for={label} class="block mb-2">{label}:</Label>
{/if}

<Toggle
  on:click={(_) => {
    value = !value;
    dispatch('change', { value });
  }}
  {color}
  checked={value}
/>

<ErrorMessage {errors} />
