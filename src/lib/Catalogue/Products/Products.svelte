<script lang="ts">
  import type { IPagination } from '../../Shared/models/generic';
  import { ProductsService } from '../services/products/products.service';
  import SortButton from '../../Shared/SortTableHeadButton.svelte';
  import Loading from '../../Shared/Loading.svelte';
  import { formatDate } from '../../helpers/dates';
  import {
    Banner,
    Button,
    Checkbox,
    Dropdown,
    DropdownItem,
    Modal as NativeModal, Search, Table, TableBody, TableBodyCell, TableBodyRow,
    TableHead,
    TableHeadCell, TableSearch
  } from 'flowbite-svelte';

  import Paginator from '../../Shared/Paginator.svelte';
  import { moneyFormat } from '../../helpers/money';
  import Modal from '../../Shared/Modal.svelte';
  import CustomFilters from '../../Shared/CustomFilters.svelte';
  import { navigate, useLocation } from 'mcrm-svelte-navigator';
  import {ChevronDown, Plus, Trash} from "svelte-heros-v2";
  import BulkAssignSalesChannel from './bulk-actions/assign-sales-channel.svelte';
  import BulkEditCategories from './bulk-actions/edit-categories.svelte';
  import FiltersBar from './filters.svelte';
  import {DotsVertical} from "radix-icons-svelte";
  import QuickEdit from './Product.svelte';
  import AddNew from './ProductAdd.svelte';
  import type {ProductModel} from "../models/product.model";

  let showModal = false;
  let searchVal = '',
          searchTerm = '',
          showAddNewModal = false;

  const location = useLocation();
  const currentPath = $location.pathname;
  const queryParams = new URLSearchParams($location.search);

  let items = {
    data: [],
  } as IPagination<any>;
  const service = new ProductsService();
  const defaultFilters = {
    limit: 12,
    page: 1,
    orderBy: 'createdAt',
    way: 'desc',
    q: '',
  };
  let filters: typeof defaultFilters,
    appliedFilters = [],
    loading = false,
          filteredItems = [];

  let selected: string[] = [],// the uuids of the selected items
          originalSelection: string[] = []// A copy of the selection to revert to if the user hits the clear all
  ;
  let allSelected = false,
  hiddenItemsSelected = false,
          showBulkAssignSalesChannelModal = false,
          showQuickEdit = false,
          showBulkEditCategoriesModal = false
    ;
  let timeout: any;
  let selectedItemId = null;
  let bulkOperationsUnderWay = false;
  reset();

  async function search() {
    items.data = [];

    loading = true;
    items = await service.find(filters, ['productCategory', 'variants', 'thumb']);

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

  function singleItemSelected() {
    allSelected = selected.length === items.data.length;
  }

  async function toggleSelectAll() {
    allSelected = !allSelected;
    if (allSelected) {
      selected = items.data.map((item) => item.uuid);
    } else {
      selected = [];
    }

    originalSelection = selected;
  }

  async function selectAll() {
    hiddenItemsSelected = !hiddenItemsSelected;
    if (hiddenItemsSelected) {
      const r = await service.getProductIdsFromFilters(filters, items.total);
      selected = r;
      return;
    }

    selected = originalSelection;
  }

  async function bulkToggleStatus(activate: boolean) {
    bulkOperationsUnderWay = true;
    const data = selected.map((uuid) => ({ uuid, active: activate }));
    await service.bulkUpdate(data);
    await search();
    selected = [];
    bulkOperationsUnderWay = false;
  }

    async function applyFilters() {
        await search();
    }

    async function clearFilters() {
        await reset();
    }

  async function bulkAssignToSalesChannel() {
    // assign here
    showBulkAssignSalesChannelModal = true;
  }

    async function bulkEditCategories() {
        // edit here
      showBulkEditCategoriesModal = true;
    }

  function quickEdit(item) {
    selectedItemId = item.uuid;
    showQuickEdit = true;
  }

  async function handleSearch() {
    if (loading) {return}
    //debounce search
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      filters.q = searchTerm;
      await search();
    }, 500);
  }

  $: {
    handleSearch();
  }

  function onBulkUpdateDone() {
    showBulkEditCategoriesModal = false;
    showBulkAssignSalesChannelModal = false;
    selected = [];
    search();
  }

  function onNewProductAdded(newProduct: ProductModel) {
    navigate(`/catalogue/products/${newProduct.uuid}`);
  }

