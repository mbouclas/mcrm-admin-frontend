<script lang="ts">
import {OrderModel} from "../models/order.model";
import type { IPaymentMethod} from "../../../Setting/PaymentMethods/services/payment-method.service";
import {paymentMethodItemSelectorConfig, shippingMethodItemSelectorConfig} from "../../../Shared/item-selector-configs";
import ItemSelectorModal from "../../../DynamicFields/fields/item-selector-modal.svelte";
import {Button} from "flowbite-svelte";
import type {IEvent} from "../../../Shared/models/generic";
import type {IShippingMethod} from "../../../Setting/services/shipping.service";

export let model: OrderModel = new OrderModel();
export let onValid: (paymentMethod: IPaymentMethod, shippingMethod: IShippingMethod) => void;
export let isValid = false;

let selectedPaymentMethod: IPaymentMethod;
let selectedShippingMethod: IShippingMethod;
let providerSettingsFields: any[] = [];
paymentMethodItemSelectorConfig.filters = {
    status: true
};

function onSelectPaymentMethod(e: IEvent<IPaymentMethod>) {
    selectedPaymentMethod = e.detail;


    model.paymentMethod = selectedPaymentMethod;
    checkValid();

}

async function onSelectShippingMethod(e: IEvent<IShippingMethod>) {
    selectedShippingMethod = e.detail;
    model.shippingMethod = e.detail;
    await model.metaData.cart.updateShippingMethod(selectedShippingMethod);
    checkValid();
}

function checkValid() {
    if (!selectedShippingMethod || !selectedPaymentMethod) {
        isValid = false;
        return
    }

    if (onValid) {
        onValid(selectedPaymentMethod, selectedShippingMethod);
    }


    isValid = true;
}

</script>
<div class="my-4">
<ItemSelectorModal
        config={paymentMethodItemSelectorConfig}
        on:confirm={(e) => console.log('confirm', e)}
        on:select={onSelectPaymentMethod}
        closeOnSelect={true}
        label="Select Payment Method"
        selectMode="single"
>
    <Button color="purple"
    >Select Payment Method
        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
        ><path fill="currentColor" d="M10 20v-7L2.95 4h18.1L14 13v7h-4Z" /></svg
        >
    </Button>
</ItemSelectorModal>
    <p>
        {#if selectedPaymentMethod}
            Selected Payment Method: {selectedPaymentMethod.title}
        {/if}
    </p>
</div>
<div class="my-4">
<ItemSelectorModal
        config={shippingMethodItemSelectorConfig}
        on:confirm={(e) => console.log('confirm', e)}
        on:select={onSelectShippingMethod}
        closeOnSelect={true}
        label="Select Shipping Method"
        selectMode="single"
>
    <Button color="purple"
    >Select Shipping Method
        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
        ><path fill="currentColor" d="M10 20v-7L2.95 4h18.1L14 13v7h-4Z" /></svg
        >
    </Button>
</ItemSelectorModal>
    <p>
        {#if selectedShippingMethod}
            Selected Payment Method: {selectedShippingMethod.title}
        {/if}
    </p>
</div>


<!--{#if providerSettingsFields.length > 0}
    <div class="my-4">
        <Heading tag="h4">Provider Settings</Heading>
        <CustomFields fields={providerSettingsFields} let:field={field} fieldPrimaryKey="varName" bind:model={selectedPaymentMethod.providerSettings}>

        </CustomFields>
    </div>
{/if}-->
