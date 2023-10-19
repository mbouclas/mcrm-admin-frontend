<script lang="ts">
    import type {IDynamicFieldConfigBlueprint} from "../DynamicFields/types";
    import FieldRenderer from './single-field-renderer.svelte';

    export let fields: Partial<IDynamicFieldConfigBlueprint>[] = [];
    export let model: any = {};
    export let fieldPrimaryKey = 'varName';
    export let wrapperClass = 'mb-4 mt-4';
    export let outerClass = '';



</script>
{#if typeof model !== 'undefined'}
<slot name="heading"></slot>
    <div class={outerClass}>
        <slot name="before-fields"></slot>
{#each fields as field}
    <div class={wrapperClass}>
        <slot {field}>
            <FieldRenderer {field} bind:model={model[field[fieldPrimaryKey]]} indentNested={true} />
        </slot>
    </div>
{/each}
    </div>
    {/if}
<!--
@component
@slot field
@prop {IDynamicFieldConfigBlueprint[]} fields
@prop {any} model. Must be an object with keys matching the `varName` of the fields
@prop {string} fieldPrimaryKey
@prop {string} wrapperClass

You can call this component with a slot named `field` to customize the rendering of each field.
# Example. The contents of the slot will be rendered for each field instead of the default
```
<CustomFields fields={fieldSettings} let:field={field}>
    <div class="mb-4 mt-4">
        <FieldRenderer {field} bind:model={model[field[fieldPrimaryKey]]} />
    </div>
</CustomFields>
```
-->
