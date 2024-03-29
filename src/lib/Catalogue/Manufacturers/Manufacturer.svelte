<script lang="ts">
  import { Tabs, TabItem, Button } from 'flowbite-svelte';
  import General from './tabs/General.svelte';
  import SEO from './tabs/SEO.svelte';

  import { useParams } from 'mcrm-svelte-navigator';
  import Form from '../../DynamicFields/Form.svelte';
  import { ManufacturersService } from '../services/manufacturers/manufacturers.service';
  import { onMount } from 'svelte';
  import { AppService } from '../../Shared/app.service';
  import type { IDynamicFieldConfigBlueprint } from '../../DynamicFields/types';
  import getModelPrototypeFromFields from '../../helpers/model-prototype';

  const s = new ManufacturersService();
  const params = useParams();
  let model;
  let fields: IDynamicFieldConfigBlueprint[] = [];
  export let itemId;

  onMount(async () => {
    fields = AppService.getModel('ManufacturerModel').fields.filter((f) => f.varName !== 'thumb');

    if (itemId) {
      model = await s.findOne(itemId, ['product']);
    } else {
      if ($params.id === 'new') {
        model = getModelPrototypeFromFields(fields);
      } else {
        model = await s.findOne($params.id, ['product']);
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
    if ($params.id === 'new') {
      await s.store(data);
      return null;
    }
    await s.update($params.id, data);
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

  let hasError = false;
</script>

<!-- {JSON.stringify(model)} -->

<!-- <Modals /> -->

<Form bind:model {hasError}>
  <Tabs tabStyle="underline" class="mb-4">
    <TabItem open title="General" tabStyle="custom" {customActiveClass} {customInActiveClass}>
      <General {onSubmit} {fields} {model} />
    </TabItem>
    {#if $params.id !== 'new'}
      <TabItem title="SEO" tabStyle="custom" {customActiveClass} {customInActiveClass}>
        <SEO onSubmit={onSeoSubmit} model={model.seo} on:change={handleModelChange.bind(this, 'seo')} />
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
