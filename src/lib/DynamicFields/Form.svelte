<script lang="ts">
  import { Button, Alert } from "flowbite-svelte";
  // import isEmpty from "../helpers/isEmpty";
  export let model;
  export let onClick = () => {};
  export let onSubmit = undefined;
  export let errorMessage = undefined;
  // export let errors = {};
  export let hasError = false;
  // export let onNativeSubmit: (e: any) => void;

  // function validateModel() {
  //   Object.keys(model).map((key) => {
  //     if (isEmpty(model[key])) {
  //       hasError = true;
  //       errors[key] = true;
  //     } else {
  //       errors[key] = false;
  //     }
  //   });

  //   return !hasError;
  // }

  // function onNativeSubmit(e) {
  //   e.preventDefault();
  //   if (e.currentTarget.checkValidity() && onSubmit && validateModel()) {
  //     onSubmit(model);
  //   }
  // }
  $: console.log(model, hasError);
</script>

{#if hasError}
  <Alert color="red" dismissable>
    <div class="flex">
      <span class="font-medium">
        <svg
          aria-hidden="true"
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          /></svg
        >
      </span>
      <span>Sorry, but you should fill in the required fields.</span>
    </div>
  </Alert>
{/if}
<div>
  <slot />

  <!-- {#if withSubmit}
    <div class="dynamic-field">
      <Button type="submit" size="lg" class="w-full" on:click={onNativeSubmit}
        >Submit</Button
      >
    </div>
  {/if} -->
</div>

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
