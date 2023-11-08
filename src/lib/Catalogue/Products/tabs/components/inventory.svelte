<script lang="ts">
    import type {ProductModel} from "../../../models/product.model";
    import type {ZodError} from "zod";
    import type {IDynamicFieldConfigBlueprint} from "../../../../DynamicFields/types";
    import CustomFields from "../../../../CustomFields/group-field-renderer.svelte";
    import FieldRenderer from "../../../../CustomFields/single-field-renderer.svelte";
    import {onMount} from "svelte";

    export let model: ProductModel;
    export let errors: Partial<ZodError>;
    export let fields: IDynamicFieldConfigBlueprint[] = [];
    let ready = false;

    onMount(() => {
        ready = true;
    })
</script>
{#if ready}
    <CustomFields fields={fields} let:field={field}  >
        <div class="my-4">
            <FieldRenderer {field} bind:errors={errors} bind:model={model[field['varName']]} outerClass={''} useHeadingsForNestedFields={false} />
        </div>
    </CustomFields>
{/if}
