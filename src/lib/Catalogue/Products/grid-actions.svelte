<script>
  import {
    Dropdown,
    DropdownItem,
    DropdownDivider,
    ToolbarButton,
    Button,
  } from "flowbite-svelte";
  import { ChevronDown } from "svelte-heros-v2";
  import { navigate } from "svelte-navigator";
  import {createEventDispatcher} from "svelte";
  export let id;// The product ID
  export let active; // If it's active
  const dispatch = createEventDispatcher();
  function goToPage(e) {
    e.preventDefault();
    navigate("/catalogue/products/" + id);
  }



  function handleEvent(e) {
    // e.preventDefault();

    dispatch('grid-action', {id})
  }
</script>


<ToolbarButton class="action-button text-gray-900">
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /></svg>
</ToolbarButton>
<Dropdown class="w-44" triggeredBy=".action-button">
  {#if active}
    <DropdownItem><span on:click={handleEvent}>Activate</span></DropdownItem>
    {:else }
    <DropdownItem><span on:click={handleEvent}>Disable</span></DropdownItem>
    {/if}
  <DropdownItem on:click={goToPage}><span on:click={goToPage}>Edit</span></DropdownItem>
  <DropdownItem><span on:click={handleEvent}>Quick Edit</span></DropdownItem>
  <DropdownDivider />
  <DropdownItem><span on:click={handleEvent}>Delete</span></DropdownItem>
</Dropdown>
