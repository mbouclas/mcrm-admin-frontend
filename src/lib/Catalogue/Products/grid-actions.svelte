<script>
  import {
    Dropdown,
    DropdownItem,
    DropdownDivider,
    DropdownHeader,
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

<Button class="action-button"><ChevronDown>Dropdown button</ChevronDown></Button>
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