</script>
<NativeModal size="sm" bind:open={bulkOperationsUnderWay} title="Please wait..."
       dialogClass="fixed top-0 left-0 right-0 h-modal md:inset-0 md:h-full  w-full p-4 flex z-[99999]">
  <div class="flex items-center justify-center">
    <Loading>Please wait...</Loading>
  </div>
</NativeModal>
<NativeModal size="xl" bind:open={showAddNewModal} title={`Add new product`}>
  <AddNew onSave={onNewProductAdded} />
</NativeModal>

<NativeModal size="xl" bind:open={showBulkEditCategoriesModal} title={`Bulk Edit Categories`}>
<BulkEditCategories uuids={selected} on:done={onBulkUpdateDone}/>
</NativeModal>

<NativeModal size="xl" bind:open={showBulkAssignSalesChannelModal} title={`Assign Sales Channels`}>
  <BulkAssignSalesChannel uuids={selected} on:done={onBulkUpdateDone} />
</NativeModal>

<NativeModal size="xl" bind:open={showQuickEdit} title={`Edit`}>
  <QuickEdit itemId={selectedItemId} />
</NativeModal>

<Modal bind:showModal>
  <div slot="header">Filters</div>
  <div slot="content">
    <CustomFilters
      on:change={(e) => {
        filters[e.detail.key] = e.detail.value;
      }}
      bind:search={searchVal}
    />
  </div>
  <div slot="footer">
    <button class="bg-blue-500 px-2 py-1 rounded" autofocus on:click={searchByFilters}>Search</button>
  </div>
</Modal>

<div class="max-w-screen-xl">
  <div class="max-w-screen-sm">
    <h2 class="mb-4 text-xl lg:text-2xl tracking-tight font-extrabold text-gray-900 dark:text-white outline-none">
      <span class="text-blue-400"> {items.total}</span> Products
    </h2>
  </div>
</div>

