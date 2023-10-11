<script lang="ts">
    import {Button, Heading, Input, Select} from "flowbite-svelte";
    import {createEventDispatcher, onMount} from "svelte";
    import {
        type IPaymentMethod,
        type IPaymentMethodProvider,
        PaymentMethodService
    } from "./services/payment-method.service";



    const dispatch = createEventDispatcher();
    const model: Partial<IPaymentMethod> = {};
    export let onSave: (model: Partial<IPaymentMethod>) => void = undefined;
    let providers: IPaymentMethodProvider[] = [];
    const service = new PaymentMethodService();

    onMount(async () => {
        providers = await service.getProviders();
        model.providerName = formatProviderName(providers[0].id);
    });

    async function save() {
        const res = await service.store(model);
        onSave(res);
        dispatch('save', res);
    }


    function formatProviderName(name: string) {
        return name.replace('Provider', '').toLocaleLowerCase();
    }

</script>
<Heading tag="h4">Start by adding the channels name</Heading>
{JSON.stringify(model)}
<form on:submit|preventDefault={save}>
    <div class="my-4">
        <Input label="Title" placeholder="Title" bind:value={model.title} required={true} />
    </div>

    <div class=" col-span-4">
        <label for="provider" class="block mb-2">Provider:</label>
        <Select bind:value={model.providerName}  id="provider">
            {#each providers as item}
                <option value={formatProviderName(item.id)}>{item.title} ({item.description})</option>
            {/each}
        </Select>
    </div>
    <div class="mb-4 mt-4">

        <Button type="submit" size="sm" color="blue" class="w-full">
            Next
        </Button>
    </div>
</form>
