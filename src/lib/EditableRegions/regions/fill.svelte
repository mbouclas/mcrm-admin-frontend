<script lang="ts">
    import {navigate, useParams} from "mcrm-svelte-navigator";
    import {onMount} from "svelte";
    import {EditableRegionsService} from "../editable-regions.service";
    import type {IEditableRegion, IEditableRegionLayout} from "../models";
    import Repeater from './fill-repeater.svelte';
    import Group from './fill-group.svelte';
    import Executor from './fill-executor.svelte';
    import {Breadcrumb, BreadcrumbItem, Button} from "flowbite-svelte";
    import PreviewButton from '../../Previews/preview-button.svelte';

    const params = useParams();
    let region: IEditableRegion,
        layout: IEditableRegionLayout,
        model,
    ready = false;

    onMount(async () => {
        region = EditableRegionsService.getRegion($params.name, $params.regionId);
        layout = EditableRegionsService.getLayout({name: $params.name});
        model = await new EditableRegionsService().findOne($params.name, $params.regionId);
        ready = true;

        if (!model) {
            model = {};
            switch (region.type) {
                case 'repeater':
                    model['items'] = [];
                    break;
                case 'group':
                    model['items'] = {};
                    break;
                case 'executor':
                    model['items'] = {};
                    break;
            }
        }
    });

    async function save() {
        await new EditableRegionsService().saveRegion($params.name, $params.regionId, model.items);
    }
</script>
{#if ready}
    <Breadcrumb aria-label="Default breadcrumb example" class="mb-4">
        <BreadcrumbItem home>
            <Button on:click={() => navigate(`/editable-regions`)}>
                Layouts
            </Button>
        </BreadcrumbItem>
        <BreadcrumbItem>
            <Button on:click={() => navigate(`/editable-regions/${$params.name}/view`)}>
                {layout.label}
            </Button>
        </BreadcrumbItem>
        <BreadcrumbItem>{region.label}</BreadcrumbItem>
    </Breadcrumb>

{#if region.type === 'repeater'}
    <Repeater {region} bind:model={model.items}>
        <div slot="actions">
            <PreviewButton mode="refresh" />
        </div>
    </Repeater>
{:else if region.type === 'group'}
    <Group {region} bind:model={model.items} />
{:else if region.type === 'executor'}
    <Executor {region} bind:model={model.items} {layout} />
{/if}
<div class="my-4">
    <Button color="green" on:click={save} class="w-full">
        Save
    </Button>
</div>
{/if}
