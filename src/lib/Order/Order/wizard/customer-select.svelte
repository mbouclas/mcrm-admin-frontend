<script lang="ts">
    import {OrderModel} from "../models/order.model";
    import {Button, Heading, Hr, Modal, Radio} from "flowbite-svelte";
    import {customerItemSelectorConfig} from "../../../Shared/item-selector-configs";
    import ItemSelectorModal from "../../../DynamicFields/fields/item-selector-modal.svelte";
    import {CustomerService} from "../../../Customer/services/customer/customer.service";
    import Loading from "../../../Shared/Loading.svelte";
    import Card from "../../../Shared/card.svelte";
    import AddressForm from '../components/address-form.svelte';
    import type {AddressModel} from "../models/address.model";
    import AddUser from '../../../User/User/add-edit-user.svelte';
    import {createEventDispatcher} from "svelte";
    import type {UserModel} from "../../../User/User/models/user.model";
    import {Plus} from "svelte-heros-v2";
    import {FilterOutline} from "flowbite-svelte-icons";

    const dispatch = createEventDispatcher();
    export let model: OrderModel = new OrderModel();
    export let onValid: (model: AddressModel) => void;
    export let isValid = false;
    let customer,
    loading = false,
        showCreateCustomerModal = false,
        billingInformation: AddressModel,
    customerAddresses = [];

    async function onCustomerSelect(e) {
        model.userId = e.detail.uuid;
        // go get the customer addresses
        loading = true;
        customer = await new CustomerService().findOne(e.detail.uuid, ['address']);
        model.userId = customer.uuid;
        customerAddresses = customer.address;
        loading = false;
        billingInformation = {
            firstName: customer.firstName,
            lastName: customer.lastName,
        }
    }

    function setAddress(address) {
        if (!model.metaData) {
            model.metaData = {
                billingInformation: address
            };
        }

        model.metaData.billingInformation = address;
        model.userId = customer.uuid;
        isValid = true;

        if (onValid) {
            onValid(address);
        }

        dispatch('setAddress', address);
    }

    async function onValidAddressForm(address: AddressModel) {
        // send it to the server to save it
        const res = await new CustomerService().syncAddress({
            type: 'BILLING',
            address,
            userId: customer.uuid
        });
        const temp = customer;

        temp.address.push(res.address)

        customer = temp;
        billingInformation = {};
        setAddress(res.address);
    }

    function onAddressChange(address) {
        setAddress(address);
    }

    function onCustomerSaved(customer: UserModel) {
        onCustomerSelect({detail: customer});
        showCreateCustomerModal = false;
    }
</script>

<Heading tag="h6">Select an existing customer</Heading>

<div class="my-4">
    <ItemSelectorModal
            config={customerItemSelectorConfig}
            on:confirm={(e) => console.log('confirm', e)}
            on:select={onCustomerSelect}
            closeOnSelect={true}
            label="User Filter"
            selectMode="single"
    >
        <Button color="purple" class="gap-2.5"><FilterOutline /> Click to select customer

        </Button>
    </ItemSelectorModal>
    {#if customer}
        <div class="mt-2">
            <span class="text-gray-200">Selected customer: </span>
            <span class="text-gray-500">{customer.firstName} {customer.lastName}</span>
        </div>

        <Hr/>
        <div class="my-4">
            <Heading tag="h6">Billing Information</Heading>
            <div class="grid grid-cols-2 gap-2.5 my-4">
                <div>
                    <Card>
                        <AddressForm bind:model={billingInformation} onSave={onValidAddressForm}>
                            <div slot="actions" class="my-4">
                                <Button type="submit" color="blue" class="w-full">Add address</Button>
                            </div>
                        </AddressForm>

                    </Card>
                </div>
                <div>
                    <Card>
                        <svelte:fragment slot="header">
                            Existing Addresses
                        </svelte:fragment>
                        {#if customer.address.length === 0}
                            <div class="text-gray-500 text-center">No addresses found</div>
                        {/if}
                        <ul class="bg-white rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-600 divide-y divide-gray-200 dark:divide-gray-600">
                            {#each customer.address as address, idx}
                                <li>
                                    <Radio class="p-3" bind:group={customerAddresses} value={address} on:change={onAddressChange.bind(this, address)}>
                                        {address.firstName} {address.lastName}: {address.street}, {address.city}, {address.region}, {address.country}, {address.postCode}
                                    </Radio>
                                </li>
                            {/each}
                        </ul>


                    </Card>
                </div>
            </div>
        </div>
    {/if}
</div>
<Hr classHr="my-8 w-full">OR</Hr>
<Button color="purple" class="mx-5 gap-2.5" on:click={() => showCreateCustomerModal = true}><Plus /> Create a new customer</Button>
<Modal title="Create a new customer" autoclose={false} size="xl" bind:open={showCreateCustomerModal}>
<AddUser model={customer} mode="customer" onSave={onCustomerSaved}>

</AddUser>
</Modal>
{#if loading}
<div class="flex justify-center">
    <Loading />
</div>
    {/if}



