<script lang="ts">
    import type {ProductModel} from "../../../models/product.model";
    import type {ZodError} from "zod";
    import Image from '../../../../DynamicFields/fields/image.svelte';
    import {onMount} from "svelte";
    export let model: ProductModel;
    export let errors: Partial<ZodError>;
    export let onSave: (model: ProductModel) => void;
    let ready = false;
    onMount(() => {
        if (typeof model.thumb === 'string') {
            model.thumb = {
                url: model.thumb,
            }
        }
        ready = true;
    });

    async function onUploadComplete(img) {
        model.thumb = img;
        if (onSave) {
            onSave(model);
        }
    }
</script>
{#if ready}
<Image
        model={model.thumb}
        title=" "
        maxNumberOfFiles={1}
        module="Product"
        classes="w-full h-64 object-contain"
        itemId={model.uuid}
        type="main"
        on:allUploadsComplete={(e) => {
            onUploadComplete(e.detail);
            }}
/>
    {/if}
