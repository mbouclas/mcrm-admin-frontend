<script lang="ts">
    import type {IDynamicFieldConfigBlueprint} from "../DynamicFields/types";
    import {Checkbox, Input, Toggle} from "flowbite-svelte";

    export let field: Partial<IDynamicFieldConfigBlueprint>;
    export let model: any;
    export let color = field['color'] || 'primary';

    if (['boolean', 'switch', 'toggle'].indexOf(field.type) !== -1 && typeof model === 'undefined') {
        model = false;
    }

</script>

{#if ['input', 'text', 'string'].indexOf(field.type) !== -1}
    <Input id={field.varName || field.name}
           bind:value={model}
           type={field.type}
           label={field.label}
           placeholder={field.placeholder || field.label}
    />
    {#if field.hint}
        <small class="text-muted">{field.hint}</small>
    {/if}
{:else if ['boolean', 'switch', 'toggle'].indexOf(field.type) !== -1}
    <Checkbox bind:checked={model} {color}>{field.label}</Checkbox>
    {#if field.hint}
        <small class="text-muted">{field.hint}</small>
    {/if}
{/if}
