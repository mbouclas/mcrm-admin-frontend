<script lang="ts">
import {OrderModel} from "../models/order.model";
import {Button, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell} from "flowbite-svelte";
import Card from "../../../Shared/card.svelte";
import {moneyFormat} from "../../../helpers/money";
import SalesChannelsSelector from '../../../SalesChannels/sales-channels-selector.svelte';
import {OrderService} from "../../services/order/order.service";
import type {ISalesChannel} from "../../../SalesChannels/services/sales-channels.service";
import type {CartItem} from "../models/cart-item";
import {ProductModel} from "../../../Catalogue/models/product.model";
import {navigate} from "mcrm-svelte-navigator";

export let model: OrderModel = new OrderModel();
// model = dummy;
let cartItems = model.metaData.cart.items,
    summary = {
        items: model.metaData.cart.items.length,
        conditions: model.metaData.cart.appliedConditions,
        total: model.metaData.cart.total
    };


async function save() {
    const res = await new OrderService().saveCustomOrder(model);
    if (res.order) {
        navigate(`/orders/${res.order}`);
    }
}

function onSelectSalesChannel(channel: ISalesChannel) {
    model.salesChannel = channel.uuid;
}


function getVariantInfo(item: CartItem) {
    const properties = ProductModel.getProductVariantProperties(model.selectedProducts.find(p => p.uuid === item.productId));
    const values = [];

    for (const key in item.metaData) {
        const found = properties.find(p => p.slug === key);
        if (!found) {continue}
        found.values.forEach(v => {
            if (found.type === 'color' && v.code === item.metaData[key].code) {
                values.push({
                    property: found.title,
                    name: v.name,
                    value: v.code
                });
                return;
            }

            if (v.slug === item.metaData[key].value) {
                values.push({
                    property: found.title,
                    name: v.name,
                    value: v.slug
                });
            }
        });

        return values;
    }
}
</script>

<div class="my-4 grid grid-cols-4 gap-2.5">
    <Card>
        <svelte:fragment slot="header">
            Billing Information
        </svelte:fragment>
        {model.metaData.billingInformation.firstName} {model.metaData.billingInformation.lastName}: {model.metaData.billingInformation.street}, {model.metaData.billingInformation.city}, {model.metaData.billingInformation.region}, {model.metaData.billingInformation.country}, {model.metaData.billingInformation.postCode}

    </Card>
    <Card>
        <svelte:fragment slot="header">
            Shipping Information
        </svelte:fragment>
        {model.metaData.shippingInformation.firstName} {model.metaData.shippingInformation.lastName}: {model.metaData.shippingInformation.street}, {model.metaData.shippingInformation.city}, {model.metaData.shippingInformation.region}, {model.metaData.shippingInformation.country}, {model.metaData.shippingInformation.postCode}

    </Card>
    <Card>
        <svelte:fragment slot="header">
            Payment Method
        </svelte:fragment>
        {model.paymentMethod.title}
    </Card>
    <Card>
        <svelte:fragment slot="header">
            Sales Channel
        </svelte:fragment>
        <SalesChannelsSelector

                mode="single"
                itemId={model.uuid}
                saveOnSelect={true}
                onSave={onSelectSalesChannel}
        />
    </Card>

</div>

<div class="my-4">
    <Card>
        <svelte:fragment slot="header">
            Order Items
        </svelte:fragment>

        <Table>
            <TableHead>
                <TableHeadCell></TableHeadCell>
                <TableHeadCell>SKU</TableHeadCell>
                <TableHeadCell>Title</TableHeadCell>
                <TableHeadCell>Quantity</TableHeadCell>
                <TableHeadCell>Variant</TableHeadCell>
                <TableHeadCell>Price</TableHeadCell>

            </TableHead>
            <TableBody>
                {#each cartItems as item}
                    <TableBodyRow>
                        <TableBodyCell><img src={item.thumb} class="w-16 object-cover" /></TableBodyCell>
                        <TableBodyCell>{item.sku}</TableBodyCell>
                        <TableBodyCell>{item.title}</TableBodyCell>
                        <TableBodyCell>{item.quantity}</TableBodyCell>
                        <TableBodyCell>
                            {#if item.variantId}
                                {#each getVariantInfo(item) as v}
                                    <div class="flex items-center">
                                        <div class="w-4 h-4 rounded-full mr-2">{v.property}: {v.name}</div>
                                    </div>
                                {/each}
                            {/if}
                        </TableBodyCell>
                        <TableBodyCell>{moneyFormat(item.price)}</TableBodyCell>

                    </TableBodyRow>
                {/each}
            </TableBody>
            {#if summary.items > 0}
                <tfoot>
                {#if summary.conditions.length > 0}
                    {#each summary.conditions as condition}
                        <tr class="font-semibold text-gray-900 dark:text-white">
                            <th scope="row" class="py-3 px-6 text-base">{condition.title}</th>
                            <td colspan="4"></td>
                            <td class="py-3 px-6">{moneyFormat(condition.parsedRawValue)}</td>

                        </tr>
                    {/each}
                {/if}
                <tr class="font-semibold text-gray-900 dark:text-white">
                    <th scope="row" class="py-3 px-6 text-base">Total</th>
                    <td class="py-3 px-6"></td>
                    <td class="py-3 px-6"></td>
                    <td class="py-3 px-6">{summary.items}</td>
                    <td class="py-3 px-6"></td>
                    <td class="py-3 px-6">{moneyFormat(summary.total)}</td>

                </tr>
                </tfoot>
            {/if}
        </Table>
    </Card>
</div>

<div class="my-4">
    <Button color="green" class="w-full" on:click={save}>Finalize Order</Button>
</div>