<div class="flex items-center space-x-4">
  <Button on:click={() => showAddNewModal = true} class="bg-green-500 rounded p-2">
    <Plus /></Button>

  {#each appliedFilters as filter}
    <button>{filter.name}</button>
  {/each}

<!--  <button on:click={() => (showModal = true)} class="bg-blue-500 rounded p-2">Filters</button>-->
  <FiltersBar bind:filters={filters} on:filter={applyFilters} on:clear={clearFilters} />

  {#if selected.length >0}
  <Button color="purple">With {selected.length} Items
    <ChevronDown class="w-3 h-3 ml-2 text-white dark:text-white" />
  </Button>
    <Dropdown>
      <DropdownItem on:click={bulkToggleStatus.bind(this, true)}>Activate</DropdownItem>
      <DropdownItem  on:click={bulkToggleStatus.bind(this, false)}>Deactivate</DropdownItem>
      <DropdownItem on:click={bulkAssignToSalesChannel}>Assign to sales channel</DropdownItem>
      <DropdownItem on:click={bulkEditCategories}>Edit Categories</DropdownItem>
    </Dropdown>
    {/if}
</div>
{#if selected.length >0}
  <div class="my-4 p-4">
    <Banner id="info-banner" position="relative" bannerType="info">
      <div slot="header" class="mb-4 md:mb-0 md:mr-4">
        <h2 class="mb-1 text-base font-semibold text-gray-900 dark:text-white">
          {#if !hiddenItemsSelected && allSelected}
          All {selected.length} items on this page are selected
            {:else if !hiddenItemsSelected && !allSelected}
            {selected.length} items are selected

            {:else}
            All {selected.length} items are selected
            {/if}
        </h2>
        <p class="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
          {#if !hiddenItemsSelected && allSelected}
          <a href="#" on:click|preventDefault={selectAll} class="underline font-bold">
            Select all {items.total} items
          </a>
            {:else if hiddenItemsSelected}
            <a href="#" on:click|preventDefault={selectAll} class="underline font-bold">
              Clear Selection
            </a>
              {/if}
        </p>
      </div>

    </Banner>
  </div>
{/if}
<div class="my-4">
  <Search placeholder="Search in Titles, sku, descriptions..." bind:value={searchTerm} on:input={handleSearch} on:keyup={handleSearch} />
</div>
<Table  hoverable={true} bind:inputValue={searchTerm} >
  <TableHead>
      <TableHeadCell>
        <Checkbox checked={allSelected}
                  on:change={toggleSelectAll}
        />
      </TableHeadCell>
    <TableHeadCell></TableHeadCell>
    <TableHeadCell>
      <SortButton name="sku" way={filters.way} activeFilter={filters.orderBy} onChange={changeOrderBy}
      >SKU</SortButton
      >
    </TableHeadCell>
    <TableHeadCell>
      <SortButton name="title" way={filters.way} activeFilter={filters.orderBy} onChange={changeOrderBy}
      >Title</SortButton>
    </TableHeadCell>
    <TableHeadCell>
      <SortButton name="status" way={filters.way} activeFilter={filters.orderBy} onChange={changeOrderBy}>Status</SortButton>
    </TableHeadCell>
    <TableHeadCell>Categories</TableHeadCell>
    <TableHeadCell>#Variants</TableHeadCell>
    <TableHeadCell>
      <SortButton name="price" way={filters.way} activeFilter={filters.orderBy} onChange={changeOrderBy}
      >Price</SortButton>
    </TableHeadCell>
    <TableHeadCell>
      <SortButton name="createdAt" way={filters.way} activeFilter={filters.orderBy} onChange={changeOrderBy}
      >Date</SortButton>
    </TableHeadCell>
    <TableHeadCell></TableHeadCell>
  </TableHead>
  <TableBody class="divide-y">
    {#if Array.isArray(items.data) && !loading}
      {#each items.data as item}
        <TableBodyRow>
          <TableBodyCell>
            <Checkbox bind:group={selected}
                      on:change={singleItemSelected}
                      value={item.uuid}
            />
          </TableBodyCell>
          <TableHeadCell><img src={typeof item.thumb === 'object' ? item.thumb.url : item.thumb}  class="w-16 object-cover" /></TableHeadCell>
          <TableBodyCell>
            <a href="#" on:click|preventDefault={() => navigate(`/catalogue/products/${item.uuid}`)}
                    class="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer">
              {item.sku}
            </a>
          </TableBodyCell>
          <TableBodyCell>{item.title}</TableBodyCell>
          <TableBodyCell>
            <Button
                    title="Status"
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
            </Button>
          </TableBodyCell>
          <TableBodyCell>
            <div class="flex items-center gap-x-6">
              {#if Array.isArray(item.productCategory)}
                {#each item.productCategory as category, idx}
                  {category.title}
                  {#if idx < item.productCategory.length - 1}
                    ,
                  {/if}
                {/each}
              {/if}
            </div>
          </TableBodyCell>
          <TableBodyCell>{Array.isArray(item.variants) ? item.variants.length : '-'}</TableBodyCell>
          <TableBodyCell>
            {moneyFormat(item.price)}
          </TableBodyCell>
          <TableBodyCell>
            {formatDate(item.createdAt)}
          </TableBodyCell>
          <TableBodyCell>
            <Button>
              <DotsVertical/>
            </Button>
            <Dropdown>
              <DropdownItem>
                <Button on:click={quickEdit.bind(this, item)}>Quick Edit</Button>
              </DropdownItem>
              <DropdownItem class="bg-red-600">
                <Button><Trash /> Delete</Button>
              </DropdownItem>
            </Dropdown>
          </TableBodyCell>
        </TableBodyRow>
    {/each}
      {:else}
      <TableBodyRow>
        <TableBodyCell colspan="9">
          <div class="flex justify-center">
            <Loading>
              Loading...
            </Loading>
          </div>

        </TableBodyCell>
      </TableBodyRow>
      {/if}
  </TableBody>
</Table>
{#if !loading}
  <Paginator
          totalPages={parseInt(items.pages)}
          baseURL={`/orders`}
          total={parseInt(items.total)}
          currentPage={parseInt(items.page)}
          on:pageChange={handlePageChange}
  />
  {/if}
