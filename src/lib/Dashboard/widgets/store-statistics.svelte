<script lang="ts">

import Widget from "../../Shared/widget.svelte";
import {onMount} from "svelte";
import {OrderStatsService} from "../../Order/services/order/order-stats.service";
import Loading from "../../Shared/Loading.svelte";
import {moneyFormat} from "../../helpers/money";
import {Button} from "flowbite-svelte";
import {navigate} from "mcrm-svelte-navigator";
let ready = false;
let stats = null;

onMount(async () => {
    stats = await new OrderStatsService().getAggregateStats();
    ready = true;
})
</script>

<Widget>
    <svelte:fragment slot="heading">Store Statistics</svelte:fragment>
    {#if !ready}
        <div class="justify-center flex">
            <Loading />

        </div>
        {:else}
    <dl class="grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
<a href="#" on:click|preventDefault={() => navigate('/orders/list')}>
        <div class="flex flex-col bg-white/5 p-8">
            <dt class="text-sm font-semibold leading-6 text-gray-300">Orders</dt>
            <dd class="order-first text-3xl font-semibold tracking-tight text-white">{stats.totalOrders}</dd>
        </div>
</a>
        <a href="#" on:click|preventDefault={() => navigate('/orders/list')}>
        <div class="flex flex-col bg-white/5 p-8">
            <dt class="text-sm font-semibold leading-6 text-gray-300">Sales</dt>
            <dd class="order-first text-3xl font-semibold tracking-tight text-white">{moneyFormat(stats.totalSales)}</dd>
        </div>
        </a>
        <a href="#" on:click|preventDefault={() => navigate('/customers/list')}>
        <div class="flex flex-col bg-white/5 p-8">
            <dt class="text-sm font-semibold leading-6 text-gray-300">Customers</dt>
            <dd class="order-first text-3xl font-semibold tracking-tight text-white">{stats.totalCustomers}</dd>
        </div>
        </a>
        <a href="#" on:click|preventDefault={() => navigate('/catalogue/products/list')}>
        <div class="flex flex-col bg-white/5 p-8">
            <dt class="text-sm font-semibold leading-6 text-gray-300">Products</dt>
            <dd class="order-first text-3xl font-semibold tracking-tight text-white">{stats.totalProducts}</dd>
        </div>
        </a>
    </dl>

        {/if}
</Widget>
