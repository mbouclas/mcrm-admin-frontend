<script lang="ts">
  import { Tabs, TabItem, Button } from 'flowbite-svelte';
  import General from './tabs/General.svelte';
  import Related from './tabs/Related.svelte';
  import Variants from '../Variants/Variants.svelte';
  import SEO from './tabs/SEO.svelte';
  import Files from './tabs/Files.svelte';

  import { useParams } from 'svelte-navigator';
  import Form from '../../DynamicFields/Form.svelte';
  import { ProductsService } from '../services/products/products.service';
  import { onMount } from 'svelte';
  import { AppService } from '../../Shared/app.service';
  import type { IDynamicFieldConfigBlueprint } from '../../DynamicFields/types';
  import getModelPrototypeFromFields from '../../helpers/model-prototype';

  const s = new ProductsService();
  const params = useParams();
  let model;
  let fields: IDynamicFieldConfigBlueprint[] = [];
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
    fields = AppService.getModel('ProductModel').fields.filter((f) => f.varName !== 'thumb');

    if (itemId) {
      model = await s.findOne(itemId, ['*']);
    } else {
      if ($params.id === 'new') {
        model = getModelPrototypeFromFields(fields);
      } else {
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

    if (!model.seo) {
      model.seo = {
        title: model.title,
        description: model.description,
        keywords: '',
        og_title: '',
        og_description: '',
      };
    }
  });

  const onSubmit = async (data) => {
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
  };

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

  import Gallery from './tabs/Gallery.svelte';
  import { RequestErrorException, handleValidationErrors, clearErrors } from '../../helpers/helperErrors';
  import AdvancedPricing from './tabs/AdvancedPricing.svelte';

  let hasError = false;

  // User selected a new thumbnail, update the model
  function onThumbnailSet(e) {
    model.images.push(model.thumb);
    model.thumb = e.detail;
  }
</script>

<!-- {JSON.stringify(model)} -->

<!-- <Modals /> -->

<Form bind:model {hasError}>
  <Tabs tabStyle="underline" class="mb-4">
    <TabItem open title="General" tabStyle="custom" {customActiveClass} {customInActiveClass}>
      <General {onSubmit} status={productStatus} {fields} {model} />
    </TabItem>
    {#if $params.id !== 'new'}
      <TabItem title="Gallery" tabStyle="custom" {customActiveClass} {customInActiveClass}>
        <Gallery model={model.images} itemId={model.uuid} module="Product" on:thumbnailSet={onThumbnailSet} />
      </TabItem>
      <TabItem title="SEO" tabStyle="custom" {customActiveClass} {customInActiveClass}>
        <SEO onSubmit={onSeoSubmit} model={model.seo} on:change={handleModelChange.bind(this, 'seo')} />
      </TabItem>
      <TabItem title="Files" tabStyle="custom" {customActiveClass} {customInActiveClass}>
        <Files {model} />
      </TabItem>
      <TabItem title="Items" tabStyle="custom" {customActiveClass} {customInActiveClass}>
        <p class="text-sm text-gray-500 dark:text-gray-400">Tab Content 4</p>
      </TabItem>
      <TabItem title="Variants" tabStyle="custom" {customActiveClass} {customInActiveClass}>
        <Variants productId={$params.id} />
      </TabItem>
      <TabItem title="Properties" tabStyle="custom" {customActiveClass} {customInActiveClass}>
        <p class="text-sm text-gray-500 dark:text-gray-400">Tab Content 6</p>
      </TabItem>
      <TabItem title="Related products" tabStyle="custom" {customActiveClass} {customInActiveClass}>
        <Related />
      </TabItem>
      <TabItem title="Advanced pricing" tabStyle="custom" {customActiveClass} {customInActiveClass}>
        <AdvancedPricing />
      </TabItem>
    {/if}
  </Tabs>
</Form>
<div class="mb-12 pb-6" />

<style>
  .submit-button-wrapper {
    line-height: 54px;
    margin-left: auto;
  }
</style>
