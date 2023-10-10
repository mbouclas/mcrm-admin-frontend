<script lang="ts">
    import {onMount} from "svelte";
    import {type ISalesChannel, SalesChannelsService} from "./services/sales-channels.service";
    import {
        Button, Heading, Modal,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
        TableSearch
    } from "flowbite-svelte";
    import type {IEvent, IPagination} from "../Shared/models/generic";
    import {ArrowTopRightOnSquare, Plus, Trash} from "svelte-heros-v2";
    import EditChannel from "./edit-channel.svelte";
    import AddChannel from './add-channel.svelte';

    const s = new SalesChannelsService();
    let salesChannels: IPagination<ISalesChannel> = {data: []} as IPagination<ISalesChannel>;
    let searchTerm: string = '',
    showEditModal = false,
    showAddModal = false,
    selectedItem = null;

    onMount(async () => {
        await search();
    });

    async function search() {
        salesChannels = await s.find();
    }

    async function edit(item: ISalesChannel) {
        selectedItem = item;
        showEditModal = true;
    }

    async function deleteItem(item: ISalesChannel) {
        // do something
    }

    $: filteredItems = salesChannels.data.filter((item) => item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);

    async function onAddNewField(item: Partial<ISalesChannel>) {
        showAddModal = false;
        selectedItem = item;
        showEditModal = true;
    }

    async function onSaved(e: IEvent<ISalesChannel>) {
        await search();
    }
</script>
<div class="flex">
    <Heading tag="h3">Sales Channels</Heading>
    <div class="justify-end">
        <Button color="green" on:click={() => showAddModal = true}><Plus /></Button>
    </div>
</div>

<Modal size="xl" bind:open={showEditModal} title={`Editing ${selectedItem?.title}`}>
    <EditChannel model={selectedItem} on:save={onSaved} />
</Modal>

<Modal size="xl" bind:open={showAddModal} title={`Add Channel`}>
    <AddChannel onSave={onAddNewField} />
</Modal>
<TableSearch placeholder="Search by field name" hoverable={true} bind:inputValue={searchTerm} >
    <TableHead>
        <TableHeadCell>Name</TableHeadCell>
        <TableHeadCell>Description</TableHeadCell>
        <TableHeadCell>Default</TableHeadCell>
        <TableHeadCell>Active</TableHeadCell>
        <TableHeadCell></TableHeadCell>
    </TableHead>
    <TableBody class="divide-y">
        {#each filteredItems as item}
            <TableBodyRow>
            <TableBodyCell>{item.title}</TableBodyCell>
            <TableBodyCell>{item.description}</TableBodyCell>
            <TableBodyCell>
                {#if item.default}
                    <svg class="w-6 h-5 text-green-900" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="m10.6 16.6l7.05-7.05l-1.4-1.4l-5.65 5.65l-2.85-2.85l-1.4 1.4l4.25 4.25ZM12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Zm0-2q3.35 0 5.675-2.325T20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20Zm0-8Z"/></svg>
                    {:else}
                    <svg class="w-6 h-5 text-red-900" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M6.229.199a8 8 0 0 1 9.727 6.964a.75.75 0 0 1-1.492.157a6.5 6.5 0 1 0-7.132 7.146a.75.75 0 1 1-.154 1.492a8 8 0 0 1-.95-15.76Zm5.051 10.02a.75.75 0 1 0-1.06 1.061L11.94 13l-1.72 1.72a.75.75 0 1 0 1.06 1.06L13 14.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L14.06 13l1.72-1.72a.75.75 0 1 0-1.06-1.06L13 11.94l-1.72-1.72Zm.25-3.939a.75.75 0 0 0-1.06-1.06L6.5 9.19L5.28 7.97a.75.75 0 0 0-1.06 1.06l1.75 1.75a.75.75 0 0 0 1.06 0l4.5-4.5Z" clip-rule="evenodd"/></svg>
                    {/if}
                </TableBodyCell>
            <TableBodyCell>
                {#if item.active}
                    <svg class="w-6 h-5 text-green-900" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="m10.6 16.6l7.05-7.05l-1.4-1.4l-5.65 5.65l-2.85-2.85l-1.4 1.4l4.25 4.25ZM12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Zm0-2q3.35 0 5.675-2.325T20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20Zm0-8Z"/></svg>
                {:else}
                    <svg class="w-6 h-5 text-red-900" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M6.229.199a8 8 0 0 1 9.727 6.964a.75.75 0 0 1-1.492.157a6.5 6.5 0 1 0-7.132 7.146a.75.75 0 1 1-.154 1.492a8 8 0 0 1-.95-15.76Zm5.051 10.02a.75.75 0 1 0-1.06 1.061L11.94 13l-1.72 1.72a.75.75 0 1 0 1.06 1.06L13 14.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L14.06 13l1.72-1.72a.75.75 0 1 0-1.06-1.06L13 11.94l-1.72-1.72Zm.25-3.939a.75.75 0 0 0-1.06-1.06L6.5 9.19L5.28 7.97a.75.75 0 0 0-1.06 1.06l1.75 1.75a.75.75 0 0 0 1.06 0l4.5-4.5Z" clip-rule="evenodd"/></svg>
                {/if}
            </TableBodyCell>
            <TableBodyCell>
                <Button on:click={edit.bind(this, item)} title="Edit">
                    <ArrowTopRightOnSquare/>
                </Button>
                <Button on:click={deleteItem.bind(this, item)} title="Delete">
                    <Trash/>
                </Button>
                {#if $$slots.actions}
                    <slot name="actions" item={item}></slot>
                {/if}
            </TableBodyCell>

            </TableBodyRow>
        {/each}
    </TableBody>
</TableSearch>
