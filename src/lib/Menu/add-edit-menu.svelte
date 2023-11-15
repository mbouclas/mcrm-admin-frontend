<script lang="ts">
    import  {MenuModel} from "./models";
    import {onMount} from "svelte";
    import {MenuService} from "./menu.service";
    import {Button, Helper, Input, Label, Textarea, Toggle} from "flowbite-svelte";
    import {ZodError} from "zod";
    import {formatZodErrors} from "../helpers/errors";

    export let model: MenuModel = new MenuModel();
    export let onSave: (model: MenuModel) => void;
    const menuService = new MenuService();
    let ready = false,
    errors = {};

    onMount(async () => {
        if (model.uuid) {
            model = await menuService.getMenu(model.uuid);
        }

        ready = true;
    });

    async function save() {
        try {
            MenuModel.modelSchema.parse(model);
        }
        catch (e) {
            if (e instanceof ZodError) {
                errors = formatZodErrors(e);
            }
            console.log(errors)
            return;
        }

        if (model.uuid) {
            await menuService.updateMenu(model.uuid, model);
        }
        else {
            const res = await menuService.createMenu(model);
            model.uuid = res.uuid;
        }

        if (onSave) {
            onSave(model);
        }
    }
</script>
{#if ready}
<form on:submit|preventDefault={save}>

    <div class="my-4">
        <Label>Title</Label>
        <Input bind:value={model.title} placeholder="Title" />
        {#if errors['title']}
            <Helper class="mt-2" color="red">
                {errors['title'].message}
            </Helper>
        {/if}
    </div>

    <div class="my-4">
        <Label>Description</Label>
        <Textarea bind:value={model.description} placeholder="Description" />
        {#if errors['description']}
            <Helper class="mt-2" color="red">
                {errors['description'].message}
            </Helper>
        {/if}
    </div>

    <div class="my-4">
        <Label>Caption</Label>
        <Textarea bind:value={model.caption} placeholder="Caption" />
        {#if errors['caption']}
            <Helper class="mt-2" color="red">
                {errors['caption'].message}
            </Helper>
        {/if}
    </div>

    <div class="mb-4 mt-4">

        <Button type="submit" size="sm" color="green" class="w-full">
            Save
        </Button>
    </div>
</form>

{/if}
