<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from 'flowbite-svelte';
  import { Trash } from 'svelte-heros-v2';
  import {navigate} from "mcrm-svelte-navigator";

  import ItemSelectorModal from '../../../DynamicFields/fields/item-selector-modal.svelte';
  import { formatDate } from '../../../helpers/dates';

  import Loading from '../../../Shared/Loading.svelte';

  import { useParams } from 'mcrm-svelte-navigator';
  import { ProductsService } from '../../services/products/products.service';
  import { conditionItemSelectorConfig } from '../../../Shared/item-selector-configs';

  const params = useParams();
  const s = new ProductsService();
  let model;
  let loading = false;

  $: skipUuids = cartConditions.map((r) => r.uuid);
  $: cartConditions = model
    ? model.cartCondition.map((item) => ({
        ...item.model,
        order: item?.relationship?.order,
      }))
    : [];

  onMount(async () => {
    model = await s.findOne($params.id, ['cartCondition']);
  });

  async function attachCondition(uuid) {
    await s.manageCartCondition($params.id, uuid, 'attachCondition');
    model = await s.findOne($params.id, ['*']);
  }

  async function unattachCondition(item) {
    await s.manageCartCondition($params.id, item.uuid, 'unattachCondition');
    model = await s.findOne($params.id, ['*']);
  }
</script>

<ItemSelectorModal
  config={conditionItemSelectorConfig}
  {skipUuids}
  on:select={(e) => attachCondition(e.detail.uuid)}
  closeOnSelect={true}
  label="Add conditions"
  selectMode="single"
>
  <Button
    >Add Conditions
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
                class="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                Title
              </th>
              <th
                scope="col"
                class="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                Target
              </th>

              <th
                scope="col"
                class="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                Value
              </th>

              <th
                scope="col"
                class="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                Status
              </th>

              <th
                scope="col"
                class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                Date
              </th>
              <th scope="col" class="relative py-3.5 px-4">
                <span class="sr-only">Edit</span>
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
          {#if cartConditions?.length}
            {#each cartConditions.sort((a, b) => a.order - b.order) as item}
              <tr>
                <td class="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                  <a href="#" on:click|preventDefault={() => navigate(`/catalogue/products/${item.uuid}`)} class="hover:underline">
                    {item.title}
                  </a>
                </td>

                <td class="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                  <a href="#" on:click|preventDefault={() => navigate(`/catalogue/products/${item.uuid}`)} class="hover:underline">
                    {item.target}
                  </a>
                </td>

                <td class="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                  <a href="#" on:click|preventDefault={() => navigate(`/catalogue/products/${item.uuid}`)} class="hover:underline">
                    {item.value}
                  </a>
                </td>

                <td class="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap"
                  >{item.active ? 'Yes' : 'No'}</td
                >

                <td class="px-4 py-4 text-sm whitespace-nowrap">
                  {formatDate(item.createdAt)}
                </td>
                <td class="px-4 py-4 text-sm whitespace-nowrap">
                  <button on:click={() => unattachCondition(item)} class="text-gray-500"><Trash color="white" /></button
                  >
                </td>
              </tr>
            {/each}
          {/if}
        </table>
      </div>
    </div>
  </div>
</div>
