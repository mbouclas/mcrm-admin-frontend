<script>
  import {
    Dropdown,
    DropdownItem,
    DropdownDivider,
    DropdownHeader,
    Button,
  } from "flowbite-svelte";
  // import { ChevronDown } from "svelte-heros-v2";
  import { navigate } from "svelte-navigator";
  export let id;// The product ID
  export let active; // If it's active

  function goToPage(e) {
    e.preventDefault();
    navigate("/catalogue/products/" + id);
  }
</script>

<Dropdown class="w-44">
  {#if active}
  <DropdownItem>Activate</DropdownItem>
    {:else }
    <DropdownItem>Disable</DropdownItem>
    {/if}
  <DropdownItem on:click={goToPage}>Edit</DropdownItem>
  <DropdownItem>Quick Edit</DropdownItem>
  <DropdownDivider />
  <DropdownItem>Delete</DropdownItem>
</Dropdown>
