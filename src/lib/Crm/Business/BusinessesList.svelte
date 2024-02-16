<script lang="ts">
    import {navigate, useLocation} from "mcrm-svelte-navigator";
    import type {IPagination} from "../../Shared/models/generic";
    import {onMount} from "svelte";
    import {BusinessService} from "../services/business.service";
    import {formatDate} from "../../helpers/dates";
    import SortButton from "../../Shared/SortTableHeadButton.svelte";
    import ItemSelectorModal from "../../DynamicFields/fields/item-selector-modal.svelte";
    import Loading from "../../Shared/Loading.svelte";
    import Paginator from "../../Shared/Paginator.svelte";
    import {Button, Modal} from "flowbite-svelte";
    import {businessCategoryItemSelectorConfig} from "../../Shared/item-selector-configs.js";
    import AddNew from "./BusinessAdd.svelte";
    import {Plus} from "svelte-heros-v2";
    import type {ProductModel} from "../../Catalogue/models/product.model";
    import type {BusinessModel} from "../models/business.model";

    let showModal = false;
    let searchVal = '',
        searchTerm = '',
        showAddNewModal = false,
        showEditModal = false;
    let allSelected = false,
        hiddenItemsSelected = false,
        showBulkAssignSalesChannelModal = false,
        showQuickEdit = false,
        showBulkEditCategoriesModal = false
    ;
    let timeout: any;
    let selectedItemId = null;
    let bulkOperationsUnderWay = false;

    const location = useLocation();
    const currentPath = $location.pathname;
    const queryParams = new URLSearchParams($location.search);

    let items = {
        data: [],
    } as IPagination<any>;
    const service = new BusinessService();
    const defaultFilters = {
        limit: 12,
        page: 1,
        orderBy: 'createdAt',
        way: 'desc',
        q: '',
    };
    let filters: typeof defaultFilters,
        appliedFilters = [],
        loading = false;

    reset();

    onMount(async () => {

    });

    async function search() {
        items.data = [];

        loading = true;
        items = await service.find(filters, ['businessCategory']);

        loading = false;
    }

    async function reset() {
        filters = Object.assign({}, defaultFilters);
        navigate(currentPath);
        await search();
    }

    async function changeOrderBy(order: string, way: string) {
        if (filters.orderBy === order) {
            filters.way = filters.way === 'asc' ? 'desc' : 'asc';
        }

        filters.orderBy = order;

        await search();
    }

    async function toggleStatus(uuid: string) {
        const foundIndex = items.data.findIndex((i) => i.uuid === uuid);
        const newActive = !items.data[foundIndex].active;

        await service.update(uuid, { active: newActive });

        items.data[foundIndex].active = newActive;
    }

    async function setFilter(name: string, value: any) {
        filters.page = 1;
        filters[name] = value;
        appliedFilters = [...appliedFilters, { name, value }];
        await search();
    }

    async function handlePageChange(e) {
        filters.page = e.detail;
        await search();
    }

    async function searchByFilters() {
        if (searchVal.trim().length) {
            queryParams.set('q', searchVal);
            const newUrl = currentPath + '?' + queryParams.toString();
            navigate(newUrl);
            filters.q = searchVal;
        }
        await search();
        showModal = false;
    }

    function onNewItemAdded(item: BusinessModel) {
        navigate(`/crm/businesses/${item.uuid}`);
    }
</script>


<Modal size="xl" bind:open={showAddNewModal} title={`Add new product`}>
    <AddNew onSave={onNewItemAdded} />
</Modal>

<div class="max-w-screen-xl">
    <div class="max-w-screen-sm">
        <h2 class="mb-4 text-xl lg:text-2xl tracking-tight font-extrabold text-gray-900 dark:text-white outline-none">
            <span class="text-blue-400">{items.total}</span> Businesses
        </h2>
    </div>
</div>

<div class="flex items-center space-x-4">
    <Button on:click={() => showAddNewModal = true} class="bg-green-500 rounded p-2">
        <Plus />
    </Button>
</div>

