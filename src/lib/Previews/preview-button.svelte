<script lang="ts">
    import {Button, Dropdown, DropdownItem, Modal, Spinner} from "flowbite-svelte";
    import {PreviewService} from './preview.service';
    import {setNotificationAction} from "../stores";
    import {ArrowUpRightFromSquareOutline, EyeOutline} from "flowbite-svelte-icons";
    import Loading from "../Shared/Loading.svelte";
    import {ArrowPath} from "svelte-heros-v2";

    export let module: string = null;
    export let itemId: string = null;
    export let mode: 'preview' | 'refresh' | 'launch' = 'preview';
    export let classes: string;

    let loading = false;

    async function getPreviewUrl() {
        const res = await new PreviewService().generatePreviewUrl(module, itemId);
        window.open(res.url, '_blank');
    }

    async function previewWithRefresh() {
        await dumpData();
        await getPreviewUrl();
    }

    async function dumpData() {
        loading = true;
        const data = await new PreviewService().dumpData();

        loading = false;

        setNotificationAction({
            message: 'Data refreshed successfully',
            type: 'success'
        })
    }
</script>
<Modal size="sm" bind:open={loading} title="Please wait..."
       dialogClass="fixed top-0 left-0 right-0 h-modal md:inset-0 md:h-full  w-full p-4 flex z-[99999]">
    <div class="flex items-center justify-center">
        <Loading>Please wait...</Loading>
    </div>
</Modal>
{#if mode === 'refresh'}
    <Button class={classes} on:click={dumpData} color={mode === 'preview' ? 'blue' : 'purple'} title={mode === 'preview' ? 'Preview' : 'Refresh data'}>
        {#if loading}
            <div class="text-white">
                <Spinner class="mr-3" size="4" />Loading ...
            </div>
        {:else}
            <ArrowPath />
            <slot name="text"></slot>
        {/if}
    </Button>
{:else if mode === 'launch'}
    <Button class={classes} on:click={getPreviewUrl} color="blue" title="Launch Preview Site">
        <ArrowUpRightFromSquareOutline />
        <slot name="text"></slot>
    </Button>
{:else}
    <Button id="previewButton" color="purple" class={`gap-2.5 ${classes}`}>
        <EyeOutline />
        {#if loading}
            <Spinner class="mr-3" size="4" />Loading ...
        {:else}
            Preview
        {/if}
    </Button>
    <Dropdown triggeredBy="#previewButton">
        <DropdownItem on:click={dumpData}>Refresh data only</DropdownItem>
        <DropdownItem on:click={getPreviewUrl}>Preview</DropdownItem>
        <DropdownItem on:click={previewWithRefresh}>Preview with refresh</DropdownItem>
    </Dropdown>
{/if}
