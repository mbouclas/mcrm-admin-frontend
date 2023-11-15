<script lang="ts">
import {onMount} from "svelte";
import {MenuService} from "./menu.service";
import type {IPagination} from "../Shared/models/generic";
import type {MenuModel} from "./models";
import {
    Button,
    Heading,
    Modal,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell
} from "flowbite-svelte";
import {ArrowTopRightOnSquare, Plus, Trash} from "svelte-heros-v2";
import {navigate} from "mcrm-svelte-navigator";
import {EditOutline} from "flowbite-svelte-icons";
import AddEditMenu from './add-edit-menu.svelte';

let items: IPagination<MenuModel>;
let ready = false,
    showEditMenuModal = false,
    showAddMenuModal = false,
    selectedMenu: MenuModel;

onMount(async () => {
    await search();
    ready = true;
});

async function search() {
    items = await new MenuService().getMenus();

}

async function editItem(item: MenuModel) {
    selectedMenu = item;
    showEditMenuModal = true;
}

async function deleteItem(idx: number) {
    const item = items.data[idx];
    if (confirm(`Are you sure you want to delete ${item.title}?`)) {
        await new MenuService().deleteMenu(item.uuid);
        await search();
    }
}

async function saveMenu() {
    await search();
}

</script>
<Modal title="Edit Menu" autoclose={false} size="xl" bind:open={showEditMenuModal}>
    <AddEditMenu bind:model={selectedMenu} onSave={saveMenu} />
</Modal>

<Modal title="Add Menu" autoclose={false} size="xl" bind:open={showAddMenuModal}>
    <AddEditMenu  onSave={saveMenu} />
</Modal>

<div class="flex my-4">
    <Heading tag="h3">Menus</Heading>
    <div class="justify-end">
        <Button color="green" on:click={() => showAddMenuModal = true}><Plus /></Button>
    </div>
</div>

{#if ready}
<Table>
    <TableHead>
        <TableHeadCell>Title</TableHeadCell>
        <TableHeadCell>Description</TableHeadCell>
        <TableHeadCell>#Items</TableHeadCell>
        <TableHeadCell></TableHeadCell>

    </TableHead>
    <TableBody class="divide-y">
        {#each items.data as item, idx}
            <TableBodyRow>
                <TableBodyCell>
                    <a href="#" on:click|preventDefault={() => navigate(`/menus/${item.uuid}`)}>{item.title}</a>

                </TableBodyCell>
                <TableBodyCell>{item.description || ''}</TableBodyCell>
                <TableBodyCell>{Array.isArray(item.menuItem) ? item.menuItem.length : 0}</TableBodyCell>
                <TableBodyCell>
                    <Button on:click={() => navigate(`/menus/${item.uuid}`)} title="View Menu Items">
                        <ArrowTopRightOnSquare/>
                    </Button>
                    <Button on:click={editItem.bind(this, item)} title="Edit">
                        <EditOutline />
                    </Button>
                    <Button on:click={deleteItem.bind(this, idx)} title="Delete">
                        <Trash/>
                    </Button>
                    {#if $$slots.actions}
                        <slot name="actions" item={item}></slot>
                    {/if}
                </TableBodyCell>
            </TableBodyRow>
        {/each}
    </TableBody>
</Table>
    {/if}
