<script lang="ts">
    import type {IDynamicFieldConfigBlueprint} from "../DynamicFields/types";
    import {createEventDispatcher, onMount} from "svelte";
    import Input from "../Shared/Input.svelte";
    import {CustomFieldsService} from "./services/custom-fields.service";
    import {Button, Helper, Label, Select} from "flowbite-svelte";
    import type {IEvent} from "../Shared/models/generic";
    import { z} from 'zod';
    import CustomFields from './group-field-renderer.svelte';
    import {setNotificationAction} from "../stores";


    const dispatch = createEventDispatcher();
    export let model: Partial<IDynamicFieldConfigBlueprint>;
    export let modelName: string = undefined;
    export let onSave: (model: Partial<IDynamicFieldConfigBlueprint>) => void = undefined;
    const fieldTypes = CustomFieldsService.getFieldTypes();
    const fieldSettings = CustomFieldsService.getFieldSettings();
    const schema = z.object({
        varName: z.string().min(1, 'Var name is required'),
        label: z.string().min(1, 'Label is required'),
        placeholder: z.string().min(1, 'Placeholder is required'),
        type: z.string().min(1, 'Type is required'),
    });

    onMount((async () => {
        console.log(model);
    }));


    async function save() {
        try {
            schema.parse(model)
        }
        catch (e) {
            console.log(e.issues);
            return;
        }

        await (new CustomFieldsService()).sync(modelName, model);
        setNotificationAction({
            message: 'Saved successfully',
            type: 'success',
        });

        if (onSave) {
            onSave(model);
        }

        dispatch('save', model);
    }

    function onChangeType(e: IEvent<string>) {
        console.log(e.detail)
    }

</script>

<form on:submit|preventDefault={save}>
<div class="mb-4 mt-4">
    <Input label="Label" placeholder="Field Label" bind:value={model.label} />
</div>

<div class="mb-4 mt-4">
    <Input label="Placeholder" placeholder="Field Placeholder" bind:value={model.placeholder} />
</div>
<div class="mb-4 mt-4">
    <Label for="type" class="mb-2">Field Type</Label>
<Select id="type" size="sm" class="mt-2" bind:value={model.type} on:change={onChangeType}>
    {#each fieldTypes as type}
        <option value={type.name}>{type.label} ({type.description})</option>
    {/each}
</Select>
</div>

    <div class="mb-4 mt-4">
        <Input label="Group" placeholder="Group" bind:value={model.group} required={false} />
        <Helper class="mt-2 text-sm">
            Arbitrary group name
        </Helper>
    </div>

    <div class="mb-4 mt-4">
        <Input label="Hint" placeholder="Hint" bind:value={model.hint} required={false} />
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
