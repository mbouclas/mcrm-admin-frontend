<script lang="ts">
    import {afterUpdate, createEventDispatcher, onDestroy, onMount} from 'svelte';
    const dispatch = createEventDispatcher();
    export let model;
    export let id = 'markdown-editor';
    let easyMDE;


    onMount(() => {
        easyMDE = new EasyMDE({
            element: document.getElementById(id)
        });

        easyMDE.codemirror.on("change", () => {
            dispatch('update', easyMDE.value());
        });
    })

    afterUpdate(() => {

    });

    onDestroy(() => {
        easyMDE.toTextArea();
        easyMDE = null;
    })

</script>
<textarea id={id} bind:value={model}></textarea>

