<script lang="ts">
  import { Tabs, TabItem } from 'flowbite-svelte';
  import General from './tabs/General.svelte';
  import Related from './tabs/Related.svelte';
  import Variants from '../Variants/Variants.svelte';
  import SEO from './tabs/SEO.svelte';
  import Files from './tabs/Files.svelte';
  import { useParams } from 'mcrm-svelte-navigator';
  import { ProductsService } from '../services/products/products.service';
  import { onMount } from 'svelte';
  import {ProductModel} from "../models/product.model";
  import Gallery from './tabs/Gallery.svelte';
  import AdvancedPricing from './tabs/AdvancedPricing.svelte';
  import PreviewNavbar from '../../Previews/preview-navbar.svelte';


  const s = new ProductsService();
  const params = useParams();
  let model = new ProductModel();
  let ready = false;
  export let itemId;

  const defaultProductStatus = {
    title: {
      errors: [],
    },
    sku: {
      errors: [],
    },
    price: {
      errors: [],
    },

    description: {
      errors: [],
    },
  };

  let productStatus = defaultProductStatus;

  onMount(async () => {
    if (itemId) {
      model = await s.findOne(itemId, ['*']);
    } else {
      if ($params.id !== 'new') {
        model = await s.findOne($params.id, ['*']);
      }
    }

    if (!model.description) {
      model.description = '';
    }

    if (!model.description_long) {
      model.description_long = '';
    }

    if (!model.thumb) {
      model.thumb = {};
    }

    if (!model.images) {
      model.images = [];
    }

    if (!model.manufacturer) {
      model.manufacturer = {
        key: '',
      };
    }

    if (!model.seo) {
      model.seo = {
        title: model.title,
        description: model.description,
        keywords: '',
        og_title: '',
        og_description: '',
      };
    }

    ready = true;
  });

/*  const onSubmit = async (data) => {
    productStatus = clearErrors(productStatus);

    try {
      if ($params.id === 'new') {
        await s.store(data);
        return null;
      }
      await s.update($params.id, data);
    } catch (e) {
      if (e instanceof RequestErrorException) {
        productStatus = handleValidationErrors(e.details.validationErrors, productStatus);
        return null;
      }
    }
  };*/

  async function onSubmit(product: ProductModel) {

  }

  const onSeoSubmit = async () => {
    await s.update($params.id, model);
  };

  let customActiveClass =
    'inline-block p-4 text-white rounded-t-lg border-b-2 border-white active dark:text-white-500 dark:border-white-500';
  let customInActiveClass =
    'inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300';

  function handleModelChange(key: string, e) {
    model[key] = e.detail;
  }


  let hasError = false;

  // User selected a new thumbnail, update the model
  function onThumbnailSet(e) {
    model.images.push(typeof model.thumb === 'string' ? {url: model.thumb} : model.thumb);
    model.thumb = e.detail;
  }
</script>

<!-- {JSON.stringify(model)} -->

<!-- <Modals /> -->
{#if ready}
  <PreviewNavbar itemId={model.uuid} module="Product" />
<div>
  <Tabs tabStyle="underline" class="mb-4">
    <TabItem open title="General" tabStyle="custom" {customActiveClass} {customInActiveClass}>
      <General {onSubmit} status={productStatus} {model} />
    </TabItem>
    {#if $params.id !== 'new'}
      <TabItem title="Gallery" tabStyle="custom" {customActiveClass} {customInActiveClass}>
        <Gallery model={model.images} itemId={model.uuid} module="Product" on:thumbnailSet={onThumbnailSet} />
      </TabItem>
      <TabItem title="Variants" tabStyle="custom" {customActiveClass} {customInActiveClass}>
        <Variants productId={$params.id} />
      </TabItem>
      <TabItem title="SEO" tabStyle="custom" {customActiveClass} {customInActiveClass}>
        <SEO onSubmit={onSeoSubmit} bind:model={model}  />
      </TabItem>
      <TabItem title="Files" tabStyle="custom" {customActiveClass} {customInActiveClass}>
        <Files {model} />
      </TabItem>
  <!--    <TabItem title="Items" tabStyle="custom" {customActiveClass} {customInActiveClass}>
        <p class="text-sm text-gray-500 dark:text-gray-400">Tab Content 4</p>
      </TabItem>-->

<!--      <TabItem title="Properties" tabStyle="custom" {customActiveClass} {customInActiveClass}>
        <p class="text-sm text-gray-500 dark:text-gray-400">Tab Content 6</p>
      </TabItem>-->
      <TabItem title="Related products" tabStyle="custom" {customActiveClass} {customInActiveClass}>
        <Related />
      </TabItem>
<!--      <TabItem title="Advanced pricing" tabStyle="custom" {customActiveClass} {customInActiveClass}>
        <AdvancedPricing />
      </TabItem>-->
    {/if}
  </Tabs>
</div>
<div class="mb-12 pb-6" />
  {/if}
<style>
  .submit-button-wrapper {
    line-height: 54px;
    margin-left: auto;
  }
</style>
