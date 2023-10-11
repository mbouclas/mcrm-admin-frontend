<script lang="ts">
    import {
        type IPaymentMethod,
        type IPaymentMethodProvider,
        PaymentMethodService
    } from "./services/payment-method.service";
    import {createEventDispatcher, onMount} from "svelte";
    import Input from "../../Shared/Input.svelte";
    import {
        Button, Checkbox,
        Heading,
        Label,
        NumberInput,
        Select, TableBody, TableBodyCell, TableBodyRow,
        TableHead,
        TableHeadCell,
        TableSearch,
        Textarea
    } from "flowbite-svelte";
    import {type IShippingMethod, ShippingService} from "../services/shipping.service";
    import Toggle from "../../Shared/Toggle.svelte";
    import CustomFields from "../../CustomFields/group-field-renderer.svelte";
    import {schemaToFields} from "../../helpers/data";
    import type {IEvent} from "../../Shared/models/generic";

    const dispatch = createEventDispatcher();
    const service = new PaymentMethodService();
    export let uuid: string;
    let providers: IPaymentMethodProvider[] = [];
    let shippingMethods: IShippingMethod[] = [];
    let model: IPaymentMethod;
    let ready = false;
    let providerSettingsFields = [];
    let shippingMethodSearchTerm = '';

    onMount(async () => {
        model = await service.findOne(uuid, ['*']);
        providers = await service.getProviders();
        const shippingQuery = await new ShippingService().find({status: true},['*']);
        shippingMethods = shippingQuery.data;
        if (typeof model.providerSettings !== 'object') {
            model.providerSettings = {};
        }

        if (model.provider.settingsSchema) {
            providerSettingsFields = schemaToFields(model.provider.settingsSchema)
        }


        ready = true;

    });

    async function save() {
        await new PaymentMethodService().update(uuid, model);
        dispatch('save', model);
    }

    function onChangeProvider(e: IEvent<any>) {
        const found = providers.find(item => item.shortName === model.providerName);
        if (!found || !found.settingsSchema) {
            providerSettingsFields = [];
            return;
        }

        providerSettingsFields = schemaToFields(found.settingsSchema);
    }


    function formatProviderName(name: string) {
        return name.replace('Provider', '').toLocaleLowerCase();
    }

    $: filteredItems = shippingMethods.filter((item) => item.title.toLowerCase().indexOf(shippingMethodSearchTerm.toLowerCase()) !== -1);

    function setShippingMethod(item: IShippingMethod) {
        if (!model.shippingMethod) {
            model.shippingMethod = [];
        }

        // svelte reference issue
        const temp = Object.assign([], model.shippingMethod);

        const foundIdx = temp.findIndex((i) => {
            return i.uuid === item.uuid;
        });

        if (foundIdx !== -1) {
            temp.splice(foundIdx, 1);
        } else {
            temp.push(item);
        }

        model.shippingMethod = temp;
    }

    function shippingMethodInModel(item: IShippingMethod) {
        if (!model.shippingMethod) {
            return false;
        }

        const found = model.shippingMethod.find((i) => i.uuid === item.uuid);
        return !!found;
    }
</script>
{#if ready}

<form on:submit|preventDefault={save}>

    <div class="mb-4 mt-4">
        <Input label="Title" placeholder="Title" bind:value={model.title} />
    </div>

    <div class="mb-4 mt-4">
        <Label>Description</Label>
        <Textarea label="Description" placeholder="Description" bind:value={model.description} />
    </div>

    <div class="mb-4"><Toggle label="Status" bind:value={model.status} /></div>
    <div class="mb-4 mt-4">
        <Label>Surcharge</Label>
        <NumberInput label="Surcharge" placeholder="Surcharge" min="0" bind:value={model.surcharge} />
    </div>

<div class="grid grid-cols-10 gap-4 my-4">
    <div class=" col-span-4">
        <label for="provider" class="block mb-2">Provider:</label>
        <Select bind:value={model.providerName} on:change={onChangeProvider} id="provider">
            {#each providers as item}
                <option value={formatProviderName(item.id)}>{item.title} ({item.description})</option>
            {/each}
        </Select>

        {#if providerSettingsFields.length > 0}
            <div class="my-4">
                <Heading tag="h4">Provider Settings</Heading>
                <CustomFields fields={providerSettingsFields} let:field={field} fieldPrimaryKey="varName" bind:model={model.providerSettings}>

                </CustomFields>
            </div>
        {/if}
    </div>

    <div class="col-span-6">
        <Heading tag="h4">Shipping Methods</Heading>
        <TableSearch placeholder="Search by name" hoverable={true} bind:inputValue={shippingMethodSearchTerm} >
            <TableHead>
                <TableHeadCell></TableHeadCell>
                <TableHeadCell>Name</TableHeadCell>
                <TableHeadCell>Provider</TableHeadCell>
            </TableHead>
            <TableBody class="divide-y">
                {#each filteredItems as item}
                    <TableBodyRow>
                        <TableBodyCell>
                            <Checkbox checked={shippingMethodInModel(item)} on:change={setShippingMethod.bind(this, item)} />
                        </TableBodyCell>
                        <TableBodyCell>{item.title}</TableBodyCell>
                        <TableBodyCell>{item.providerName}</TableBodyCell>

                    </TableBodyRow>
                {/each}
            </TableBody>
        </TableSearch>
    </div>
</div>


    <div class="mb-4 mt-4">

        <Button type="submit" size="sm" color="green" class="w-full">
            Save
        </Button>
    </div>
</form>
{/if}
