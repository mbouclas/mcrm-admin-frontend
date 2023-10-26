<script lang="ts">
import {OrderModel} from "../models/order.model";
import {Button, Radio} from "flowbite-svelte";
import Card from "../../../Shared/card.svelte";
import AddressForm from "../components/address-form.svelte";
import type {AddressModel} from "../models/address.model";
import {CustomerService} from "../../../Customer/services/customer/customer.service";
import {createEventDispatcher} from "svelte";

const dispatch = createEventDispatcher();
export let model: OrderModel = new OrderModel();
export let onValid: (model: AddressModel) => void;
export let isValid = false;

let addressSelected = 'billing',
    shippingAddress: AddressModel;

function setAddress(address: AddressModel) {
    if (!model.metaData) {
        model.metaData = {
            shippingInformation: address
        };
    }

    model.metaData.shippingInformation = address;

    isValid = true;

    if (onValid) {
        onValid(address);
    }

    dispatch('setAddress', address);
}

async function onValidAddressForm(address: AddressModel) {
    // send it to the server to save it
    const res = await new CustomerService().syncAddress({
        type: 'SHIPPING',
        address,
        userId: model.userId
    });

    setAddress(res.address);
}

function onAddressChange(address) {
    setAddress(address);
}

$: {
    if (addressSelected === 'billing') {
        setAddress(model.metaData.billingInformation);
    }
}

</script>
<ul>
    <li><Radio class="p-3" bind:group={addressSelected} value="billing">Use Billing Address</Radio></li>
    <li><Radio class="p-3" bind:group={addressSelected} value="new">Add a new Address</Radio></li>
</ul>
{#if addressSelected === 'new'}
<Card>
    <AddressForm bind:model={shippingAddress} onSave={onValidAddressForm}>
        <div slot="actions" class="my-4">
            <Button type="submit" color="blue" class="w-full">Add address</Button>
        </div>
    </AddressForm>

</Card>
{/if}
