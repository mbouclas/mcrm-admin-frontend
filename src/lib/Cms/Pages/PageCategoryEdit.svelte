<script lang="ts">
  import Image from '../../DynamicFields/fields/image.svelte';
  import { Input } from 'flowbite-svelte';
  import { PageCategoryService } from '../services/pages/page-category.service';
  import { createEventDispatcher, onMount } from 'svelte';

  const dispatch = createEventDispatcher();
  const service = new PageCategoryService();
  export let uuid: string;

  let category: any;
  let parentCategoryName = 'Root';

  onMount(async () => {
    category = await service.findOne(uuid, ['parent']);
    if (category.pageCategoryParent) {
      parentCategoryName = category.pageCategoryParent.title;
    }
  });

  $: {
    dispatch('change', category);
  }
</script>

{#if category}
  <div class="p-4">
    <h2 class="flowbite-modal-title mb-4 text-xl font-bold">Update Category</h2>
    <p class="mb-4"><span>Parent Category: </span><span class="font-semibold">{parentCategoryName}</span></p>

    <div class="mb-4">
      <label for="title" class="block mb-2">Title:</label>
      <Input id="title" bind:value={category.title} required class="w-full" />
    </div>

    <div class="mb-4">
      <label for="description" class="block mb-2">Description:</label>
      <Input id="description" bind:value={category.description} class="w-full" />
    </div>

    <div class="mb-4">
      <Image
        model={category?.thumb || ''}
        title="Category thumbnail"
        maxNumberOfFiles={1}
        module="PageCategory"
        itemId={category.uuid}
        type="main"
        on:allUploadsComplete={(e) => {
          //category.thumb = e.detail;
        }}
      />
    </div>
  </div>
{/if}
