<script lang="ts">
import ItemSelector from "../../DynamicFields/fields/item-selector.svelte";
import {productItemSelectorConfig} from "../../Shared/item-selector-configs";
import {
    Button,
    Checkbox, Modal, Search, Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    TableSearch
} from "flowbite-svelte";
import type {IPagination} from "../../Shared/models/generic";
import {Plus} from "svelte-heros-v2";
import {moneyFormat} from "../../helpers/money";
import type {ProductModel} from "../models/product.model";
import type {ProductVariantModel} from "../models/product-variant.model";
import {navigate} from "mcrm-svelte-navigator";
import {VariantsService} from "../services/variants/variants.service";

export let selectedItem;
export let mode: 'single' | 'multiple' = 'single';
export let onSelectProduct: (item: ProductModel) => void;
export let onSelectProductVariant: (item: ProductModel, variant: ProductVariantModel) => void;
let config = {...productItemSelectorConfig, ...{with: ['variants', 'properties', 'propertyValues', 'thumb'], postProcessing}};
let searchTerm = '';
let allSelected = false,
loading = false,
    refreshResults = false,
    showVariantsSelectModal = false;
let selected: string[] = [],// the uuids of the selected items
    originalSelection: string[] = []// A copy of the selection to revert to if the user hits the clear all
;
let timeout: any;
let selectedItemId: ProductModel = null,
    currentItem: ProductModel = null;
let items = {
    data: [],
} as IPagination<any>;
let variants: ProductVariantModel[] = [];

function postProcessing(data) {

    return data;
}

function toggleSelectAll() {
    allSelected = !allSelected;
    if (allSelected) {
        selected = items.data.map((item) => item.uuid);
    } else {
        selected = [];
    }

    originalSelection = selected;
}

function onSelect(e) {
    // selectedItem = e.detail;
    // showModalItemSelectorModal = true;
}

function singleItemSelected() {
    allSelected = selected.length === items.data.length;
}

function onSelectSingle(item: ProductModel) {
    selectedItem = item;
    if (onSelectProduct) {
        onSelectProduct(item);
    }
}

function handleSearch() {
    if (!config.filters) {
        config.filters = {};
    }

    config.filters.q = searchTerm;

    refreshResults = true;
}


async function selectVariants(item) {
    currentItem = item;
    const res = await new VariantsService().find({sku: item.sku}, ['thumb']);
    variants = res.data;
    showVariantsSelectModal = true;

}

function onSelectSingleVariant(idx: number) {
    if (onSelectProductVariant) {
        onSelectProductVariant(currentItem, variants[idx]);
    }
}

</script>
<Modal size="xl" bind:open={showVariantsSelectModal} title={`Select variant`}>
<Table>
<TableHead>
<TableHeadCell>

</TableHeadCell>
    <TableHeadCell>

    </TableHeadCell>
    <TableHeadCell>
        SKU
    </TableHeadCell>
    <TableHeadCell>
        Title
    </TableHeadCell>
    <TableHeadCell>
        Price
    </TableHeadCell>
</TableHead>
    <TableBody class="divide-y">
        {#each variants as item, idx}
        <TableBodyRow>
            <TableHeadCell>
                {#if mode === 'single'}
                    <Button on:click={onSelectSingleVariant.bind(this, idx)}><Plus/></Button>
                    {:else}
                    {/if}
            </TableHeadCell>
            <TableHeadCell>
                <img src={typeof item.thumb === 'object' ? item.thumb.url : item.thumb}  class="w-16 object-cover" /></TableHeadCell>
            <TableBodyCell>
                {item.variantId}
            </TableBodyCell>
            <TableBodyCell>{item.name}</TableBodyCell>
            <TableBodyCell>{moneyFormat(item.price)}</TableBodyCell>
        </TableBodyRow>
        {/each}
    </TableBody>
</Table>
</Modal>

<ItemSelector selectMode="single" bind:selectedItem
              on:select={onSelect} useQueryFilter={false} bind:refresh={refreshResults}
              bind:config={config}>
    <div slot="items" let:items={items}>

        <div class="my-4">
            <Search placeholder="Search in titles, sku..." bind:value={searchTerm} on:input={handleSearch} on:keyup={handleSearch} />
        </div>
        <Table placeholder="Search in Titles, sku, descriptions..." hoverable={true}>
            <TableHead>
                <TableHeadCell>
                    {#if mode === 'multiple'}
                    <Checkbox checked={allSelected}
                              on:change={toggleSelectAll}
                    />
                        {/if}
                </TableHeadCell>
                <TableHeadCell>

                </TableHeadCell>
            <TableHeadCell>
                SKU
            </TableHeadCell>
            <TableHeadCell>
                Title
            </TableHeadCell>
            <TableHeadCell>#Variants</TableHeadCell>
            <TableHeadCell>
                Price
            </TableHeadCell>
            </TableHead>
        <TableBody class="divide-y">
        {#each items.data as item}
            <TableBodyRow>
            <TableBodyCell>
                {#if mode === 'multiple'}
                <Checkbox bind:group={selected}
                          on:change={singleItemSelected}
                          value={item.uuid}
                />
                    {:else}
                    <Button on:click={onSelectSingle.bind(this, item)}><Plus/></Button>
                    {/if}
            </TableBodyCell>
                <TableHeadCell><img src={typeof item.thumb === 'object' ? item.thumb.url : item.thumb}  class="w-16 object-cover" /></TableHeadCell>
                <TableBodyCell>
                    <a href="#" on:click|preventDefault={() => navigate(`/catalogue/products/${item.uuid}`)}
                       class="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer">
                        {item.sku}
                    </a>
                </TableBodyCell>
                <TableBodyCell>{item.title}</TableBodyCell>
                <TableBodyCell>
                    {#if Array.isArray(item.variants) && item.variants.length > 0}
                        <Button color="purple" on:click={selectVariants.bind(this, item)}>Select from {item.variants.length} variants</Button>
                        {:else}
                        -
                        {/if}

                </TableBodyCell>
                <TableBodyCell>
                    {moneyFormat(item.price)}
                </TableBodyCell>
            </TableBodyRow>
        {/each}
        </TableBody>
        </Table>
    </div>
</ItemSelector>
