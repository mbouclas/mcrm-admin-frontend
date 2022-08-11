<script lang="ts">

    import type {IDynamicFieldConfigBlueprint} from "../types";
    import {onMount} from "svelte";
    export let field: IDynamicFieldConfigBlueprint;
    export let onChange;
    export let model;
    export let placeholder;
    export let label;
    export let helperText;
    export let inputId: string;
    export let classes: string[] = [];

    let pristine = true;
    let value = field.value || '';

    let Editor;

    onMount(async () => {

    });

    let onValueChange = (key, value) => {
        pristine = false
        if (typeof onChange === 'function') {
            onChange(key, value);
        }
    }
</script>
<!--<textarea bind:this={textarea} />-->
