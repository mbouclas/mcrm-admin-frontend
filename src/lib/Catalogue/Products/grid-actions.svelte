<script>
  import {
    Dropdown,
    DropdownItem,
    DropdownDivider,
    ToolbarButton,
    Button,
  } from "flowbite-svelte";
  import { Eye, EyeOff, Pencil, PencilAlt, Trash } from "svelte-heros";
  import { ChevronDown } from "svelte-heros-v2";
  import { navigate } from "svelte-navigator";
  import {createEventDispatcher, onMount} from "svelte";
  import { Confirm } from "svelte-confirm";

  import { openModal } from "svelte-modals";
  // import Modals from "../../Shared/Modals.svelte";
  import QuickEditModal from "./QuickEditModal.svelte";

  export let id; // The product ID
  export let active; // If it's active
  export let title;
  const dispatch = createEventDispatcher();

  onMount(() => {

  });
  function goToPage(e) {
    e.preventDefault();
    navigate("/catalogue/products/" + id);
  }



  function handleEvent(e) {
    // e.preventDefault();

    dispatch("grid-action", { id });
  }

  function deleteItem(e) {
    dispatch("delete-row", { id });
  }

  function openQuickEditModal() {
    openModal(QuickEditModal, { itemId: id });
  }


</script>

<Confirm confirmTitle="Delete" cancelTitle="Cancel" let:confirm={confirmThis}>
  <Button class="action-button" id={`action-button-${id}`} on:click={handleEvent}
    ><ChevronDown>Dropdown button</ChevronDown></Button
  >
  <Dropdown class="w-44" triggeredBy={`#action-button-${id}`}>
    <DropdownItem
    ><div on:click={() => console.log(id)}>
      <Eye size="16" /><span>test</span>
    </div></DropdownItem
  >
    {#if !active}
      <DropdownItem
        ><div on:click={() => dispatch("activate-item", { id })}>
          <Eye size="16" /><span>Activate</span>
        </div></DropdownItem
      >
    {:else}
      <DropdownItem
        ><div on:click={() => dispatch("de-activate-item", { id })}>
          <EyeOff size="16" /><span>Disable</span>
        </div></DropdownItem
      >
    {/if}
    <DropdownItem
      ><div on:click={goToPage}>
        <Pencil size="16" /><span>Edit</span>
      </div></DropdownItem
    >
    <DropdownItem
      ><div on:click={openQuickEditModal}>
        <PencilAlt size="16" /><span>Quick Edit</span>
      </div></DropdownItem
    >
    <DropdownDivider />
    <DropdownItem>
      <div on:click={() => confirmThis(deleteItem)}>
        <Trash size="16" /><span>Delete</span>
      </div>
    </DropdownItem>
  </Dropdown>
  <span slot="title"> Are you sure? </span>
  <span slot="description"> You won't be able to revert this! </span>
</Confirm>
