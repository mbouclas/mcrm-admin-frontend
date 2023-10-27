<script lang="ts">
    import Widget from "../../../Shared/widget.svelte";
    import {onMount} from "svelte";
    import Loading from "../../../Shared/Loading.svelte";
    import {OrderService} from "../../services/order/order.service";
    import type {OrderModel} from "../models/order.model";
    import {Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell} from "flowbite-svelte";
    import {app} from "../../../stores";
    import {get} from 'svelte/store'
    import {moneyFormat} from "../../../helpers/money";
    import {formatDate} from "../../../helpers/dates";
    import {navigate} from "mcrm-svelte-navigator";

    export let limit = 5;
    let ready = false;
    let orders: OrderModel[] = [],
    statuses = [];

    onMount(async () => {
        statuses = get(app).configs.store.orderStatuses;
        const res = await new OrderService().find({limit}, ['*']);
        orders = res.data;
        ready = true;
    })


    function getStatus(id: number) {
        return statuses.find((s) => s.id === id);
    }

</script>
<Widget>
    <svelte:fragment slot="heading">Latest Orders</svelte:fragment>
    {#if !ready}
        <div class="flex justify-center">
            <Loading />
        </div>
        {:else}
    <Table>
        <TableHead>
            <TableHeadCell>#ID</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
            <TableHeadCell>Customer</TableHeadCell>
            <TableHeadCell>Total</TableHeadCell>
            <TableHeadCell>Date</TableHeadCell>
        </TableHead>
        <TableBody>
            {#each orders as order}
                <TableBodyRow>
                    <TableBodyCell>
                        <a href="#" class="underline hover:no-underline text-indigo-500" on:click|preventDefault={() => navigate(`/orders/${order.uuid}`)}>
                            {order.orderId}
                        </a>
                    </TableBodyCell>
                    <TableBodyCell>{getStatus(order.status).label}</TableBodyCell>
                    <TableBodyCell>{order.user.lastName} {order.user.firstName}</TableBodyCell>
                    <TableBodyCell>{moneyFormat(order.total)}</TableBodyCell>
                    <TableBodyCell>{formatDate(order.createdAt)}</TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
        {/if}
</Widget>

