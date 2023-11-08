<script lang="ts">
    import type {ProductModel} from "../../../models/product.model";
    import {Input, Label} from "flowbite-svelte";
    import FormError from "../../../../Shared/form-error.svelte";
    import type {ZodError} from "zod";
    import type {IDynamicFieldConfigBlueprint} from "../../../../DynamicFields/types";
    import CustomFields from "../../../../CustomFields/group-field-renderer.svelte";
    import FieldRenderer from "../../../../CustomFields/single-field-renderer.svelte";

    export let model: ProductModel;
    export let errors: Partial<ZodError> = {};
    export let fields: IDynamicFieldConfigBlueprint[] = [];

    let extraFields = fields.filter(field => ['title', 'sku'].indexOf(field.varName) === -1);

</script>
<div class="my-4">
    <Label for="title">Title</Label>
    <div>
        <Input bind:value={model.title} placeholder="Title"
               type="text" id="title" name="title" autocomplete="title" />
        <FormError {errors} key="title" />
    </div>
</div>

<div class="my-4">
    <Label for="title">SKU</Label>
    <div>
        <Input bind:value={model.sku} placeholder="SKU"
               type="text" id="sku" name="sku" autocomplete="sku" />
        <FormError {errors} key="sku" />
    </div>
</div>

<CustomFields fields={extraFields} let:field={field}>
    <div class="my-4">
        <FieldRenderer {field} bind:model={model[field['varName']]} />
    </div>
</CustomFields>
