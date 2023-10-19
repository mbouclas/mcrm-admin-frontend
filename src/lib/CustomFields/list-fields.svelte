<script lang="ts">
    import {
        Button,
        Heading, Modal,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell
    } from "flowbite-svelte";
    import {ArrowTopRightOnSquare, LockClosed, Plus, Trash} from "svelte-heros-v2";
    import EditField from "./add-edit-custom-field-form.svelte";
    import type {CustomFieldModel} from "./models/custom-field.model";
    import type {IEditableRegionField} from "../EditableRegions/models";


    let showAddFieldModal = false,
        showEditFieldModal = false,
        selectedField = null;
    export let model: IEditableRegionField[] = [];
    export let onSave: (model: IEditableRegionField[], field: CustomFieldModel) => void;

    function onAddField(field: CustomFieldModel) {
        const temp = Object.assign([], model); //svelte not updating the view cause we're updating an object property
        const foundIndex = temp.findIndex(f => f.varName === field.varName);

        if (foundIndex > -1) {
            temp[foundIndex] = field;
        } else {
            temp.push(field);
        }

        model = temp;
        showAddFieldModal = false;

        if (onSave) {
            onSave(model, field);
        }
    }

    function editField(field: IEditableRegionField) {
        selectedField = field;
        showEditFieldModal = true;
    }

    function remove(idx: number) {
        const r = confirm('Are you sure you want to delete this field?');
        if (!r) {
            return;
        }

        const temp = Object.assign([], model);
        const fieldToDelete = temp[idx];
        temp.splice(idx, 1);
        model = temp;

        if (onSave) {
            onSave(model, fieldToDelete);
        }
    }

</script>

<Modal title="Add new Field" autoclose={false} size="xl" bind:open={showAddFieldModal}>
    <EditField fieldSettings={[]} onSave={onAddField} />
</Modal>

<Modal title="Edit Field" autoclose={false} size="xl" bind:open={showEditFieldModal}>
    <EditField fieldSettings={[]} onSave={onAddField} model={selectedField} />
</Modal>

<div class="flex justify-between my-4">
    <Heading tag="h5" class="mb-4">
        <slot name="heading">Fields</slot>
    </Heading>
    <Button type="button" size="sm" color="green" on:click={() => showAddFieldModal = true}>
        <Plus />
    </Button>
</div>

<Table>
    <TableHead>
        <TableHeadCell>Name</TableHeadCell>
        <TableHeadCell>Label</TableHeadCell>
        <TableHeadCell>Type</TableHeadCell>
        <TableHeadCell>Description</TableHeadCell>
        <TableHeadCell></TableHeadCell>

    </TableHead>
    <TableBody class="divide-y">
        {#each model as field, idx}
            <TableBodyRow>
                <TableBodyCell>{field.varName}</TableBodyCell>
                <TableBodyCell>{field.label}</TableBodyCell>
                <TableBodyCell>{field.type}</TableBodyCell>
                <TableBodyCell>{field.hint || ''}</TableBodyCell>
                <TableBodyCell>
                    <div class="flex">
                    <Button title="Edit Field" on:click={editField.bind(this, field)}>
                        <ArrowTopRightOnSquare />
                    </Button>
                    {#if !field.isReadOnly}
                    <Button title="Delete Field" on:click={remove.bind(this, idx)}>
                        <Trash color="red" />
                    </Button>
                        {:else}
                        <div class="py-2.5 px-5" title="Locked">
                            <LockClosed />
                        </div>

                        {/if}
                    </div>
                </TableBodyCell>
            </TableBodyRow>

        {/each}
    </TableBody>
</Table>
