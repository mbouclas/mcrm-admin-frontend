<script>
  import { Toast } from "flowbite-svelte";

  import { slide } from "svelte/transition";
  import { onMount } from "svelte";

  // export let duration;
  export let message;
  export let type;
  export let show;
  let colors = {
    success: "#3f83f8",
  };
</script>

<Toast
  simple
  :transition={slide}
  visible={show}
  divClass={`fixed top-[20px] !right-[20px] z-[10000] bg-[${colors[type]}] rounded-lg p-2 text-white`}
>
  <svelte:fragment slot="icon">
    <svg
      aria-hidden="true"
      class="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      ><path
        fill-rule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clip-rule="evenodd"
      /></svg
    >
    <span class="sr-only">Check icon</span>
  </svelte:fragment>
  {message}</Toast
>
