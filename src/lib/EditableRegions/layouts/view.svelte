<script lang="ts">
    import {
        Breadcrumb, BreadcrumbItem,
        Button,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell
    } from "flowbite-svelte";
import {ArrowTopRightOnSquare, Trash} from "svelte-heros-v2";
import {EditOutline} from "flowbite-svelte-icons";
import {EditableRegionsService, editableRegionTypes} from "../editable-regions.service";
import {onMount} from "svelte";
import {navigate, useParams} from "mcrm-svelte-navigator";
import type {IEditableRegionLayout} from "../models";
const params = useParams();
export let model: IEditableRegionLayout;
let ready = false;
onMount(async () => {
    if ($params.name && !model) {
        model = EditableRegionsService.getLayout({name: $params.name})
    }

    ready = true;
});

function getRegionType(type: string) {
    return editableRegionTypes.find(t => t.name === type);
}
</script>
{#if ready}
    <Breadcrumb aria-label="Default breadcrumb example" class="mb-4">
        <BreadcrumbItem home>
            <Button on:click={() => navigate(`/editable-regions`)}>
                Layouts
            </Button>
        </BreadcrumbItem>
        <BreadcrumbItem>{model.label}</BreadcrumbItem>
    </Breadcrumb>
<Table>
    <TableHead>
        <TableHeadCell>Name</TableHeadCell>
        <TableHeadCell>Description</TableHeadCell>
        <TableHeadCell>Type</TableHeadCell>
        <TableHeadCell>Fields</TableHeadCell>
        <TableHeadCell></TableHeadCell>

    </TableHead>
    <TableBody class="divide-y">
        {#each model.regions as region}
            <TableBodyRow>
                <TableBodyCell>{region.label}</TableBodyCell>
                <TableBodyCell>{region.description}</TableBodyCell>
                <TableBodyCell>{getRegionType(region.type).label}</TableBodyCell>
                <TableBodyCell>{region.fields.length}</TableBodyCell>
                <TableBodyCell>

                    <Button title="Fill Region" on:click={() => navigate(`/editable-regions/${model.name}/fill/${region.name}`)}>
                        <EditOutline />
                    </Button>
                    <Button titl="Delete Region">
                        <Trash color="red" />
                    </Button>
                </TableBodyCell>
            </TableBodyRow>

        {/each}
    </TableBody>
</Table>
    {/if}
