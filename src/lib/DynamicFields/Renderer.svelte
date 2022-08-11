<script lang="ts">
    import {onMount} from "svelte";
    import Input from './fields/input.svelte';
    import type {IDynamicFieldConfigBlueprint} from "./types";

    export let model = {};
    export let fields: IDynamicFieldConfigBlueprint = [];

    function onModelChange(key, value) {
        console.log(key, value)
    }

</script>
{#each fields as field}
    {#if field.type === 'text'}
        <Input field={field} bind:model={model[field.varName]} onChange={onModelChange} />
    {/if}
{/each}
Renderer
