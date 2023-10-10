<script lang="ts">
    import type {IDynamicFieldConfigBlueprint} from "../DynamicFields/types";
    import {Checkbox, Input, Label, Textarea, Toggle} from "flowbite-svelte";
    import Renderer from './group-field-renderer.svelte';
    import {schemaToFields} from "../helpers/data";

    export let field: Partial<IDynamicFieldConfigBlueprint>;
    export let indentNested = false;
    export let indentNestedClass = 'ml-3';
    export let model: any;
    let fields;
    export let color = field['color'] || 'primary';

    if (typeof model === 'undefined') {
        switch (field.type) {
            case 'boolean':
            case 'switch':
            case 'toggle':
                model = false;
                break;
            case 'array':
                model = [];
                break;
            case 'json':
                model = {};
                break;
            default:
                model = '';
        }
    }


    if (field.schema) {
        fieldsFromSchema();

    }


    function fieldsFromSchema() {
        fields = schemaToFields(field.schema);
    }

</script>

{#if ['input', 'text', 'string'].indexOf(field.type) !== -1}
    <Label>{field.label}</Label>
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
{:else if ['textarea', 'description'].indexOf(field.type) !== -1}
    <Label>{field.label}</Label>
    <Textarea id={field.varName || field.name}
              bind:value={model}
              type={field.type}
              label={field.label}
              placeholder={field.placeholder || field.label} ></Textarea>
{:else if field.schema && Array.isArray(fields)}
    <div class={`${indentNested ? indentNestedClass : ''}`}>
    <Renderer fields={fields} bind:model={model}  />
    </div>
{/if}

