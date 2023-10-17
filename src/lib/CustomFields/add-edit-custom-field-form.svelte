<script lang="ts">
    import type {IDynamicFieldConfigBlueprint} from "../DynamicFields/types";
    import {createEventDispatcher, onMount} from "svelte";
    import {Button, Helper, Label, Select, Input} from "flowbite-svelte";
    import type {IEvent} from "../Shared/models/generic";
    import {z, ZodError} from 'zod';
    import CustomFields from './group-field-renderer.svelte';
    import {CustomFieldModel} from "./models/custom-field.model";
    import {CustomFieldsService} from "./services/custom-fields.service";
    import {formatZodErrors} from "../helpers/errors";
    import {setNotificationAction} from "../stores";

    const dispatch = createEventDispatcher();

    export let model: CustomFieldModel;

    export let onSave: (model: CustomFieldModel) => void = undefined;
    export let fieldTypes = CustomFieldsService.getFieldTypes();
    export let fieldSettings: Partial<IDynamicFieldConfigBlueprint>[] = CustomFieldsService.getFieldSettings();
    const schema = z.object({
        varName: z.string({required_error: 'Var name is required'}).min(1),
        label: z.string({required_error: 'Label is required'}).min(1),
        placeholder: z.string({required_error: 'Placeholder is required'}).min(1),
        type: z.string({required_error: 'Type is required'}).min(1, 'Type is required'),//select so only min will trigger most of the times
    });
    let errors = {},
        locked = false,
        fieldTypeHasSettings = null;

    onMount((async () => {
        model = new CustomFieldModel(model);
        if (model.name) {
            locked = true;
        }

    }));


    function save() {
        errors = {};
        try {
            schema.parse(model);
        }
        catch (e) {
            if (e instanceof ZodError) {
                errors = formatZodErrors(e)
            }
            return;
        }

        if (onSave) {
            onSave(model);
        }

        dispatch('save', model);

        setNotificationAction({
            message: 'Field saved',
            type: 'success'
        })
    }

    function onChangeType(e: IEvent<string>) {

    }

    $: {
        if (model && model.type) {
           fieldTypeHasSettings = fieldTypes.find(f => f.name === model.type)?.fieldSettings ?? false
        }
    }
</script>
{#if model}
<form on:submit|preventDefault={save} novalidate>
    <div class="mb-4 mt-4">
        <Label>Var Name</Label>
        <Input name="varName" placeholder="Var Name" bind:value={model.varName} disabled={locked} />
        {#if errors['varName']}
            <Helper class="mt-2" color="red">
                {errors['varName'].message}
            </Helper>
        {/if}
    </div>

    <div class="mb-4 mt-4">
        <Label>Field Label</Label>
        <Input id="label" name="label" placeholder="Field Label" bind:value={model.label} />
        {#if errors['label']}
            <Helper class="mt-2" color="red">
                {errors['label'].message}
            </Helper>
        {/if}
    </div>

    <div class="mb-4 mt-4">
        <Label>Placeholder</Label>
        <Input label="Placeholder" placeholder="Field Placeholder" bind:value={model.placeholder} />
        {#if errors['placeholder']}
            <Helper class="mt-2" color="red">
                {errors['placeholder'].message}
            </Helper>
        {/if}
    </div>
    <div class="mb-4 mt-4">
        <Label for="type" class="mb-2">Field Type</Label>
        <Select id="type" size="sm" class="mt-2" bind:value={model.type} on:change={onChangeType}>
            {#each fieldTypes as type}
                <option value={type.name}>{type.label} ({type.description})</option>
            {/each}
        </Select>
        {#if errors['type']}
            <Helper class="mt-2" color="red">
                {errors['type'].message}
            </Helper>
        {/if}
    </div>
    {#if fieldTypeHasSettings}
        <div class="ml-4 grid grid-cols-3 gap-4">
            <CustomFields fields={fieldTypeHasSettings} let:field={field} fieldPrimaryKey="varName" bind:model={model.fieldSettings}>

            </CustomFields>
        </div>
        {/if}

    <div class="mb-4 mt-4">
        <Label>Group</Label>
        <Input label="Group" placeholder="Group" bind:value={model.group}   />
        <Helper class="mt-2 text-sm">
            Arbitrary group name
        </Helper>
    </div>

    <div class="mb-4 mt-4">
        <Label>Hint</Label>
        <Input label="Hint" placeholder="Hint" bind:value={model.hint} />
        <Helper class="mt-2 text-sm">
            Hint is displayed below the field to provide additional usage information
        </Helper>
    </div>

    <div class="grid grid-cols-3 gap-4">
        <CustomFields fields={fieldSettings} let:field={field} fieldPrimaryKey="varName" bind:model={model}>

        </CustomFields>
    </div>
    <div class="mb-4 mt-4">

        <Button type="submit" size="sm" color="green" class="w-full">
            Save
        </Button>
    </div>
</form>
    {/if}
