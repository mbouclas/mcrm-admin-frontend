<script lang="ts">
    import {createEventDispatcher, onMount} from "svelte";
import {CustomerGroupModel} from "./models/customer-group.model";
import {AppService} from "../Shared/app.service";
    import {CustomerGroupSchema, UserGroupService} from "./services/user-group.service";
    import {ZodError} from "zod";
    import Loading from "../Shared/Loading.svelte";
    import {Button, Checkbox, Heading, Input, Label} from "flowbite-svelte";
    import FormError from "../Shared/form-error.svelte";
    import {formatZodErrors} from "../helpers/errors";

const dispatch = createEventDispatcher();
export let model: CustomerGroupModel = new CustomerGroupModel();
export let uuid: string = undefined;
export let onSave: (model: CustomerGroupModel) => void;
const customerGroupModel = AppService.getModel('UserGroup');
const service = new UserGroupService();
let errors: {[key: string]: ZodError} = {};
const fields = customerGroupModel.fields.filter(field => {
    return !field.isSlug;
});

let ready = false;

    onMount(async () => {
        if (uuid) {
            model = await service.findOne(uuid);
        }

        ready = true;


    });

    async function save() {
        errors = {};
        try {
            CustomerGroupSchema.parse(model);
        }
        catch (e) {
            if (e instanceof ZodError) {
                errors = formatZodErrors(e);
            }
            console.log(errors)
            return;
        }


        if (uuid) {
            await service.update(uuid, model);
        } else {
            await service.store(model);
        }


        if (onSave) {
            onSave(model);
        }

        dispatch('saved', model);
    }
</script>
{#if !ready}
    <div class="flex justify-center">
        <Loading />
    </div>
{:else}
    {#if $$slots.heading}
        <slot name="heading">
            <Heading tag="h6" slot="heading"></Heading>
        </slot>
    {/if}

    <form on:submit|preventDefault={save}>
        <div class="my-4">
            <Label for="title">Title</Label>
            <div>
                <Input bind:value={model.title} placeholder="Title"
                       type="text" id="title" name="title" autocomplete="title" />
                <FormError {errors} key="title" />
            </div>
        </div>

        <div class="my-4">
            <Label for="description">Description</Label>
            <div>
                <Input bind:value={model.description} placeholder="Description"
                       type="text" id="description" name="description" autocomplete="description" />
                <FormError {errors} key="description" />
            </div>
        </div>

        <div class="my-4">
            <Checkbox value={model.active} checked={model.active} on:change={() => model.active = !model.active}>Active</Checkbox>
        </div>

        <div class="my-4">
            <Checkbox value={model.default} checked={model.default} on:change={() => model.default = !model.default}>Default</Checkbox>
        </div>

        <slot name="actions">
            <div class="my-4">
                <Button type="submit" color="blue" class="w-full">Save</Button>
            </div>
        </slot>
    </form>
    {/if}
