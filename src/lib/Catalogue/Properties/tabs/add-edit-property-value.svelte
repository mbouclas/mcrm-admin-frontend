<script lang="ts">
    import {PropertyModel, PropertyValueModel} from "../../models/property.model";
    import {AppService} from "../../../Shared/app.service";
    import {PropertiesService} from "../../services/properties/properties.service";
    import {onMount} from "svelte";
    import {Button, Helper, Input, Label, Textarea} from "flowbite-svelte";
    import Image from '../../../DynamicFields/fields/image.svelte';
    import Card from "../../../Shared/card.svelte";
    import {PropertyValueService} from "../../services/properties/property-value.service";

    export let model = new PropertyValueModel();
    export let property: PropertyModel;
    export let onSave: (item: PropertyValueModel) => void;
    const Model = AppService.getModel('PropertyValue');
    const service = new PropertiesService();
    let image;

    let ready = false,
        errors = {};

    onMount(async() => {
        if (typeof model.image !== 'object') {
            model.image = Object.assign({}, {url: model.image});
        }

        ready = true;
    })

    async function save() {
        if (!model.uuid) {
            await (new PropertyValueService().store(model, property.uuid));

            return;
        }

        await (new PropertyValueService().update(model.uuid, model));
    }
</script>
<form on:submit|preventDefault={save}>
    <div class="my-4">
        <Label>Name</Label>
        <Input bind:value={model.name} placeholder="Name" />
        {#if errors['name']}
            <Helper class="mt-2" color="red">
                {errors['name'].message}
            </Helper>
        {/if}
    </div>

{#if property.type === 'color'}
    <div class="my-4">
        <Label>Color</Label>
        <Input bind:value={model.color} placeholder="Color" />
        {#if errors['color']}
            <Helper class="mt-2" color="red">
                {errors['color'].message}
            </Helper>
        {/if}
    </div>

    <div class="my-4">
        <Label>Code</Label>
        <Input bind:value={model.code} placeholder="Code" />
        {#if errors['code']}
            <Helper class="mt-2" color="red">
                {errors['code'].message}
            </Helper>
        {/if}
    </div>

{:else}


{/if}

    <div class="my-4">
        <Card id="image">
            <svelte:fragment slot="header">Image</svelte:fragment>
            <Image
                    model={model?.image || ''}
                    title="thumbnail"
                    maxNumberOfFiles={1}
                    module="PropertyValue"
                    itemId={model.uuid}
                    type="main"
                    classes="h-64"
                    on:allUploadsComplete={(e) => {
          //category.thumb = e.detail;
        }}
            />
        </Card>
    </div>

    <div class="mb-4 mt-4">

        <Button type="submit" size="sm" color="green" class="w-full">
            Save
        </Button>
    </div>
</form>
