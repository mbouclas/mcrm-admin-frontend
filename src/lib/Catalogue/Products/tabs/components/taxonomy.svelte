<script lang="ts">
    import type {ProductModel} from "../../../models/product.model";
    import type {ZodError} from "zod";
    import {
        manufacturerItemSelectorConfig,
        productCategoryItemSelectorConfig
    } from "../../../../Shared/item-selector-configs";
    import ItemSelectorModal from '../../../../DynamicFields/fields/item-selector-modal.svelte';
    import { Button} from "flowbite-svelte";
    import {Plus, Trash, XMark} from "svelte-heros-v2";
    import {onMount} from "svelte";
    import Tags from '../../ProductCategoriesTags.svelte';
    import SalesChannelsSelector from '../../../../SalesChannels/sales-channels-selector.svelte';
    import {type ISalesChannel, SalesChannelsService} from "../../../../SalesChannels/services/sales-channels.service";
    import type {ManufacturerModel} from "../../../models/manufacturer.model";
    import {ProductsService} from "../../../services/products/products.service";


    export let model: ProductModel;
    export let errors: Partial<ZodError> = {};

    onMount(() => {
        if (!Array.isArray(model.productCategory)) {
            model.productCategory = [];
        }
    });

    async function removeFromSelection(idx: number) {
        const temp = [...model.productCategory];

        temp.splice(idx, 1);
        model.productCategory = temp;

        await new ProductsService().saveProductCategories(model.uuid, model.productCategory);
    }

    async function addToSelection(selection) {
        model.productCategory = [...model.productCategory, ...selection];
        await new ProductsService().saveProductCategories(model.uuid, model.productCategory);
    }

    async function saveSalesChannel(channels: ISalesChannel[], itemId: string) {
        await new SalesChannelsService().sync(channels, itemId, 'Product');
    }

    async function saveManufacturer(manufacturer: ManufacturerModel) {
        console.log(manufacturer)
        model.manufacturer = manufacturer;
    }
</script>
<div class="my-4">
    <div class="flex gap-1.5">
        {#each model.productCategory as item, idx}
<div class="border-gray-200 dark:border-gray-700 divide-gray-200 dark:divide-gray-700 font-medium inline-flex items-center justify-center px-2.5 py-0.5 text-xs bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300 rounded ml-4">
    {item.title} <Button on:click={removeFromSelection.bind(this, idx)}><XMark /></Button>
</div>


        {/each}
    </div>
    <ItemSelectorModal
            config={productCategoryItemSelectorConfig}
            skipUuids={model.productCategory.map((item) => item.uuid)}
            onSelection={addToSelection}
            closeOnSelect={false}
            label="Add Categories"
            selectMode="multiple"
    >
        <Button color="purple"
        ><Plus /> Add Categories
        </Button>
    </ItemSelectorModal>

</div>

<div class="my-4">
    <div class="pt-6">
        <h3>Tags</h3>
        <Tags bind:model={model.tag} itemId={model.uuid} saveOnAction={false} />
    </div>

</div>

<div class="my-4">
    <ItemSelectorModal
            config={manufacturerItemSelectorConfig}
            onSelection={saveManufacturer}
            closeOnSelect={true}
            label="Add Manufacturer"
            selectMode="single"
    >
        <Button color="purple"
        ><Plus /> Add Manufacturer
        </Button>
    </ItemSelectorModal>
    {#if model.manufacturer}
        <div class="flex space-x-1.5">
            <p>Selected: {model.manufacturer.title}
            <Button on:click={() => model.manufacturer = null}><Trash /></Button>
            </p>
        </div>
        {/if}
</div>

<div class="my-4">
    <SalesChannelsSelector
            model={model.salesChannel}
            itemId={model.uuid}
            saveOnSelect={true}
            onSave={saveSalesChannel}
    />
</div>

