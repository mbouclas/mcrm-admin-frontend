<script lang="ts">
  import { onMount } from 'svelte';
  import { ProductCategoryService } from '../services/products/product-category.service';
  import TreeView from '../../Shared/Tree-Selector.svelte';
  import Loading from '../../Shared/Loading.svelte';

  import { createEventDispatcher } from 'svelte';
  import { ProductsService } from '../services/products/products.service';
  const dispatch = createEventDispatcher();

  let items = [],
    loading = false;
  export let model = [];
  export let label = 'Categories';
  export let saveOnSelect = false;
  export let productId;

  onMount(async () => {
    items = await new ProductCategoryService().tree();
  });

  async function onCategorySelection(e) {
    model = e.detail;
    dispatch('selection', e.detail);
    if (saveOnSelect) {
      await new ProductsService().saveProductCategories(productId, model);
    }
  }
</script>

<h3 class="text-xl py-4 font-semibold tracking-tight text-gray-900 dark:text-white">
  {label} ( {model.length} selected )
</h3>
<div
  class="w-full p-4 max-h-[500px] overflow-y-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
>
  {#if loading}
    <Loading />
  {:else}
    <TreeView tree={items} on:selection={onCategorySelection} bind:model title="Categories" addIdsOnly={false} />
  {/if}
</div>
