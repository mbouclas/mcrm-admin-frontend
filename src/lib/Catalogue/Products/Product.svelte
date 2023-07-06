<script lang="ts">
  import { Tabs, TabItem, Button } from 'flowbite-svelte';
  import General from './tabs/General.svelte';
  import Variants from '../Variants/Variants.svelte';
  import SEO from './tabs/SEO.svelte';
  import Files from './tabs/Files.svelte';

  import { useParams } from 'svelte-navigator';
  import Form from '../../DynamicFields/Form.svelte';
  import { ProductsService } from '../services/products/products.service';
  import { Datepicker, Label, Helper } from 'flowbite-svelte';
  import { onMount } from 'svelte';
  import { AppService } from '../../Shared/app.service';
  import type { IDynamicFieldConfigBlueprint } from '../../DynamicFields/types';
  import getModelPrototypeFromFields from '../../helpers/model-prototype';

  const s = new ProductsService();
  const params = useParams();
  let model;
  let fields: IDynamicFieldConfigBlueprint[] = [];
  export let itemId;

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
    if ($params.id === 'new') {
      await s.store(data);
      return null;
    }
    await s.update($params.id, data);
  };

  let contentDivClass = 'p-4 bg-[#2a3042] rounded-lg dark:bg-gray-800';
  let customActiveClass =
    'inline-block p-4 text-white rounded-t-lg border-b-2 border-white active dark:text-white-500 dark:border-white-500';
  let customInActiveClass =
    'inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300';

  //We need this to reflect model changes that are not passed down the event bubble
  function handleModelChange(key: string, e) {
    model[key] = e.detail;
  }

  import isEmpty from '../../helpers/isEmpty';
  import Gallery from './tabs/Gallery.svelte';

  let errors = {};
  let hasError = false;

  function validateModel() {
    Object.keys(model).map((key) => {
      if (isEmpty(model[key])) {
        hasError = true;
        errors[key] = true;
      } else {
        errors[key] = false;
      }
    });

    return !hasError;
  }

  function onNativeSubmit(e) {
    e.preventDefault();
    //if (e.currentTarget.checkValidity() && onSubmit && validateModel()) {
    onSubmit(model);
    //}
  }
</script>

<!-- {JSON.stringify(model)} -->

<!-- <Modals /> -->

<Form bind:model {hasError}>
  <Tabs tabStyle="underline" class="mb-4">
    <TabItem open title="General" tabStyle="custom" {customActiveClass} {customInActiveClass}>
      <General {fields} {model} />
    </TabItem>
    <TabItem title="Gallery" tabStyle="custom" {customActiveClass} {customInActiveClass}>
      <Gallery model={model.images} />
    </TabItem>
    <TabItem title="SEO" tabStyle="custom" {customActiveClass} {customInActiveClass}>
      <SEO model={model.seo} on:change={handleModelChange.bind(this, 'seo')} />
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
  </Tabs>
</Form>
<div class="mb-12 pb-6"></div>
<style>
  .submit-button-wrapper {
    line-height: 54px;
    margin-left: auto;
  }
</style>
