<script lang="ts">
    import type {ProductVariantModel} from "../../models/product-variant.model";
    import type {ZodError} from "zod";
    import type {IDynamicFieldConfigBlueprint} from "../../../DynamicFields/types";
    import CustomFields from "../../../CustomFields/group-field-renderer.svelte";
    import FieldRenderer from "../../../CustomFields/single-field-renderer.svelte";
    import {onMount} from "svelte";

    export let model: ProductVariantModel;
    export let errors: Partial<ZodError>;
    export let fields: IDynamicFieldConfigBlueprint[] = [];
    let ready = false;

    console.log(fields)
    onMount(() => {
        ready = true;
    });

</script>
{#if ready}
<CustomFields {fields} let:field={field}>
    <div class="my-4">
        <FieldRenderer {field} bind:model={model[field['varName']]} />
    </div>
</CustomFields>
{/if}
