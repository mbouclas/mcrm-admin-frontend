<script lang="ts">
    import {type ISalesChannel, SalesChannelsService} from "./services/sales-channels.service";
    import {createEventDispatcher, onMount} from "svelte";
    import {AppService} from "../Shared/app.service";
    import CustomFields from '../CustomFields/group-field-renderer.svelte';
    import {Button} from "flowbite-svelte";
    import {schemaToFields, setupModelFromFields} from "../helpers/data";

    const dispatch = createEventDispatcher();
    export let model: ISalesChannel;
    const s = new SalesChannelsService();
    const SalesChannelModel = AppService.getModel('SalesChannel');
    const fields = SalesChannelModel.fields.filter(field => {
        return !field.isSlug;
    });
    let ready = false;

    onMount(async () => {
        const channel = await s.findOne(model.uuid, ['*']);
        model = setupModelFromFields<ISalesChannel>(channel, fields);
        ready = true;
    });

    async function save() {
        await s.update(model.uuid, model);
        dispatch('save', model);
    }
</script>
{#if ready}

    <form on:submit|preventDefault={save}>
<CustomFields fields={fields} let:field={field} fieldPrimaryKey="varName" bind:model={model}>

</CustomFields>

    <div class="mb-4 mt-4">

        <Button type="submit" size="sm" color="green" class="w-full">
            Save
        </Button>
    </div>
    </form>

    {/if}
