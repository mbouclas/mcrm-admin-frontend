<script lang="ts">
  import { Label, Toggle } from 'flowbite-svelte';

  import ErrorMessage from './ErrorMessage.svelte';

  export let label = '';
  export let value;
  export let color = 'green';

  export let errors = [];
</script>

{#if label}
  <Label color={errors.length ? 'red' : 'gray'} for={label} class="block mb-2">{label}:</Label>
{/if}

<Toggle on:click={(e) => (value = !value)} {color} checked={value} />

<ErrorMessage {errors} />
