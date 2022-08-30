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
    <div class="dynamic-field">
      <Button type="submit" size="lg" class="w-full" on:click={onNativeSubmit}
        >Submit</Button
      >
    </div>
  {/if}
</form>

<style global>
  .dynamic-field button {
    color: rgb(241, 239, 239) !important;
    background-color: #556ee6 !important;
    border-color: #556ee6 !important;
  }
  .dynamic-field button:hover {
    color: rgb(241, 239, 239) !important;
    background-color: #3d58df !important;
    border-color: #3d58df !important;
  }
</style>