<div class="flex flex-col mt-6">
    <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th
                                scope="col"
                                class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                            <div class="flex items-center gap-x-3">
                                <input
                                        type="checkbox"
                                        class="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
                                />
                            </div>
                        </th>
                        <th
                                scope="col"
                                class="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                            <SortButton name="title" way={filters.way} activeFilter={filters.orderBy} onChange={changeOrderBy}
                            >Title</SortButton
                            >
                        </th>
                        <th
                                scope="col"
                                class="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                            <SortButton name="status" way={filters.way} activeFilter={filters.orderBy} onChange={changeOrderBy}
                            >Status</SortButton
                            >
                        </th>
                        <th
                                scope="col"
                                class="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                            <ItemSelectorModal
                                    config={businessCategoryItemSelectorConfig}
                                    on:select={(e) => setFilter('category', e.detail.uuid)}
                                    closeOnSelect={true}
                                    label="Select Customer"
                                    selectMode="single"
                            >
                                <Button
                                >Categories
                                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                                    ><path fill="currentColor" d="M10 20v-7L2.95 4h18.1L14 13v7h-4Z" /></svg
                                    >
                                </Button>
                            </ItemSelectorModal>
                        </th>

                        <th
                                scope="col"
                                class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                            <SortButton name="createdAt" way={filters.way} activeFilter={filters.orderBy} onChange={changeOrderBy}
                            >Date</SortButton
                            >
                        </th>
                    </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                    {#if loading}
                        <tr>
                            <td colspan="10" class="text-center py-10">
                                <Loading />
                            </td>
                        </tr>
                    {/if}
                    </tbody>
                    {#if items.data}
                        {#each items.data as item}
                            <tr>
                                <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                    <div class="inline-flex items-center gap-x-3">
                                        <input
                                                type="checkbox"
                                                class="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
                                        />
                                        <a href="#" on:click|preventDefault={() => navigate(`/cms/pages/${item.uuid}`)} class="h-12 w-12">
                                            <img src={item?.thumb?.url || item?.thumb} />
                                        </a>
                                    </div>
                                </td>
                                <td class="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                    <a
                                            class="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer"
                                            href="#" on:click|preventDefault={() => navigate(`/crm/businesses/${item.uuid}`)}
                                    >
                                        {item.title}
                                    </a>
                                </td>

                                <td class="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                    <button
                                            title="Edit Order"
                                            on:click={toggleStatus.bind(this, item.uuid)}
                                            type="button"
                                            class="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none"
                                    >
                                        {#if !item.active}
                                            <svg
                                                    class="text-red-500"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="32"
                                                    height="32"
                                                    viewBox="0 0 24 24"
                                            ><path
                                                    fill="currentColor"
                                                    d="M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zM7 15c-1.66 0-3-1.34-3-3s1.34-3 3-3s3 1.34 3 3s-1.34 3-3 3z"
                                            /></svg
                                            >
                                        {:else}
                                            <svg
                                                    class="text-green-500"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="32"
                                                    height="32"
                                                    viewBox="0 0 24 24"
                                            ><path
                                                    fill="currentColor"
                                                    d="M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3s3 1.34 3 3s-1.34 3-3 3z"
                                            /></svg
                                            >
                                        {/if}
                                    </button>
                                </td>
                                <td class="px-4 py-4 text-sm whitespace-nowrap text-center">
                                    {#if Array.isArray(item.businessCategory)}
                                    <div class="flex items-center gap-x-6">
                                        {#each item.businessCategory as category, idx}
                                            <button on:click={setFilter.bind(this, 'category', category.uuid)}>{category.title}</button>
                                            {#if idx < item.businessCategory.length - 1}
                                                ,
                                            {/if}
                                        {/each}
                                    </div>
                                        {/if}
                                </td>
                                <td class="px-4 py-4 text-sm whitespace-nowrap">
                                    {formatDate(item.createdAt)}
                                </td>
                            </tr>
                        {/each}
                    {/if}
                </table>
            </div>
        </div>
    </div>

    <Paginator
            totalPages={parseInt(items.pages)}
            baseURL={`/orders`}
            total={parseInt(items.total)}
            currentPage={parseInt(items.page)}
            on:pageChange={handlePageChange}
    />
</div>
