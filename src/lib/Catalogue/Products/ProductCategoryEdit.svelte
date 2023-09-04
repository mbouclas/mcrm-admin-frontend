<script lang="ts">
  import Image from '../../DynamicFields/fields/image.svelte';
  import { Input } from 'flowbite-svelte';
  import Fields from '../../DynamicFields/Renderer.svelte';
  import { ProductCategoryService } from '../services/products/product-category.service';
  import { createEventDispatcher, onMount } from 'svelte';
  import type { IDynamicFieldConfigBlueprint } from 'src/lib/DynamicFields/types';

  const dispatch = createEventDispatcher();
  const service = new ProductCategoryService();
  export let uuid: string;

  let category: any;
  let parentCategoryName = 'Root';

  onMount(async () => {
    category = await service.findOne(uuid, ['parent']);

    if (!category.seo) {
      category.seo = {
        title: '',
        description: '',
        keywords: '',
        og_title: '',
        og_description: '',
      };
    }
    if (category.productCategoryParent) {
      parentCategoryName = category.productCategoryParent.title;
    }
  });

  $: {
    dispatch('change', category);
  }

  let fields: IDynamicFieldConfigBlueprint[] = [
    { type: 'text', varName: 'title', label: 'Title', placeholder: 'Title' },
    {
      type: 'text',
      varName: 'description',
      label: 'Description',
      placeholder: 'Description',
    },
    {
      type: 'text',
      varName: 'keywords',
      label: 'Keywords',
      placeholder: 'Keywords',
    },
    {
      type: 'text',
      varName: 'og_title',
      label: 'og_title',
      placeholder: 'og_title',
    },
    {
      type: 'text',
      varName: 'og_description',
      label: 'og_description',
      placeholder: 'og_description',
    },
  ];

  const handleSeoChange = (e) => {
    category['seo'][e.detail.key] = e.detail.value;
  };
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
        module="ProductCategory"
        itemId={category.uuid}
        type="main"
        on:allUploadsComplete={(e) => {
          //category.thumb = e.detail;
        }}
      />
    </div>

    <p class="mt-5 pb-1 font-bold">SEO</p>
    <Fields {fields} model={category?.seo} module="Product" itemId={category.uuid} on:change={handleSeoChange} />
  </div>
{/if}
