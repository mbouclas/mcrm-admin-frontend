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
  import { createEventDispatcher } from "svelte";
  import { Confirm } from "svelte-confirm";

  export let id; // The product ID
  export let active; // If it's active

  export let openQuickEditModal;

  const dispatch = createEventDispatcher();

  function handleEvent(e) {
    // e.preventDefault();

    dispatch("grid-action", { id });
  }

  function deleteItem(e) {
    dispatch("delete-row", { id });
  }
</script>

<Confirm confirmTitle="Delete" cancelTitle="Cancel" let:confirm={confirmThis}>
  <Button class="action-button"
    ><ChevronDown>Dropdown button</ChevronDown></Button
  >
  <Dropdown class="w-44" triggeredBy=".action-button">
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
      ><div
        on:click={() => {
          openQuickEditModal();
        }}
      >
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

  <span class="text-gray-500" slot="title"> Are you sure? </span>
  <span class="text-gray-500" slot="description">
    You won't be able to revert this!
  </span>
</Confirm>
