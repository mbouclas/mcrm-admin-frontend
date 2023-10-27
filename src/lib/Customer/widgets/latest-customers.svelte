<script lang="ts">
import Widget from "../../Shared/widget.svelte";
import {onMount} from "svelte";
import {CustomerService} from "../services/customer/customer.service";
import type {UserModel} from "../../User/User/models/user.model";
import Loading from "../../Shared/Loading.svelte";
import {Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell} from "flowbite-svelte";
import {navigate} from "mcrm-svelte-navigator";
import {formatDate} from "../../helpers/dates";

export let limit = 5;
let customers: UserModel[] = [],
    ready = false;

onMount(async () => {
    const res = await new CustomerService().find({limit});

    customers = res.data;
    ready = true;
});

</script>

<Widget>
    <svelte:fragment slot="heading">Latest Customers</svelte:fragment>
    {#if !ready}
        <div class="flex justify-center">
            <Loading />
        </div>
    {:else}
        <Table>
            <TableHead>
                <TableHeadCell>Customer</TableHeadCell>
                <TableHeadCell>Email</TableHeadCell>
                <TableHeadCell>Active</TableHeadCell>
                <TableHeadCell>Created At</TableHeadCell>
            </TableHead>
            <TableBody>
                {#each customers as item}
                    <TableBodyRow>
                        <TableBodyCell>
                            <a href="#" class="underline hover:no-underline text-indigo-500" on:click|preventDefault={() => navigate(`/customers/${item.uuid}`)}>
                                {item.firstName} {item.lastName}
                            </a>
                        </TableBodyCell>
                        <TableBodyCell>{item.email}</TableBodyCell>
                        <TableBodyCell>{item.active ? 'Yes' : 'No'}</TableBodyCell>
                        <TableBodyCell>{formatDate(item.createdAt)}</TableBodyCell>
                    </TableBodyRow>
                    {/each}
            </TableBody>
        </Table>
        {/if}
</Widget>
