<script lang="ts">
    import {Drawer, Button, CloseButton, Input, Select, Label, Heading} from 'flowbite-svelte';
    import { sineIn } from 'svelte/easing';
    import {createEventDispatcher} from "svelte";
    import SalesChannelsSelector from '../../SalesChannels/sales-channels-selector.svelte';
    import CategorySelector from '../../Shared/flat-tree-selector.svelte';
    import {ProductCategoryService} from "../services/products/product-category.service";
    import Loading from "../../Shared/Loading.svelte";
    import {FilterOutline} from "flowbite-svelte-icons";
    const dispatch = createEventDispatcher();
    export let filters = {};

    let categories = [];
    let toDate: string = null;


    async function getCategories() {
        categories = await new ProductCategoryService().tree();

        return categories;
    }

    let drawerIsHidden = true;
    let transitionParamsRight = {
        x: 320,
        duration: 200,
        easing: sineIn
    };

    function submit() {
        dispatch('filter', filters);
        // drawerIsHidden = true;
    }

    function clear() {
        dispatch('clear', filters);
    }

    function handleDateSelect(date: Date) {
        console.log(date)
    }

    function formatToDate() {
        if (filters.createdAtFrom) {
            const day = new Date(filters.createdAtFrom)
            return `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
        }

        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

    }

    $: {
        if (filters.createdAtFrom) {
            // date + 1 day
            const day = new Date(filters.createdAtFrom);
            day.setDate(day.getDate() + 1);
            setTimeout(() => {
                toDate = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
            })


        }

        const today = new Date();
        toDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    }

</script>
<div class="text-center">
    <Button color="blue" on:click={() => (drawerIsHidden = false)}>
        <FilterOutline /> <slot name="button-text"></slot>
    </Button>
</div>

<!--{JSON.stringify(filters)}-->

<Drawer placement="right" backdrop={true}
        transitionType="fly" transitionParams={transitionParamsRight} bind:hidden={drawerIsHidden} id="filtersSidebar">
    <div class="flex items-center">
        <h5 id="drawer-label" class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">
            Filter Items
        </h5>
        <CloseButton on:click={() => (drawerIsHidden = true)} class="mb-4 dark:text-white" />
    </div>

    <form on:submit|preventDefault={submit}>
        <div class="my-4">
            <Label>Title, SKU, etc..</Label>
            <Input type="text" bind:value={filters.q} placeholder="Title, SKU, etc.." />
        </div>
        <div class="my-4">
            <Label>Status</Label>
            <Select bind:value={filters.active}>
                <option value={null}>All</option>
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
            </Select>
        </div>

        <Heading tag="h6" class="font-semibold text-base">Price</Heading>
        <div class="my-4 grid grid-cols-2 gap-2">
            <div>
                <Label>From</Label>
                <Input type="number" min="0" bind:value={filters.priceFrom} placeholder="From" />
            </div>

            <div>
                <Label>To</Label>
                <Input type="number" min="0" bind:value={filters.priceTo} placeholder="To" />
            </div>
        </div>

        <div class="my-4">

            {#await getCategories()}
                <Loading></Loading>
                {:then categories}
                <CategorySelector tree={categories} selectionKey="uuid" bind:model={filters.productCategory} />
                {/await}

        </div>


        <div class="my-4">
        <Heading tag="h6" class="font-semibold text-base">Sales Channel</Heading>
        <SalesChannelsSelector mode="single" bind:singleSelection={filters.salesChannel} />
        </div>
        <div class="my-4">
            <Heading tag="h6" class="font-semibold text-base">Creation Date</Heading>

            <div class="grid grid-cols-2 gap-2 my-4">
                <div>
                    <Label>From</Label>
                    <Input type="date" bind:value={filters.createdAtFrom} placeholder="From" />
                </div>

                <div>
                    <Label>To {toDate}</Label>
                    <Input type="date" bind:value={filters.createdAtTo} placeholder="To"
                           min={toDate}
                    />
                </div>
        </div>
        </div>



    <div class="grid grid-cols-2 gap-4">
        <Button color="red" on:click={clear} type="button" >Clear</Button>
        <Button color="green" type="submit" class="px-4">Apply Filters </Button>
    </div>
    </form>

</Drawer>
