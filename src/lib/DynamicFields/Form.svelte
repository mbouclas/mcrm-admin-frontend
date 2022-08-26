<script lang="ts">
  import { Button } from "flowbite-svelte";
  export let model;
  export let withSubmit = false;
  export let onClick = () => {};
  export let onSubmit = undefined;
  export let errorMessage = undefined;

  function onNativeSubmit(e) {
    e.preventDefault();
    if (e.currentTarget.checkValidity() && onSubmit) {
      onSubmit(model);
    }
  }
</script>

<form on:submit={onNativeSubmit}>
  <slot />

  {#if withSubmit}
    <Button type="submit" size="lg" class="w-full" on:click={onNativeSubmit}
      >Submit</Button
    >
  {/if}
</form>
