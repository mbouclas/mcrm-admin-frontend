<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from 'flowbite-svelte';
  import { Trash } from 'svelte-heros-v2';
  import {navigate} from "mcrm-svelte-navigator";
  import ItemSelectorModal from '../../../DynamicFields/fields/item-selector-modal.svelte';
  import { formatDate } from '../../../helpers/dates';

  import Loading from '../../../Shared/Loading.svelte';

  import { useParams } from 'mcrm-svelte-navigator';
  import { PagesService } from '../../services/pages/page.service';

  import { pageItemSelectorConfig } from '../../../Shared/item-selector-configs';

  const params = useParams();
  const s = new PagesService();
  let model;
  let loading = false;
  let selectedUuids = [];

  $: skipUuids = model ? [model.uuid, ...model.related.map((r) => r.uuid)] : [];

  onMount(async () => {
    model = await s.findOne($params.id, ['*']);
    console.log(model);
  });

  async function relate() {
    await s.relate($params.id, selectedUuids, 'relate');
    model = await s.findOne($params.id, ['*']);
    selectedUuids = [];
  }

  async function unrelate(item) {
    await s.relate($params.id, [item.uuid], 'unrelate');
    model = await s.findOne($params.id, ['*']);
  }
</script>

<ItemSelectorModal
  config={pageItemSelectorConfig}
  {skipUuids}
  on:confirm={() => relate()}
  on:select={(e) => (selectedUuids = [...selectedUuids, e.detail.uuid])}
  closeOnSelect={false}
  label="Relate Pages"
  selectMode="multiple"
>
  <Button
    >Relate pages
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
              />
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
          {#if model?.related?.length}
            {#each model.related as item}
              <tr>
                <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                  <div class="inline-flex items-center gap-x-3">
                    <a href="#" on:click|preventDefault={() => navigate(`/cms/pages/${item.uuid}`)} class="h-12 w-12">
                      <img src={item.thumb} />
                    </a>
                  </div>
                </td>
                <td class="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                  <a href="#" on:click|preventDefault={() => navigate(`/cms/pages/${item.uuid}`)} class="hover:underline">
                    {item.title}
                  </a>
                </td>

                <td class="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap"
                  >{item.active ? 'Yes' : 'No'}</td
                >

                <td class="px-4 py-4 text-sm whitespace-nowrap">
                  {formatDate(item.createdAt)}
                </td>
                <td class="px-4 py-4 text-sm whitespace-nowrap">
                  <button on:click={() => unrelate(item)} class="text-gray-500"><Trash color="white" /></button>
                </td>
              </tr>
            {/each}
          {/if}
        </table>
      </div>
    </div>
  </div>
</div>
