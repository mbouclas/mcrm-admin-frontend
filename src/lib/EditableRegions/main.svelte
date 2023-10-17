<script lang="ts">
    import {
        Badge,
        Button, Modal,
        Table, TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell
    } from 'flowbite-svelte'
    import {  Heading, P, Hr } from 'flowbite-svelte'
    import {app} from "../stores";
    import Edit from './layouts/edit.svelte';
    import type {IEditableRegion, IEditableRegionLayout} from "./models";
    import {ArrowTopRightOnSquare, Plus, Trash} from "svelte-heros-v2";
    import {navigate} from "mcrm-svelte-navigator";
    import {EditOutline} from "flowbite-svelte-icons";


    let layouts: IEditableRegionLayout[] = [],
        selectedLayout: IEditableRegionLayout,
        showAddLayoutModal = false,
        showEditLayoutModal = false;

    app.subscribe(state => {
        if (!state || !state.configs || !Array.isArray(state.configs.editableRegions)) {
            return;
        }

        layouts = state.configs.editableRegions;
    });

    function onLayoutClick(e: CustomEvent) {
        const region = e.detail as IEditableRegionLayout;
        // bug on the listgroup component
        if (typeof region === 'number') {
            return;
        }

        const idx = layouts.findIndex(r => r.name === region.name);
        selectedLayout = region;
        layouts[idx]['current'] = true;
        console.log(region, idx);
    }

    function editLayout(layout: IEditableRegionLayout) {
        navigate(`/editable-regions/${layout.name}`)
    }

</script>
<Modal title="Add new layout" autoclose={false} size="xl" bind:open={showAddLayoutModal}>
</Modal>



<Heading tag="h3" class="mb-4">Available Layouts</Heading>
<div class="flex justify-end space-x-4 my-4">

    <Button on:click={() => showAddLayoutModal = true} class="bg-green-500 rounded p-2">
        <Plus /></Button>
</div>
<Table>
    <TableHead>
        <TableHeadCell>Name</TableHeadCell>
        <TableHeadCell>Description</TableHeadCell>
        <TableHeadCell>Regions</TableHeadCell>
        <TableHeadCell></TableHeadCell>

    </TableHead>
    <TableBody class="divide-y">
        {#each layouts as layout}
            <TableBodyRow>
                <TableBodyCell>{layout.label}</TableBodyCell>
                <TableBodyCell>{layout.description}</TableBodyCell>
                <TableBodyCell>
                    <div class="flex items-center gap-x-6">
                        {#if Array.isArray(layout.regions)}
                            {#each layout.regions as region, idx}
                                <Button on:click={() => navigate(`/editable-regions/${layout.name}/fill/${region.name}`)}>
                                    <Badge color="blue">
                                        {region.label}
                                    </Badge>
                                </Button>
                            {/each}
                        {/if}
                    </div>
                </TableBodyCell>
                <TableBodyCell>
                    <Button title="Edit Layout" on:click={editLayout.bind(this, layout)}>
                        <ArrowTopRightOnSquare />
                    </Button>
                    <Button title="Fill Region" on:click={() => navigate(`/editable-regions/${layout.name}/view`)}>
                        <EditOutline />
                    </Button>
                    <Button titl="Delete Layout">
                        <Trash color="red" />
                    </Button>
                </TableBodyCell>
            </TableBodyRow>

            {/each}
    </TableBody>
</Table>
