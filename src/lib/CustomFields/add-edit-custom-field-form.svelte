<script lang="ts">
    import type {IDynamicFieldConfigBlueprint} from "../DynamicFields/types";
    import {createEventDispatcher, onMount} from "svelte";
    import {Button, Helper, Label, Select, Input, Heading, Checkbox, NumberInput, Hr} from "flowbite-svelte";
    import type {IEvent} from "../Shared/models/generic";
    import {z, ZodError} from 'zod';
    import CustomFields from './group-field-renderer.svelte';
    import {CustomFieldModel} from "./models/custom-field.model";
    import {CustomFieldsService} from "./services/custom-fields.service";
    import {formatZodErrors} from "../helpers/errors";
    import {setNotificationAction} from "../stores";
    import OptionBuilder from './select-option-builder.svelte';
    import ListFields from "./list-fields.svelte";

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
            dispatch('save', model);
            return;
        }

        dispatch('save', model);

        setNotificationAction({
            message: 'Field saved',
            type: 'success'
        })
    }

    function onChangeType(e: IEvent<string>) {

    }

    function onListFieldsSave(a) {
        console.log(a)
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

    {#if ['select', 'multiselect'].indexOf(model.type) !== -1}
        <Heading tag="h5" class="text-base">Select Options</Heading>
        <OptionBuilder bind:model={model.options} />
        {/if}

    {#if ['group', 'repeater', 'nested'].indexOf(model.type) !== -1}
        <ListFields bind:model={model.fields} on:save={onListFieldsSave}>
            <svelte:fragment slot="heading">Group Fields</svelte:fragment>
        </ListFields>
    {/if}

    {#if ['number'].indexOf(model.type) !== -1}
        <Hr />
        <div class="grid grid-cols-3 gap-2">
            <div class="mb-4 mt-4">
                <Label>Min</Label>
                <NumberInput placeholder="Min" bind:value={model.min}   />
                <Helper class="mt-2 text-sm">
                    Minimum Value
                </Helper>
            </div>

            <div class="mb-4 mt-4">
                <Label>Max</Label>
                <NumberInput placeholder="Max" bind:value={model.min}   />
                <Helper class="mt-2 text-sm">
                    Maximum Value
                </Helper>
            </div>

            <div class="mb-4 mt-4">
                <Label>Step</Label>
                <NumberInput placeholder="Step" bind:value={model.step}   />
                <Helper class="mt-2 text-sm">
                    Step Value
                </Helper>
            </div>
        </div>
        <Hr />
        {/if}

    <div class="mb-4 mt-4">
        <Label>Group Name</Label>
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

    <div class="mb-4 mt-4">
        <Label>Default Value</Label>
        <Input label="Default Value" placeholder="Default Value" bind:value={model.default} />
        <Helper class="mt-2 text-sm">
            Default value of the field
        </Helper>
    </div>

    <Hr />
    <div class="grid grid-cols-3 gap-2">
        <div class="mb-4 mt-4">
            <Checkbox checked={model.required} on:change={() => model.required = !model.required}>Required</Checkbox>
            <Helper class="mt-2 text-sm">
                Is this field required to have a value
            </Helper>
        </div>

        <div class="mb-4 mt-4">
            <Checkbox checked={model.isSortable} on:change={() => model.isSortable = !model.isSortable}>Sortable</Checkbox>
            <Helper class="mt-2 text-sm">
                Is this field sortable in results
            </Helper>
        </div>

        <div class="mb-4 mt-4">
            <Checkbox checked={model.exported} on:change={() => model.exported = !model.exported}>Exported</Checkbox>
            <Helper class="mt-2 text-sm">
                Is this field included in exports
            </Helper>
        </div>



        <div class="mb-4 mt-4">
            <Checkbox checked={model.isSlug} on:change={() => model.isSlug = !model.isSlug}>Slug Field</Checkbox>
            <Helper class="mt-2 text-sm">
                Is this field slug for some other field
            </Helper>
            {#if model.isSlug}
            <div class="my-4">
                <Label>Slug from</Label>
                <Input label="Slug from" placeholder="Slug from" bind:value={model.slugFrom} />
                <Helper class="mt-2 text-sm">
                    Which field should we use to generate slug. Default is title
                </Helper>
            </div>
                {/if}
        </div>
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
