<script lang="ts">
    import {BottomNav, BottomNavItem, Heading, Hr, StepIndicator} from 'flowbite-svelte';
    import CustomerInfo from './customer-select.svelte';
    import Items from './items-select.svelte';
    import Fulfillment from './fullfilment-select.svelte';
    import Payment from './payment.svelte';
    import Finalize from './finalize.svelte';
    import {OrderModel} from "../models/order.model";
    import {ArrowLeft, ArrowRight, ExclamationTriangle} from "svelte-heros-v2";
    import {navigate} from "mcrm-svelte-navigator";


    let currentStep = 1,
    stepIsValid = false;

    let steps = [
        'Customer Information',
        'Items',
        'Fulfillment',
        'Payment & Shipping',
        'Finalize'
    ];
    let model = new OrderModel();

    function next() {
        stepIsValid = false;
        currentStep++;
    }

    function back() {
        currentStep--;
    }

    function cancel() {
        navigate('/orders/list');
    }
</script>

<Heading tag="h4">Add an order</Heading>
<Hr/>

<StepIndicator {currentStep} {steps} glow color="pink" />

<div class="my-6">
{#if currentStep === 1}
    <CustomerInfo bind:model={model} bind:isValid={stepIsValid} />
{:else if currentStep === 2}
    <Items bind:model={model} bind:isValid={stepIsValid} />
{:else if currentStep === 3}
    <Fulfillment bind:model={model} bind:isValid={stepIsValid} />
{:else if currentStep === 4}
    <Payment bind:model={model} bind:isValid={stepIsValid} />
{:else if currentStep === 5}
    <Finalize bind:model={model} />
{/if}
</div>
<div class=" py-12">
</div>

<BottomNav position="fixed" classInner="grid-cols-3">
    <BottomNavItem btnName="Cancel" on:click={cancel}>
        <ExclamationTriangle class="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500" />
    </BottomNavItem>
    {#if currentStep > 1}
        <BottomNavItem btnName="Back" on:click={back}>
            <ArrowLeft class="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500" />
        </BottomNavItem>
        {/if}

    {#if currentStep < 5}
    <BottomNavItem btnName="Next" on:click={next} disabled={!stepIsValid}>
        <ArrowRight class="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500" />
    </BottomNavItem>
        {/if}

</BottomNav>
