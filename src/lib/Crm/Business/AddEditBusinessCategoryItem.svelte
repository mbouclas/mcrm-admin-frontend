<script lang="ts">
    import {BusinessCategoryModel} from "../models/business-category.model";
    import {BusinessCategoryService} from "../services/businessCategory.service";
    import {onMount} from "svelte";
    import {ZodError} from "zod";
    import {formatZodErrors} from "../../helpers/errors";
    import {Button, Input} from "flowbite-svelte";
    import {AppService} from "../../Shared/app.service";
    import {setupModelFromFields} from "../../helpers/data";
    import Image from "../../DynamicFields/fields/image.svelte";
    import Fields from "../../DynamicFields/Renderer.svelte";

    export let model: BusinessCategoryModel = new BusinessCategoryModel();
    export let parent: BusinessCategoryModel = null;
    const service = new BusinessCategoryService();
    export let onSave: (model: BusinessCategoryModel) => void;
    let ready = false,
        errors = {};
    const Model = AppService.getModel('BusinessCategory');
    const fields = Model.fields.filter(field => {
        return !field.isSlug;
    });
    const seoFields = Model.fields.filter(field => {
        return field.group === 'seo';
    });

    let parentCategoryName = 'Root';

    onMount(async () => {
        if (model.uuid) {
            model = await service.findOne(model.uuid);
        }

        model = setupModelFromFields<BusinessCategoryModel>(model, fields);

        if (parent) {
            parentCategoryName = parent.title;
            model.parentUuid = parent.uuid;
        }


        ready = true;
    });

    async function save() {
        try {
            BusinessCategoryModel.modelSchema.parse(model);
        }
        catch (e) {
            if (e instanceof ZodError) {
                errors = formatZodErrors(e);
            }
            console.log(errors)
            return;
        }

        if (model.uuid) {
            await service.update(model.uuid, model);
        }
        else {
            const res = await service.store(model);
            model.uuid = res.uuid;
        }

        if (onSave) {
            onSave(model);
        }
    }

    const handleSeoChange = (e) => {
        model['seo'][e.detail.key] = e.detail.value;
    };
</script>
{#if ready}
    <form on:submit|preventDefault={save}>
        <div class="p-4">

            <p class="mb-4"><span>Parent Category: </span><span class="font-semibold">{parentCategoryName}</span></p>

            <div class="mb-4">
                <label for="title" class="block mb-2">Title:</label>
                <Input id="title" bind:value={model.title} required class="w-full" />
            </div>

            <div class="mb-4">
                <label for="description" class="block mb-2">Description:</label>
                <Input id="description" bind:value={model.description} class="w-full" />
            </div>

            <div class="my-4">
                <Image
                        model={model?.thumb || ''}
                        title="Category thumbnail"
                        maxNumberOfFiles={1}
                        module="PageCategory"
                        itemId={model.uuid}
                        type="main"
                        on:allUploadsComplete={(e) => {
          //category.thumb = e.detail;
        }}
                />
            </div>

            <div class="my-4">

            <Fields fields={seoFields} model={model?.seo} module="CRM" itemId={model.uuid} on:change={handleSeoChange} />
            </div>
        </div>

        <div class="my-4">

            <Button type="submit" size="sm" color="green" class="w-full">
                Save
            </Button>
        </div>
    </form>
{/if}
