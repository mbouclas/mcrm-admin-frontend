<script lang="ts">
    import {useParams} from "svelte-navigator";
    import {onMount} from "svelte";
    import FieldSelector from './field-selector.svelte';
    import {Button, Modal} from "flowbite-svelte";
    import {ArrowTopRightOnSquare, Trash} from "svelte-heros-v2";
    import type {IDynamicFieldConfigBlueprint} from "../DynamicFields/types";
    import EditField from "./edit-field.svelte";

    const params = useParams();
    let selectedField: Partial<IDynamicFieldConfigBlueprint> = null,
        showEditFieldModal = false,
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

</script>

{#if $params.id}
    <Modal size="xl" bind:open={showEditFieldModal} title={`Editing ${selectedField?.varName} on ${$params.id}`}>
        <EditField model={selectedField} onSave={onSaveField} modelName={$params.id} />
    </Modal>

    <FieldSelector let:field={field} mode="list" modelName={$params.id} bind:refresh={refresh}>
    <div slot="actions">
        <Button on:click={editField.bind(this, field)} title="Edit">
            <ArrowTopRightOnSquare/>
        </Button>

        <Button on:click={deleteField.bind(this, field)} title="Delete">
            <Trash/>
        </Button>
    </div>
</FieldSelector>
    {/if}
