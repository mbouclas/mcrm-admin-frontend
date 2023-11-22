<script lang="ts">

    import {
        Button,
        Heading,
        Hr,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        Modal,
        TableHead,
        TableHeadCell
    } from "flowbite-svelte";
    import {onMount} from "svelte";
    import {ShippingService} from "../services/shipping.service";
    import type {IShippingMethod} from "../services/shipping.service";
    import EditShipping from './edit-shipping.svelte';
    import AddShipping from './add-shipping.svelte';
    import type {IPagination} from "../../Shared/models/generic";
    import {Plus} from "svelte-heros-v2";


    const defaultFilters = {
        limit: 12,
        page: 1,
        orderBy: 'createdAt',
        way: 'desc',
    };
    let items = {
        data: [],
    } as IPagination<IShippingMethod>;
    let showEditModal = false,
        showAddModal = false,
    selectedItem: IShippingMethod = null;
    let filters: typeof defaultFilters,
        appliedFilters = [],
        loading = false;

    reset();

    onMount(async () => {
        await reset();
    });

    async function reset() {
        filters = Object.assign({}, defaultFilters);
        await search();
    }

    async function search() {
        items.data = [];

        loading = true;
        items = await new ShippingService().find();
        loading = false;
    }

    async function deleteItem(item: IShippingMethod) {
        const r = confirm('Are you sure you want to delete this item?');
        if (!r) {return;}

        await new ShippingService().delete(item.uuid);
        await search();
    }

    function editItem(item: IShippingMethod) {
        selectedItem = item;
        showEditModal = true;
    }
</script>
<Modal title={`Edit ${selectedItem ? selectedItem.title : ''}`} bind:open={showEditModal} size="xl" autoclose={false}>
    <EditShipping bind:uuid={selectedItem.uuid} on:saved={() => reset()} />
</Modal>

<Modal title={`Add new method`} bind:open={showAddModal} size="xl" autoclose={false}>
    <EditShipping  on:saved={() => reset()} />
</Modal>
<Heading tag="h3" class="mb-4">Shipping Methods</Heading>
<Hr class="mb-4" />
<Table>
    <TableHead defaultRow={false}>
        <tr>
            <TableHeadCell colspan="2"></TableHeadCell>
            <TableHeadCell colspan="3">
                <div class="items-end flex justify-end">
                    <Button color="green" title="Add new" on:click={() => showAddModal = true}><Plus /></Button>
                </div>

            </TableHeadCell>
        </tr>
        <tr>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Code</TableHeadCell>
            <TableHeadCell>Base Cost</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
            <TableHeadCell></TableHeadCell>
        </tr>
    </TableHead>
        <TableBody class="divide-y">
            {#each items.data as item}
                <TableBodyRow>
                    <TableBodyCell>{item.title}</TableBodyCell>
                    <TableBodyCell>{item.code}</TableBodyCell>
                    <TableBodyCell>{item.baseCost || 'None'}</TableBodyCell>
                    <TableBodyCell>{item.status ? 'Active' : 'Disabled'}</TableBodyCell>
                    <TableBodyCell>
                        <Button on:click={editItem.bind(this, item)}>
                            <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="w-5 h-5"
                            >
                                <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                />
                            </svg>
                        </Button>
                        <Button on:click={deleteItem.bind(this, item)}>
                            <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="w-5 h-5"
                            >
                                <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                            </svg>
                        </Button>
                    </TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>

</Table>
