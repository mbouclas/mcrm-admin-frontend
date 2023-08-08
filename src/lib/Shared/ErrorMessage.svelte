<script lang="ts">
  import { fly, fade } from 'svelte/transition';

  export let errors = [];
</script>

{#if errors.length}
  <p class="error-message" out:fade={{ delay: 0, duration: 100 }} in:fly={{ y: -50, duration: 100 }}>
    {errors.join(',')}
  </p>
{/if}

<style type="text/postcss">
  .error-message {
    @apply text-sm text-red-500 font-bold pt-1;
    transition: text-shadow 0.3s ease;
  }
</style>
