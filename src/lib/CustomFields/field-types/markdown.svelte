<script lang="ts">
    import {afterUpdate, createEventDispatcher, onDestroy, onMount} from 'svelte';
    import Hint from '../../Shared/field-hint.svelte';
    import {v4} from "uuid";
    import {Heading} from "flowbite-svelte";
    import type {IDynamicFieldConfigBlueprint} from "../../DynamicFields/types";
    const dispatch = createEventDispatcher();
    export let field: IDynamicFieldConfigBlueprint;
    export let model = '';
    let id = v4();
    let easyMDE;


    onMount(() => {
        setTimeout(() => {
            easyMDE = new EasyMDE({
                element: document.getElementById(id)
            });

            easyMDE.codemirror.on("change", () => {
                model = easyMDE.value();
                dispatch('update', easyMDE.value());
            });
        });
    })

    afterUpdate(() => {

    });

    onDestroy(() => {
        if (easyMDE && easyMDE.toTextArea) {
            easyMDE.toTextArea();
        }

        easyMDE = null;
    })

</script>
{#if $$slots.heading}
    <div class="my-4">
        <Heading tag="h6"><slot name="heading"></slot></Heading>
    </div>
{/if}
<textarea id={id} bind:value={model}></textarea>
{#if $$slots.hint}
    <div class="my-4">
        <Hint><slot name="hint"></slot></Hint>
    </div>
{/if}
<style global>
    .EasyMDEContainer .CodeMirror {
        color: #ccc;
        border-color: #333;
        background-color: #000;
    }
    .EasyMDEContainer .cm-s-easymde .CodeMirror-cursor {
        border-color: #ccc;
    }

    .EasyMDEContainer .editor-toolbar > * {
        color: #ccc;
    }

    .EasyMDEContainer .editor-toolbar > .active, .editor-toolbar > button:hover, .editor-preview pre, .cm-s-easymde .cm-comment {
        background-color: #444;
    }

    .EasyMDEContainer .CodeMirror-fullscreen {
        background: #000;
    }

    .editor-toolbar {
        border-top: 1px solid #333;
        border-left: 1px solid #333;
        border-right: 1px solid #333;
    }

    .editor-toolbar.fullscreen {
        background: #000;
    }

    .editor-preview {
        background: #000;
    }
</style>
