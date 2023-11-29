<script lang="ts">
    import {
        Heading,
        Input,
        Label,
        AccordionItem,
        Button,
        Select,
        Hr,
        TableHeadCell,
        TableBodyRow, Table, TableBodyCell, TableHead, TableBody, Modal, Breadcrumb, BreadcrumbItem
    } from 'flowbite-svelte';
import {createEventDispatcher, onMount} from 'svelte';
    import {navigate, useParams} from "mcrm-svelte-navigator";
    import type {IEditableRegion, IEditableRegionLayout} from '../models';
    import EditRegion from '../regions/edit.svelte';

    import {EditableRegionsService, editableRegionTypes} from "../editable-regions.service";
    import {ArrowTopRightOnSquare, Plus, Trash} from "svelte-heros-v2";
    import {EditOutline} from "flowbite-svelte-icons";

const dispatch = createEventDispatcher();
export let model: IEditableRegionLayout;
export let onSave: (model: IEditableRegionLayout) => void = undefined;

let showEditRegionModal = false,
    showAddRegionModal = false,
    selectedRegion: IEditableRegion = undefined;

const params = useParams();



onMount(async () => {
    if ($params.name && !model) {
        model = EditableRegionsService.getLayout({name: $params.name})
    }
});

async function save() {
    if (onSave) {
        onSave(model);
    }

    dispatch('save', model);
}

function editRegion(region: IEditableRegion) {
    selectedRegion = region;
    showEditRegionModal = true;
}

function fillRegion(region: IEditableRegion) {
    navigate(`/editable-regions/${model.name}/fill/${region.name}`);
}

async function onSaveRegion(region: IEditableRegion) {
    const temp = Object.assign({}, model);
    const foundIndex = temp.regions.findIndex(r => r.name === region.name);
    if (foundIndex === -1) {
        temp.regions.push(region);
    } else {
        temp.regions[foundIndex] = region;
    }

    model = temp;

    await new EditableRegionsService().saveLayout(model);

}

function getRegionType(type: string) {

    const found = editableRegionTypes.find(t => t.name === type);
    return found || {label: 'Unknown', name: 'unknown'};
}


</script>

{#if model}
    <Breadcrumb aria-label="Default breadcrumb example" class="mb-4">
        <BreadcrumbItem home>
            <Button on:click={() => navigate(`/editable-regions`)}>
                Layouts
            </Button>
        </BreadcrumbItem>
        <BreadcrumbItem>{model.label}</BreadcrumbItem>
    </Breadcrumb>

    <Modal title="Add new Region" autoclose={false} size="xl" bind:open={showAddRegionModal}>
        <EditRegion onSave={onSaveRegion} />
    </Modal>

    <Modal title={`Edit ${selectedRegion?.label}`} autoclose={false} size="xl" bind:open={showEditRegionModal}>
        <EditRegion bind:model={selectedRegion} onSave={onSaveRegion} />
    </Modal>
{#if $params.name}
    <Heading tag="h5" class="mb-4">{model.label}</Heading>
{/if}
<form on:submit|preventDefault={save}>
    <div class="my-4">
        <Label>Layout Name</Label>
        <Input label="Layout Name" placeholder="Layout Name" bind:value={model.name} required={true} />
    </div>

    <div class="my-4">
        <Label>Layout Label</Label>
        <Input label="Layout Label" placeholder="Layout Label" bind:value={model.label} required={true} />
    </div>

    <div class="my-4">
        <Label>Layout Description</Label>
        <Input label="Layout Description" placeholder="Layout Description" bind:value={model.description} required={true} />
    </div>
    <Hr />
    <div class="flex justify-between my-4">
        <Heading tag="h5" class="mb-4">Layout Regions</Heading>
        <Button type="button" size="sm" color="green" on:click={() => showAddRegionModal = true}>
            <Plus />
        </Button>
    </div>

    <Table>
        <TableHead>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Description</TableHeadCell>
            <TableHeadCell>Type</TableHeadCell>
            <TableHeadCell>Fields</TableHeadCell>
            <TableHeadCell></TableHeadCell>

        </TableHead>
        <TableBody class="divide-y">
            {#each model.regions as region}
                <TableBodyRow>
                    <TableBodyCell>{region.label}</TableBodyCell>
                    <TableBodyCell>{region.description}</TableBodyCell>
                    <TableBodyCell>{getRegionType(region.type).label}</TableBodyCell>
                    <TableBodyCell>{region.fields.length}</TableBodyCell>
                    <TableBodyCell>
                        <Button title="Edit Region" on:click={editRegion.bind(this, region)}>
                            <ArrowTopRightOnSquare />
                        </Button>
                        <Button title="Fill Region" on:click={fillRegion.bind(this, region)}>
                            <EditOutline />
                        </Button>
                        <Button titl="Delete Region">
                            <Trash color="red" />
                        </Button>
                    </TableBodyCell>
                </TableBodyRow>

            {/each}
        </TableBody>
    </Table>


<div class="my-6">
    <Button type="submit" size="sm" color="green" class="w-full">
        Save
    </Button>
</div>
</form>
{/if}
