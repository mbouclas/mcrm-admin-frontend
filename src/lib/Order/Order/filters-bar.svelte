<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import {FilterOutline} from "flowbite-svelte-icons";
    import {Button, CloseButton, Drawer, Heading, Input, Label, Select} from "flowbite-svelte";
    import {sineIn} from "svelte/easing";
    import {
        customerItemSelectorConfig, paymentMethodItemSelectorConfig,
        productItemSelectorConfig, shippingMethodItemSelectorConfig,

    } from "../../Shared/item-selector-configs";
    import ItemSelectorModal from "../../DynamicFields/fields/item-selector-modal.svelte";
    import {app} from "../../stores";
    import type {OrderStatuses} from "../../../models/boot";

    export let filters = {};
    const dispatch = createEventDispatcher();
    let toDate: string = null;
    let drawerIsHidden = true;
    let transitionParamsRight = {
        x: 320,
        duration: 200,
        easing: sineIn
    };
    let statuses: OrderStatuses[] = [];
    const defaultFilteredItems = {
        customer: null,
        product: null,
        paymentMethod: null,
        shippingMethod: null,
    };
    let filteredItems = {...defaultFilteredItems};

    app.subscribe((state) => {
        statuses = state.configs.store.orderStatuses;
    });

    function submit() {
        dispatch('filter', filters);
        // drawerIsHidden = true;
    }

    function clear() {
        filteredItems = {...defaultFilteredItems};
        dispatch('clear', filters);
    }

</script>
<div class="text-center">
    <Button color="blue" on:click={() => (drawerIsHidden = false)}>
        <FilterOutline /> <slot name="button-text"></slot>
    </Button>
</div>

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
            <Label>Order ID</Label>
            <Input type="text" bind:value={filters.orderId} placeholder="OrderID" />
        </div>

        <div class="my-4">
            <Label>Order Status</Label>
            <Select type="text" bind:value={filters.status} placeholder="Status">
                <option value={undefined}>All</option>
                {#each statuses as status}
                    <option value={status.id}>{status.label}</option>
                {/each}
            </Select>
        </div>

        <div class="my-4">
            <ItemSelectorModal
                    config={productItemSelectorConfig}
                    on:confirm={(e) => console.log('confirm', e)}
                    on:select={(e) => {filters.product = e.detail.uuid; filteredItems.product = e.detail;}}
                    closeOnSelect={true}
                    label="Product Filter"
                    selectMode="single"
            >
                <Button
                >Product
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                    ><path fill="currentColor" d="M10 20v-7L2.95 4h18.1L14 13v7h-4Z" /></svg
                    >
                </Button>
            </ItemSelectorModal>
            {#if filteredItems.product}
                <div class="mt-2">
                    <span class="text-gray-200">Selected: </span>
                    <span class="text-gray-500">{filteredItems.product.sku} {filteredItems.product.title}</span>
                </div>
            {/if}
        </div>

        <div class="my-4">
            <ItemSelectorModal
                    config={customerItemSelectorConfig}
                    on:confirm={(e) => console.log('confirm', e)}
                    on:select={(e) => {filters.customer = e.detail.uuid; filteredItems.customer = e.detail;}}
                    closeOnSelect={true}
                    label="User Filter"
                    selectMode="single"
            >
                <Button
                >Customer
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                    ><path fill="currentColor" d="M10 20v-7L2.95 4h18.1L14 13v7h-4Z" /></svg
                    >
                </Button>
            </ItemSelectorModal>
            {#if filteredItems.customer}
                <div class="mt-2">
                    <span class="text-gray-200">Selected: </span>
                    <span class="text-gray-500">{filteredItems.customer.firstName} {filteredItems.customer.lastName}</span>
                </div>
                {/if}
        </div>

        <div class="my-4">
            <ItemSelectorModal
                    config={paymentMethodItemSelectorConfig}
                    on:confirm={(e) => console.log('confirm', e)}
                    on:select={(e) => {filters.paymentMethod = e.detail.uuid; filteredItems.paymentMethod = e.detail;}}
                    closeOnSelect={true}
                    label="Payment Method Filter"
                    selectMode="single"
            >
                <Button
                >Payment Method
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                    ><path fill="currentColor" d="M10 20v-7L2.95 4h18.1L14 13v7h-4Z" /></svg
                    >
                </Button>
            </ItemSelectorModal>
            {#if filteredItems.paymentMethod}
                <div class="mt-2">
                    <span class="text-gray-200">Selected: </span>
                    <span class="text-gray-500">{filteredItems.paymentMethod.title}</span>
                </div>
            {/if}
        </div>

        <div class="my-4">
            <ItemSelectorModal
                    config={shippingMethodItemSelectorConfig}
                    on:confirm={(e) => console.log('confirm', e)}
                    on:select={(e) => {filters.shippingMethod = e.detail.uuid; filteredItems.shippingMethod = e.detail;}}
                    closeOnSelect={true}
                    label="Shipping Method Filter"
                    selectMode="single"
            >
                <Button
                >Shipping Method
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                    ><path fill="currentColor" d="M10 20v-7L2.95 4h18.1L14 13v7h-4Z" /></svg
                    >
                </Button>
            </ItemSelectorModal>
            {#if filteredItems.shippingMethod}
                <div class="mt-2">
                    <span class="text-gray-200">Selected: </span>
                    <span class="text-gray-500">{filteredItems.shippingMethod.title}</span>
                </div>
            {/if}
        </div>


        <Heading tag="h6" class="font-semibold text-base">Order Total</Heading>
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
