<script lang="ts">
    import {navigate, useParams} from "mcrm-svelte-navigator";
    import {onMount} from "svelte";
    import FieldSelector from './field-selector.svelte';
    import {Button, Modal} from "flowbite-svelte";
    import {ArrowTopRightOnSquare, Plus, Trash, ArrowLeft} from "svelte-heros-v2";
    import type {IDynamicFieldConfigBlueprint} from "../DynamicFields/types";
    import EditField from "./edit-field.svelte";
    import AddField from './add-field.svelte'

    const params = useParams();
    let selectedField: Partial<IDynamicFieldConfigBlueprint> = null,
        showEditFieldModal = false,
        showAddFieldModal = false,
        refresh = false,
    filters = {};

    onMount(async () => {
        filters['name'] = $params.id;
    });

    function editField(field: Partial<IDynamicFieldConfigBlueprint>) {
        selectedField = field;
        showEditFieldModal = true;
    }

    function deleteField(field: Partial<IDynamicFieldConfigBlueprint>) {
        console.log(field);
    }

    function onSaveField(field: Partial<IDynamicFieldConfigBlueprint>) {
        // console.log(field);
        showEditFieldModal = false;
        refresh = true;
    }

    function addField() {
        showAddFieldModal = true;
    }

    async function onAddNewField(newField: Partial<IDynamicFieldConfigBlueprint>) {
        showAddFieldModal = false;
        selectedField = newField;
        showEditFieldModal = true;
    }

</script>
<Modal size="xl" bind:open={showAddFieldModal} title={`Add new field on ${$params.id}`}>
    <AddField onSave={onAddNewField} modelName={$params.id} />
</Modal>

{#if $params.id}
    <Modal size="xl" bind:open={showEditFieldModal} title={`Editing ${selectedField?.varName} on ${$params.id}`}>
        <EditField model={selectedField} onSave={onSaveField} modelName={$params.id} />
    </Modal>

    <FieldSelector  mode="list" modelName={$params.id} bind:refresh={refresh}>
        <div slot="top-actions">
            <div class="flex justify-between">
                <div class="justify-start">
                    <Button color="blue" title="Back to list" on:click={() => navigate('/settings/cf')}><ArrowLeft /></Button>
                </div>
            <div class="justify-end">
                <Button color="green" title="Add new field" on:click={addField}><Plus /></Button>
            </div>
            </div>
        </div>
    <div slot="actions" let:field>
        <Button on:click={editField.bind(this, field)} title="Edit">
            <ArrowTopRightOnSquare/>
        </Button>

        <Button on:click={deleteField.bind(this, field)} title="Delete">
            <Trash/>
        </Button>
    </div>
</FieldSelector>
    {/if}
