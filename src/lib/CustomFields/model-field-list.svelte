<script lang="ts">
    import {navigate, useParams} from "mcrm-svelte-navigator";
    import {onMount} from "svelte";
    import {Breadcrumb, BreadcrumbItem, Button, Modal} from "flowbite-svelte";
    import type {IDynamicFieldConfigBlueprint} from "../DynamicFields/types";
    import EditField from "./edit-field.svelte";
    import AddField from './add-field.svelte'
    import ListFields from "./list-fields.svelte";
    import {CustomFieldsService} from "./services/custom-fields.service";
    import type {CustomFieldModel} from "./models/custom-field.model";
    import {setNotificationAction} from "../stores";

    const params = useParams();
    let selectedField: Partial<IDynamicFieldConfigBlueprint> = null,
        showEditFieldModal = false,
        showAddFieldModal = false,
        refresh = false,
    filters = {};
    const fieldsService = new CustomFieldsService();
    let fields = [];

    onMount(async () => {
        filters['name'] = $params.id;
        fields = fieldsService.modelFields($params.id);
    });

    function editField(field: Partial<IDynamicFieldConfigBlueprint>) {
        selectedField = field;
        showEditFieldModal = true;
    }

    function deleteField(field: Partial<IDynamicFieldConfigBlueprint>) {
        console.log(field);
    }

    function onSaveField(field: Partial<IDynamicFieldConfigBlueprint>) {
        console.log(field);
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

    async function onSave(fields: CustomFieldModel[], changedField: CustomFieldModel) {
        await (new CustomFieldsService()).sync($params.id, changedField);
        setNotificationAction({
            message: 'Saved successfully',
            type: 'success',
        });
    }

</script>
<Modal size="xl" bind:open={showAddFieldModal} title={`Add new field on ${$params.id}`}>
    <AddField onSave={onAddNewField} modelName={$params.id} />
</Modal>

{#if $params.id}
    <Breadcrumb aria-label="Default breadcrumb example" class="mb-4">
        <BreadcrumbItem home>
            <Button on:click={() => navigate(`/settings/cf`)}>
                Custom Fields
            </Button>
        </BreadcrumbItem>
        <BreadcrumbItem>{$params.id}</BreadcrumbItem>
    </Breadcrumb>
    <Modal size="xl" bind:open={showEditFieldModal} title={`Editing ${selectedField?.varName} on ${$params.id}`}>
        <EditField model={selectedField} onSave={onSaveField} modelName={$params.id} />
    </Modal>
    <ListFields bind:model={fields} {onSave}>
        <svelte:fragment slot="heading">Fields for {$params.id}</svelte:fragment>
    </ListFields>
<!--    <FieldSelector  mode="list" modelName={$params.id} bind:refresh={refresh} onSave={onSaveField}>
        <div slot="top-actions">
            <div class="flex justify-between">
                <div class="justify-start">
                    <Button color="blue" title="Back to list" on:click={() => navigate('/settings/cf')}><ArrowLeft /></Button>
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
</FieldSelector>-->
    {/if}
