<script lang="ts">
    import type {ProductModel} from "../../../models/product.model";
    import {Input, Label, NumberInput} from "flowbite-svelte";
    import FormError from "../../../../Shared/form-error.svelte";
    import type {ZodError} from "zod";
    import Hint from "../../../../Shared/field-hint.svelte";
    import type {IDynamicFieldConfigBlueprint} from "../../../../DynamicFields/types";
    import {findFieldInArray} from "../../../../helpers/data";

    export let model: ProductModel;
    export let errors: Partial<ZodError> = {};
    export let fields: IDynamicFieldConfigBlueprint[] = [];
</script>

<div class="my-4">
    <Label for="title">Price</Label>
    <div>
        <NumberInput bind:value={model.price} placeholder="Price" step="0.01"
               type="text" id="price" name="price" autocomplete="price" />
        <Hint>{findFieldInArray(fields, 'price').hint || ''}</Hint>
        <FormError {errors} key="price" />
    </div>
</div>

<div class="my-4">
    <Label for="title">Sale Price</Label>
    <div>
        <NumberInput bind:value={model.salePrice} placeholder="Sale Price" step="0.01"
               type="text" id="salePrice" name="salePrice" autocomplete="salePrice" />
        <Hint>{findFieldInArray(fields, 'salePrice').hint || ''}</Hint>
        <FormError {errors} key="salePrice" />
    </div>
</div>

<div class="my-4">
    <Label for="title">Cost</Label>
    <div>
        <NumberInput bind:value={model.cost} placeholder="Cost" step="0.01"
               type="text" id="cost" name="cost" autocomplete="cost" />
        <Hint>{findFieldInArray(fields, 'cost').hint || ''}</Hint>
        <FormError {errors} key="cost" />
    </div>
</div>
