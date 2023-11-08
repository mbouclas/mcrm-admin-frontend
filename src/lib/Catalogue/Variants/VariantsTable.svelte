<script lang="ts">
    import {
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
        TableSearch,
        Checkbox, Button, Modal, Badge, Heading,
    } from "flowbite-svelte";
    import {createEventDispatcher, onMount} from "svelte";
    import EditProductVariant from "./ProductVariantEdit.svelte";
    import Paginator from "../../Shared/Paginator.svelte";
    import {filter} from "lodash";
    import type {IEvent} from "../../Shared/models/generic";
    import {EditOutline} from "flowbite-svelte-icons";
    import {Trash} from "svelte-heros-v2";
    import {moneyFormat} from "../../helpers/money";
    import type {ProductVariantModel} from "../models/product-variant.model";
    import {VariantsService} from "../services/variants/variants.service";

    export let items = [];
    export let pagination;
    export let fields;
    export let onSearch: (model: { pagination: any, searchTerm: string }) => void;
    export let loading = false,
    timeout;
    let allSelected = false;
    let showEditVariantModal = false;
    let selectedVariant = null;
    let selected: string[] = [],// the uuids of the selected items
        originalSelection: string[] = []// A copy of the selection to revert to if the user hits the clear all
    ;
    let searchTerm = "";
    let ready = false;
    const dispatch = createEventDispatcher();

    onMount(() => {
        ready = true;
    });

/*    $: filteredItems = filter(items, (item) => {
        return (
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.variantId.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });*/

    let previousSearchTerm = '';

$: if (!loading) {
    if (searchTerm !== previousSearchTerm) {
        clearTimeout(timeout);
        previousSearchTerm = searchTerm;
        pagination.page = 1;
        timeout = setTimeout(async () => {
            onSearch({pagination, searchTerm});
        }, 500);

    }
}

    function handlePageChange(e: IEvent<number>) {
        pagination.page = e.detail;
        onSearch({pagination, searchTerm});
    }

    function editVariant(item: ProductVariantModel) {
        selectedVariant = item;
        showEditVariantModal = true;
    }

    async function onVariantSaved() {
        dispatch('reload', pagination);
    }

    async function deleteVariant(idx: number) {
        if (!confirm('Are you sure you want to delete this variant?')) {
            return;
        }

        await new VariantsService().delete(items[idx].uuid);

        dispatch('reload', pagination);
    }

    async function deleteSelectedVariants() {
        if (!confirm('Are you sure you want to delete these variants?')) {
            return;
        }

        await new VariantsService().deleteMany(selected);

        selected = [];
        allSelected = false;

        dispatch('reload', pagination);
    }

    function singleItemSelected() {
        allSelected = selected.length === items.length;
    }

    async function toggleSelectAll() {
        allSelected = !allSelected;
        if (allSelected) {
            selected = items.map((item) => item.uuid);
        } else {
            selected = [];
        }

        originalSelection = selected;
    }

    async function selectAll() {
        selected = originalSelection;
    }


</script>

<Modal title="Edit Variant" autoclose={false} size="xl" bind:open={showEditVariantModal}>
    <EditProductVariant uuid={selectedVariant?.uuid} onSave={onVariantSaved}/>
</Modal>
<div class="flex justify-between">
    <div>
        <Heading tag="h6">{pagination.total} Variants</Heading>
    </div>
    <div class="flex justify-end space-x-1.5">
        {#if selected.length > 0}
            <Button color="red" on:click={deleteSelectedVariants}>Delete Selected</Button>
        {/if}
        <slot name="actions"></slot>
    </div>
</div>

<TableSearch
        placeholder="Search in names, ids and more"
        hoverable={true}
        bind:inputValue={searchTerm}
>
    <TableHead>

        <TableHeadCell>
            <Checkbox checked={allSelected}
                      on:change={toggleSelectAll}/>
        </TableHeadCell>

        <TableHeadCell></TableHeadCell>
        <TableHeadCell>Name</TableHeadCell>
        <TableHeadCell>#ID</TableHeadCell>
        <TableHeadCell>Price</TableHeadCell>
        <TableHeadCell>Active</TableHeadCell>
        <TableHeadCell>Properties</TableHeadCell>

        <TableHeadCell></TableHeadCell>

    </TableHead>
    <TableBody>
        {#if items && items.length}
            {#each items as item, idx}
                <TableBodyRow>
                    <TableBodyCell>
                        <Checkbox bind:group={selected} on:change={singleItemSelected}
                                  value={item.uuid}/>
                    </TableBodyCell>
                    <TableBodyCell>
                        <img src={typeof item.thumb === 'object' ? item.thumb.url : item.thumb}  class="w-16 object-cover" />
                    </TableBodyCell>
                    <TableBodyCell>{item.name}</TableBodyCell>
                    <TableBodyCell>{item.variantId}</TableBodyCell>
                    <TableBodyCell>{moneyFormat(item.price)}</TableBodyCell>
                    <TableBodyCell>{item.active ? 'Yes' : 'No'}</TableBodyCell>
                    <TableBodyCell>
                        <div class="gap-2.5 grid grid-cols-1">
                            {#if Array.isArray(item.property) && item.property.length > 0}
                                {#each item.property as property, idx}
                                    <Badge color="purple">
                                        {property.title}: {property.values[0].name}
                                    </Badge>
                                {/each}
                            {:else}
                                0
                            {/if}
                        </div>
                    </TableBodyCell>
                    <TableBodyCell>
                        <Button on:click={editVariant.bind(this, item)}>
                            <EditOutline/>
                        </Button>
                        <Button on:click={deleteVariant.bind(this, idx)}>
                            <Trash/>
                        </Button>
                    </TableBodyCell>
                </TableBodyRow>
            {/each}
        {/if}
    </TableBody>
</TableSearch>

<Paginator
        bind:totalPages={pagination.totalPages}
        bind:total={pagination.total}
        bind:currentPage={pagination.page}
        on:pageChange={handlePageChange}
/>

