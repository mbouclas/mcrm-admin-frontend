<script lang="ts">
    import type {IEditableRegion, IEditableRegionLayout} from "../models";
import type {IGenericObject} from "../../Shared/models/generic";
import {EditableRegionsService} from "../editable-regions.service";
    import {schemaToFields} from "../../helpers/data";
    import {onMount} from "svelte";
    import CustomFields from "../../CustomFields/group-field-renderer.svelte";
    import {Heading} from "flowbite-svelte";

export let model: IGenericObject = {};
export let region: IEditableRegion;
export let layout: IEditableRegionLayout;
let fields = [],
    ready = false;

onMount(async () => {
    const executor = await new EditableRegionsService().getExecutor(region.executor);
    fields = schemaToFields(executor['settingsSchema']);
    ready = true;
})

</script>
{#if ready}
<div class="my-4">
    <Heading tag="h4">Executor Settings</Heading>
    <CustomFields {fields} let:field={field} fieldPrimaryKey="varName" bind:model={model}>

    </CustomFields>
</div>
{/if}
