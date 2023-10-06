<script lang="ts">
    import type {IDynamicFieldConfigBlueprint} from "../DynamicFields/types";
    import {createEventDispatcher, onMount} from "svelte";
    import {Button, Heading, Input} from "flowbite-svelte";
    import {CustomFieldModel} from "./models/custom-field.model";

    const dispatch = createEventDispatcher();
    export let modelName: string;
    export let onSave: (model: Partial<IDynamicFieldConfigBlueprint>) => void = undefined;
    let model = new CustomFieldModel();
    onMount(() => {

    })

    function save() {
        onSave(model);
        dispatch('save', model);
    }
</script>

<Heading tag="h4">Start by adding the field variable name</Heading>
<form on:submit|preventDefault={save}>
<div class="my-4">
    <Input label="Field varName" placeholder="Field varName" bind:value={model.varName} required={true} />
</div>
<div class="mb-4 mt-4">

    <Button type="submit" size="sm" color="blue" class="w-full">
        Next
    </Button>
</div>
</form>

<!--
@component CustomFieldForm
@param onSave
@param modelName
@description
    This component is used to create a new custom field.
    It returns an instance of a CustomFieldModel.
-->
