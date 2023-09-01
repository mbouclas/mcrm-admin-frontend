<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from 'flowbite-svelte';
  import ItemSelectorModal from '../../../DynamicFields/fields/item-selector-modal.svelte';
  import { formatDate } from '../../../helpers/dates';

  import Loading from '../../../Shared/Loading.svelte';

  import { useParams } from 'svelte-navigator';
  import { ProductsService } from '../../services/products/products.service';

  import { productItemSelectorConfig } from '../../../Shared/item-selector-configs';

  const params = useParams();
  const s = new ProductsService();
  let model;
  let loading = false;

  onMount(async () => {
    model = await s.findOne($params.id, ['*']);
    console.log(model);
  });

  async function relate(name: string, value: any) {
    await s.relate($params.id, value);
    model = await s.findOne($params.id, ['*']);
  }
</script>

<ItemSelectorModal
  config={productItemSelectorConfig}
  on:select={(e) => relate('product', e.detail.uuid)}
  closeOnSelect={true}
  label="Select Customer"
  selectMode="single"
>
  <Button
    >Select products
    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
      ><path fill="currentColor" d="M10 20v-7L2.95 4h18.1L14 13v7h-4Z" /></svg
    >
  </Button>
</ItemSelectorModal>

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
                SKU
              </th>
              <th
                scope="col"
                class="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                Title
              </th>
              <th
                scope="col"
                class="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                Status
              </th>
              <th scope="col" class="relative py-3.5 px-4">
                <span class="sr-only">Edit</span>
              </th>

              <th
                scope="col"
                class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                Date
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
          {#if model?.related?.length}
            {#each model.related as item}
              <tr>
                <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                  <div class="inline-flex items-center gap-x-3">
                    <input
                      type="checkbox"
                      class="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
                    />
                    <a href={`/catalogue/products/${item.uuid}`} class="h-12 w-12">
                      <img src={item.thumb} />
                    </a>
                  </div>
                </td>
                <td class="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                  <a href={`/catalogue/products/${item.uuid}`} class="hover:underline">
                    {item.sku}
                  </a>
                </td>
                <td class="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                  <a href={`/catalogue/products/${item.uuid}`} class="hover:underline">
                    {item.title}
                  </a>
                </td>

                <td class="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap"> {item.status}</td>
                <td class="px-4 py-4 text-sm whitespace-nowrap">
                  {formatDate(item.createdAt)}
                </td>
                <td class="px-4 py-4 text-sm whitespace-nowrap" />
              </tr>
            {/each}
          {/if}
        </table>
      </div>
    </div>
  </div>
</div>
