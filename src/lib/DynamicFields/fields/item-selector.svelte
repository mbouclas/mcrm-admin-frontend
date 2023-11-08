<script lang="ts">
  import type { IItemSelectorConfig } from '../types';
  import type { IGenericObject, IPagination } from '../../Shared/models/generic';
  import { createEventDispatcher, onMount } from 'svelte';
  import { ItemSelectorService } from '../../Shared/item-selector.service';
  import { moneyFormat } from '../../helpers/money';
  import {Search} from "flowbite-svelte";

  const dispatch = createEventDispatcher();
  export let label = '';
  export let selectMode: 'single' | 'multiple' = 'single';
  export let config: IItemSelectorConfig;
  export let labelField = config.labelField || 'title';
  export let selectedItems: any[] = [];
  export let selectedItem: any;
  export let skipUuids = [];
  let selection = [];
  export let idField = config.idField || 'uuid';
  export let useQueryFilter = true;
  export let refresh = false;

  export let onSelect: (item: any) => void;

  export let labels = config.labels || [
    {
      label: 'Title',
      field: 'title',
    },
  ];
  let items: IPagination<any>,
    loading = false,
    timer,
    temp = {} as IPagination<any>,
    breadcrumbs = [];
  const defaultFilters = {
    limit: 12,
    page: 1,
    order: 'createdAt',
    way: 'desc',
  };

  let filters: typeof defaultFilters;
  reset();

  onMount(async () => {
    filters = config.filters ? Object.assign({}, defaultFilters, config.filters || {}) : {};
    await search();
  });

  async function search() {
    const service = new ItemSelectorService(config.apiUrl);

    loading = true;
    items = await service.find(filters, config.with || []);
    temp = items;
    loading = false;

    if (config.filter && config.filter === 'local' && filters.q) {
      const res = service.localFilter(items, filters.q, config.isTree);
      items = {
        data: res,
      } as IPagination<any>;
    }

    if (config.postProcessing) {
        items.data = config.postProcessing(items.data);
    }
  }

  function composeLabelField(field: string, obj: IGenericObject) {
    if (field.includes('.') === false) {
      return formatField(field, obj[field]);
    }

    return field
      .split('.')
      .map((f) => obj[f])
      .join(' ');
  }

  function formatField(field: string, value: any) {
    let type = 'string';
    const found = labels.filter((l) => l.type).find((l) => l.field === field);
    if (found) {
      type = found.type;
    }

    if (type === 'date') {
      return new Date(value).toLocaleDateString();
    }

    if (type === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    if (type === 'number') {
      return value.toLocaleString();
    }

    if (type === 'money') {
      return moneyFormat(value);
    }

    if (type === 'image') {
      return `<img src="${value}" class="h-12" />`;
    }

    return value;
  }

  async function onQueryChange(e) {

    clearTimeout(timer);
    timer = setTimeout(async () => {
      await search();
    }, 300);
  }

  async function onInput(e) {
    if (e.target.value.length === 0) {
      reset();
      await search();
    }
  }

  async function reset() {
    filters = Object.assign({}, defaultFilters, config.filters || {});
  }

  function selectItem(item) {
    if (selectMode === 'multiple') {
      if (selection.includes(item)) {
        selection = selection.filter((i) => i[idField] !== item[idField]);
      } else {
        selection.push(item);
      }
      selectedItems = selection;
      dispatch('selection', selectedItems);

      if (onSelect) {
        onSelect(selectedItems);
      }

      return;
    }
    selectedItem = item;
    dispatch('select', item);
    if (onSelect) {
      onSelect(item);
    }
  }

  function selectAll(e) {
    items.data.forEach((item) => {
      selectItem(item);
    });
  }

  function showChildren(parent) {
    // breadcrumbs.push(parent);
    breadcrumbs = [...breadcrumbs, parent];

    items = {
      data: parent.children,
    } as IPagination<any>;
  }

  function goBackToParent(level = 0) {
    if (level === 0) {
      items = temp;
      breadcrumbs = [];
      return;
    }

    items = {
      data: breadcrumbs[level - 1].children,
    };
    breadcrumbs = breadcrumbs.slice(0, level);
  }

  $: {
    if (refresh) {
      onQueryChange('q', filters.q);

      refresh = false;
    }
  }
</script>

<h2>{label}</h2>

{#if config.isTree}
  <div class="flex space-x-2 py-4 z-50 my-4">
    <button on:click={goBackToParent.bind(this, 0)}>
      <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
        ><path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8z" /></svg
      >
    </button>
    {#each breadcrumbs as breadcrumb, idx}
      <span class="text-gray-500 dark:text-gray-400">
        <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
          ><path fill="currentColor" d="M10 6L8.59 7.41L13.17 12l-4.58 4.59L10 18l6-6z" /></svg
        >
      </span>

      {#if idx !== breadcrumbs.length - 1}
        <button on:click={goBackToParent.bind(this, idx + 1)}>{breadcrumb[labelField]}</button>
      {:else}
        {breadcrumb[labelField]}
      {/if}
    {/each}
  </div>
{/if}
{#if useQueryFilter}
  <div class="my-4">
<Search type="search" bind:value={filters.q} on:input={onInput} on:keyup={onQueryChange} placeholder="Filter" />
  </div>
  {/if}
{#if items}
  <slot name="items" items={items}>
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-auto">
      <thead class="bg-gray-50 dark:bg-gray-800">
      <tr>
        <th
                scope="col"
                class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
        >
          {#if selectMode === 'multiple'}
            <input type="checkbox" on:change={selectAll} />
          {/if}
        </th>
        {#each labels as label}
          <th
                  scope="col"
                  class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
          >{label.label}
          </th>
        {/each}
        {#if config.isTree}
          <th
                  scope="col"
                  class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
          />
        {/if}
      </tr>
      </thead>
      <tbody>
      {#each items.data.filter((item) => !skipUuids.includes(item.uuid)) as item}
        <tr>
          <td class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 w-12">
            {#if selectMode === 'multiple'}
              <input
                      type="checkbox"
                      on:change={selectItem.bind(this, item)}
                      value={item}
                      checked={selectedItems.includes(item)}
              />
            {:else if selectMode === 'single'}
              <button
                      on:click={selectItem.bind(this, item)}
                      class="text-gray-500 dark:text-gray-400 hover:!text-blue-700 hover:bg-gray-500 hover:rounded p-2"
              >
                <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                ><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg
                >
              </button>
            {/if}
          </td>
          {#each labels as label}
            <td class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
            >{composeLabelField(label.field, item)}
            </td>
          {/each}

          {#if config.isTree}
            <td class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
              {#if item.children && item.children.length > 0}
                <button on:click={showChildren.bind(this, item)}>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                  ><path
                          fill="currentColor"
                          d="m19 15l-6 6l-1.42-1.42L15.17 16H4V4h2v10h9.17l-3.59-3.58L13 9l6 6z"
                  /></svg
                  >
                </button>
              {/if}
            </td>
          {/if}
        </tr>
      {/each}
      </tbody>
    </table>
  </slot>

{/if}
