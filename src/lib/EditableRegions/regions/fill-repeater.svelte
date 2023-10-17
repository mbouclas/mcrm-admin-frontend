<script lang="ts">
    import type {IEditableRegion} from "../models";
    import CustomFields from "../../CustomFields/group-field-renderer.svelte";
    import {Button, Heading} from "flowbite-svelte";
    import type {IGenericObject} from "../../Shared/models/generic";
    import {setupModelFromFields} from "../../helpers/data";
    import {onMount} from "svelte";
    import {Plus} from "svelte-heros-v2";

    export let model: IGenericObject[] = [];
    export let region: IEditableRegion;

    onMount(() => {
        if (model.length === 0) {
            onAddNewRow();
        }
    });

    function onAddNewRow() {
        const temp = [...model];
        temp.push(setupModelFromFields({},region.fields));
        model = temp;
    }

</script>
<div class="flex justify-end">
    <Button color="blue" on:click={onAddNewRow}><Plus /></Button>
</div>

{#each model as item}
    <div class="my-4 border border-1 border-gray-500 rounded-xl p-4">
        <CustomFields fields={region.fields} let:field={field} fieldPrimaryKey="varName" bind:model={item}>

        </CustomFields>
    </div>
{/each}
