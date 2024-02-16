<script lang="ts">
    import {Button, Heading, Input} from "flowbite-svelte";
    import {createEventDispatcher} from "svelte";
    import {z, ZodError} from "zod";
    import {formatZodErrors} from "../../helpers/errors";
    import FormError from "../../Shared/form-error.svelte";
    import {BusinessModel} from "../models/business.model";
    import {BusinessService} from "../services/business.service";


    const dispatch = createEventDispatcher();
    let model = new BusinessModel(),
        errors = {};
    export let onSave: (model: BusinessModel) => void;

    const schema = z.object({
        title: z.string({required_error: 'Title is required'}).min(3, 'Title must be at least 3 characters long'),
    });

    async function save() {
        errors = {};
        try {
            schema.parse(model);
        }
        catch (e) {
            if (e instanceof ZodError) {
                errors = formatZodErrors(e);
            }
            console.log(errors)
            return;
        }

        const res = await new BusinessService().store(model);
        model.uuid = res.uuid;

        if (onSave) {
            onSave(model);
        }

        dispatch('save', model);
    }

</script>
<Heading tag="h4">Start by adding the name of the Business</Heading>
<form on:submit|preventDefault={save}>
    <div class="my-4">
        <Input label="Title" placeholder="Title" bind:value={model.title}  />
        <FormError {errors} key="title" />
    </div>
    <div class="mb-4 mt-4">

        <Button type="submit" size="sm" color="blue" class="w-full">
            Next
        </Button>
    </div>
</form>
