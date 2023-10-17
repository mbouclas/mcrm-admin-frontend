<script lang="ts">
import type {IEditableRegion} from "../models";
import type {IGenericObject} from "../../Shared/models/generic";
import CustomFields from "../../CustomFields/group-field-renderer.svelte";

export let model: IGenericObject = {};
export let region: IEditableRegion;


</script>
<div class="my-4 border border-1 border-gray-500 rounded-xl p-4">
    <CustomFields fields={region.fields} let:field={field} fieldPrimaryKey="varName" bind:model={model}>

    </CustomFields>
</div>
