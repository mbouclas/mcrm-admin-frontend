<script lang="ts">
    import {
        Button,
        Heading,
        Hr,
        Input,
        Label,  Select,
    } from "flowbite-svelte";
    import {createEventDispatcher, onMount} from "svelte";
    import {EditableRegionModel} from "../editable-region.model";
    import type { CustomFieldModel} from "../../CustomFields/models/custom-field.model";
    import {EditableRegionsService} from "../editable-regions.service";
    import type {IMcrmDi} from "../../Shared/models/generic";
    import {schemaToFields} from "../../helpers/data";
    import CustomFields from "../../CustomFields/group-field-renderer.svelte";
    import ListFields from '../../CustomFields/list-fields.svelte';
    import {setNotificationAction} from "../../stores";

    const dispatch = createEventDispatcher();
    export let onSave: (model: Partial<EditableRegionModel>) => void = undefined;
    export let model: EditableRegionModel = undefined;
    let locked = false,
        showAddFieldModal = false,
        ready = false,
        executors: IMcrmDi[] = [],
        providerSettingsFields: CustomFieldModel[] = [];

    const regionTypes = EditableRegionsService.getRegionTypes();

    onMount(async () => {
        model = new EditableRegionModel(model);
        if (model.name) {
            locked = true;
        }
        executors = await new EditableRegionsService().getExecutors();

        ready = true;
    });

    function save() {
        onSave(model);

        dispatch('save', model);

    }

    $: {
        if (model && model.type && model.type === 'executor' && model.executor) {
            providerSettingsFields = schemaToFields(executors.find(e => e.id === model.executor)?.settingsSchema);
        }
    }


</script>
{#if ready}

<form on:submit|preventDefault={save}>
    <div class="my-4">
        <Label>Name</Label>
        <Input label="Name" placeholder="Name" bind:value={model.name} disabled={locked} required={true} tabindex="0" />
    </div>

    <div class="my-4">
        <Label>Label</Label>
        <Input label="Label" placeholder="Label" bind:value={model.label} required={true} tabindex="1" />
    </div>

    <div class="my-4">
        <Label>Description</Label>
        <Input label="Description" placeholder="Description" bind:value={model.description} required={true} tabindex="2" />
    </div>

    <div class="my-4">
        <Label>Layout Type {model.type}</Label>
        <Select bind:value={model.type} tabindex="3">
            {#each regionTypes as type}
                <option value={type.name}>{type.label}</option>
            {/each}
        </Select>
    </div>


    <Hr />
    {#if model.type !== 'executor'}
  <ListFields bind:model={model.fields} />

        {:else }
        <Heading tag="h5" class="mb-4">Available Executors</Heading>
        <Select bind:value={model.executor}>
            {#each executors as executor}
                <option value={executor.id}>{executor.metaData && executor.metaData.name || executor.id} ({executor.description})</option>
            {/each}
        </Select>

        {#if model.executor}
            <div class="my-4">
                <Heading tag="h4">Executor Settings</Heading>
                <CustomFields fields={providerSettingsFields} let:field={field} fieldPrimaryKey="varName" bind:model={model.regionSettings}>

                </CustomFields>
            </div>
        {/if}

        {/if}


    <div class="my-6">
        <Button type="submit" size="sm" color="green" class="w-full">
            Save
        </Button>
    </div>
</form>
    {/if}
