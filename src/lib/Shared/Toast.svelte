<script>
  import { Toast } from "flowbite-svelte";

  import { slide } from "svelte/transition";
  import { onMount } from "svelte";
  import { Check, InformationCircle, XMark } from "svelte-heros-v2";

  // export let duration;
  export let message;
  export let type;
  export let show;
  export let position;
  let colors = {
    success: "#3f83f8",
  };
</script>

<Toast
  simple
  open={show}
  {position}
  divClass={`product-toast ${type} fixed !right-[20px] z-[10000] rounded-lg p-2 text-white`}
>
  <svelte:fragment slot="icon">
    {#if type === "success"}
      <Check />
    {:else if type === "error"}
      <XMark />
    {:else}
      <InformationCircle />
    {/if}
  </svelte:fragment>
  {message}</Toast
>

<style land="scss" global>
  .product-toast {
    color: white !important;
    font-weight: 600 !important;
    border: none !important;
  }
  .product-toast.success {
    background-color: green !important;
  }
  .product-toast.error {
    background-color: red !important;
  }
  .product-toast.info {
    background-color: blue !important;
  }
</style>
