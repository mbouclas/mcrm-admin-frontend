<script lang="ts">
    import type {ProductModel} from "../../../models/product.model";
    import type {IDynamicFieldConfigBlueprint} from "../../../../DynamicFields/types";
    import CustomFields from "../../../../CustomFields/group-field-renderer.svelte";
    import FieldRenderer from "../../../../CustomFields/single-field-renderer.svelte";
    import type {ZodError} from "zod";
    import {onMount} from "svelte";
    import {setupModelFromFields} from "../../../../helpers/data";

    export let model: ProductModel;
    export let fields: IDynamicFieldConfigBlueprint[] = [];
    export let errors: Partial<ZodError>;
    let ready = false;
    onMount(() => {
        if (typeof model['storefront'] !== 'object') {
            model['storefront'] = setupModelFromFields({}, fields[0].fields);
        }


        ready = true;
    });
</script>
{#if ready}
<CustomFields fields={fields[0].fields} let:field={field}  >
    <div class="my-4">
        <FieldRenderer {field} bind:errors={errors} bind:model={model['storefront'][field['varName']]} outerClass={''} useHeadingsForNestedFields={false} />
    </div>
</CustomFields>
    {/if}
