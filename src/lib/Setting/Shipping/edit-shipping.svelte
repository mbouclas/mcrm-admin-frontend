<script lang="ts">
    import {createEventDispatcher, onMount} from "svelte";
    import {Select, Input, NumberInput, Toggle, Button} from "flowbite-svelte";
    import type {IShippingMethod, IShippingMethodProvider} from "../services/shipping.service";
    import {ShippingService} from "../services/shipping.service";

    const dispatch = createEventDispatcher();
    export let uuid: string = null;
    let model: IShippingMethod = null;
    let providers: IShippingMethodProvider[] = [];
    onMount(async () => {
        model = await new ShippingService().findOne(uuid);

        providers = await new ShippingService().getProviders();
    });

    async function save() {
        dispatch('saved', model);
    }

    function onChange(e) {
        model.providerName = e.target.value;
    }
</script>
{#if model && providers.length > 0}

<form on:submit|preventDefault={save}>
    <div class="mb-4">
    <Toggle id="status" on:change={() => model.status = !model.status} checked={model.status}>Status</Toggle>
    </div>
    <div class="mb-4">
        <label for="title" class="block mb-2">Title:</label>
        <Input id="title" bind:value={model.title} required class="w-full" />
    </div>
    <div class="mb-4">
        <label for="code" class="block mb-2">Code:</label>
        <Input id="code" bind:value={model.code} required class="w-full" />
    </div>
    <div class="mb-4">
        <label for="baseCost" class="block mb-2">Base Cost:</label>
        <NumberInput id="baseCost" bind:value={model.baseCost} required class="w-full" />
    </div>
    <div class="mb-4">
        <label for="shippingTime" class="block mb-2">Shipping Time:</label>
        <Input id="shippingTime" bind:value={model.shippingTime} required class="w-full" />
    </div>
    <div class="mb-4">
        <label for="provider" class="block mb-2">Provider:</label>
    <Select bind:value={model.providerName} on:change={onChange} id="provider">
        {#each providers as item}
            <option value={item.id}>{item.title} ({item.description})</option>
        {/each}
    </Select>
    </div>

    <div class="my-6">
        <Button type="submit" class="w-full" color="green">Save</Button>
    </div>
</form>
    {/if}
