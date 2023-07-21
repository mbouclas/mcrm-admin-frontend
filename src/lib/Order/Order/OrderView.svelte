<script lang="ts">
    import {OrderService} from "../services/order/order.service";
    import { Select, Label } from 'flowbite-svelte';
    import Loading from "../../Shared/Loading.svelte";
    import {useParams} from "svelte-navigator";
    import {onMount} from "svelte";
    import getModelPrototypeFromFields from "../../helpers/model-prototype";
    import type {IDynamicFieldConfigBlueprint} from "../../DynamicFields/types";
    import {formatDate} from "../../helpers/dates.js";
    import {moneyFormat} from "../../helpers/money";
    import {app, setNotificationAction} from "../../stores";

    const s = new OrderService();
    const params = useParams();
    let model;
    let fields: IDynamicFieldConfigBlueprint[] = [];
    let relationships: any[] = [];
    export let itemId;
    let shippingAddress;
    let billingAddress;
    let statuses = [];

    app.subscribe(state => {
        statuses = state.configs.store.orderStatuses;
    })


    onMount(async () => {
        if (itemId) {
            model = await s.findOne(itemId, ["*"]);
        } else {
            if ($params.id === "new") {
                model = getModelPrototypeFromFields(fields);
            } else {
                model = await s.findOne($params.id, ["*"]);
            }
        }
    });

    $: {
        if (model && Array.isArray(model.address)) {
            shippingAddress = model.address.find(a => a.type.map(i => i.toLowerCase()).includes("shipping"));
            billingAddress = model.address.find(a => a.type.map(i => i.toLowerCase()).includes("billing"));
        }
    }

    function getVariantFromItems(variantId) {
        return model.variant.find(i => i.uuid === variantId);
    }

    async function changeOrderStatus(e) {
        await s.updateOrderStatus(model.uuid, model.status);


    }

</script>

{#if !model}
    <div class="w-full text-center items-center h-64">
        <Loading />
    </div>
{:else}

<section class="bg-white dark:bg-gray-900">
    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div class="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">
            <h2 class="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Order {model.orderId}</h2>
            <div class="grid sm:grid-cols-4 grid-cols-2 gap-4">
                <p class="font-light text-gray-500  dark:text-gray-400">{model.user.firstName} {model.user.lastName}</p>
                <p class="font-light text-gray-500  dark:text-gray-400">{model.user.email}</p>
                <p class="font-light text-gray-500  dark:text-gray-400">{formatDate(model.createdAt)}</p>
                <p class="font-semibold text-gray-500  dark:text-gray-400">{moneyFormat(model.total)}</p>
            </div>
            <div class="my-4">
                <Label for="status">Order Status</Label>
                <Select id="status" size="sm" class="mt-2" bind:value={model.status} on:change={changeOrderStatus}>
                    {#each statuses as status}
                        <option value={status.id} disabled={status.id < model.status}>{status.label}</option>
                    {/each}
                </Select>
            </div>
        </div>
        <div class="grid gap-8 md:grid-cols-2">
            <div class="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Shipping Address</h2>
                <div class="flex justify-between items-center">
                    <div class="flex items-center space-x-4">
                        <address class="not-italic">
                            <span class="block">{shippingAddress.lastName} {shippingAddress.firstName}</span>
                            <span class="block">{shippingAddress.street}, {shippingAddress.region}, {shippingAddress.postCode}, {shippingAddress.country}</span>
                            {#if shippingAddress.apartment}
                                <span class="block">Apartment: {shippingAddress.apartment}</span>
                            {/if}
                            {#if shippingAddress.company}
                                <span class="block">Company: {shippingAddress.company}</span>
                            {/if}

                        </address>
                    </div>
                </div>
            </div>

            <div class="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Billing Address</h2>
                <div class="flex justify-between items-center">
                    <div class="flex items-center space-x-4">
                        <address class="not-italic">
                            <span class="block">{billingAddress.lastName} {billingAddress.firstName}</span>
                            <span class="block">{billingAddress.street}, {billingAddress.region}, {billingAddress.postCode}, {billingAddress.country}</span>
                            {#if billingAddress.apartment}
                                <span class="block">Apartment: {billingAddress.apartment}</span>
                            {/if}
                            {#if billingAddress.company}
                                <span class="block">Company: {billingAddress.company}</span>
                            {/if}

                        </address>
                    </div>
                </div>
            </div>
        </div>
<div class="border-gray-100 border-t  my-6"></div>

        <div class="grid gap-8 md:grid-cols-2">
            <div class="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Payment Method</h2>
                <div class="flex items-center space-x-4">
                    <ul>
                        <li>
                            {model.paymentMethod.description}
                        </li>
                    </ul>
                </div>
                </div>

            <div class="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Shipping Method</h2>
                <div class="flex items-center space-x-4">
                    <ul>
                        <li>{model.shippingMethod.title}</li>
                        <li>{model.shippingMethod.shippingTime}</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="border-gray-100 border-t  my-6"></div>

        <div class="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
            <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Items</h2>
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" class="px-6 py-3">
                        <span class="sr-only">Image</span>
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Product
                    </th>
                    <th scope="col" class="px-6 py-3">
                        SKU
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Properties
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Qty
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Price
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Action
                    </th>
                </tr>
                </thead>
                <tbody>
                {#each model.metaData.cart.items as item}
                    {@const variant = getVariantFromItems(item.variantId)}
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td class="w-32 p-4">
                        <img src={variant.thumb}>
                    </td>
                    <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        <a href={`/catalogue/products/${item.productId}`}>{item.title}</a>
                    </td>
                    <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        {variant.variantId}
                    </td>
                    <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        {#if variant.color && item.metaData && item.metaData.color}
                            Color: {item.metaData.color.name}
                            {/if}
                    </td>
                    <td class="px-6 py-4">
                        {item.quantity}
                    </td>
                    <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        {moneyFormat(item.price * item.quantity)}
                    </td>
                    <td class="px-6 py-4">
                    </td>
                </tr>
                {/each}
                </tbody>
            </table>
        </div>
</div>
    </div>
</section>


{/if}
