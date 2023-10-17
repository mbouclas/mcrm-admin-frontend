<script lang="ts">
    import {Button, Heading, Input} from "flowbite-svelte";
    import {createEventDispatcher} from "svelte";
    import type {IEditableRegion} from "../models";


    const dispatch = createEventDispatcher();
    export let onSave: (model: Partial<IEditableRegion>) => void = undefined;
    let model: Partial<IEditableRegion> = {};

    async function save() {
        onSave(res);
        dispatch('save', res);
    }
</script>
<Heading tag="h4">Start by adding the channels name</Heading>
<form on:submit|preventDefault={save}>
    <div class="my-4">
        <Input label="Title" placeholder="Title" bind:value={model.label} required={true} />
    </div>
    <div class="mb-4 mt-4">

        <Button type="submit" size="sm" color="blue" class="w-full">
            Next
        </Button>
    </div>
</form>
