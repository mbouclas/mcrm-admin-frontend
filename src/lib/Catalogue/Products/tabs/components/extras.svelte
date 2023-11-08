<script lang="ts">
    import type {ProductModel} from "../../../models/product.model";
    import type {ZodError} from "zod";
    import CustomFields from "../../../../CustomFields/group-field-renderer.svelte";
    import FieldRenderer from "../../../../CustomFields/single-field-renderer.svelte";
    import type {IDynamicFieldConfigBlueprint} from "../../../../DynamicFields/types";

    export let model: ProductModel;
    export let errors: Partial<ZodError>;
    export let fields: IDynamicFieldConfigBlueprint[] = [];
</script>
<CustomFields {fields} let:field={field}>
    <div class="my-4">
        <FieldRenderer {field} bind:model={model[field['varName']]} />
    </div>
</CustomFields>
