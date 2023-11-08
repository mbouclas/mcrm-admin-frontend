<script lang="ts">
  import { AppService } from '../../Shared/app.service';

  import type { IDynamicFieldConfigBlueprint } from '../../DynamicFields/types';
  import Fields from '../../DynamicFields/Renderer.svelte';

  import getModelPrototypeFromFields from '../../helpers/model-prototype';

  import { onMount } from 'svelte';
  import { useParams } from 'mcrm-svelte-navigator';

  export let productId;
  import { VariantsService } from '../services/variants/variants.service';
  import { PropertiesService } from '../services/properties/properties.service';
  import { ProductsService } from '../services/products/products.service';
  import {
    Modal,
    Button,
  } from 'flowbite-svelte';
  import Table from './VariantsTable.svelte';
  import GenerateVariants from './GenerateVariants.svelte';
  import {Plus} from "svelte-heros-v2";
  import type {IEvent, IPagination} from "../../Shared/models/generic";
  import Loading from "../../Shared/Loading.svelte";

  const s = new VariantsService();
  const productService = new ProductsService();
  const p = new PropertiesService();
  const params = useParams();


  let generatingInProgress = false;
  let selectedValues = [];
  let duplicateVariants;
  let model;
  let selectedItem;
  let propertyValues = [];
  let fields: IDynamicFieldConfigBlueprint[] = [];
  let loading = false;
  let items = [];
  let ready = false;
  let createModalOpen = false;
  let deleteModalOpen = false;
  let editModalOpen = false;
  let generateVariantsModelOpen = false;
  let limit = 30;

  let pagination = {};

  const reloadData = async (currentPagination, filters = {}) => {
    loading = true;
    selectedItem = {};
    if (productId) {
      model = await s.find({
        page: currentPagination.page,
        limit: currentPagination.limit,
        product: [$params.id],
        ...filters
      }, ['*']);
      items = model?.data;
      pagination = {
        total: parseInt(model.total),
        totalPages: parseInt(model.pages),
        skip: parseInt(model.skip),
        limit: parseInt(model.limit),
        page: parseInt(model.page),
      };
    } else {
      model = getModelPrototypeFromFields(fields);
    }
    setTimeout(() => {
      loading = false;
    }, 1000);

  };

  async function search(data: { pagination: any, searchTerm: string }) {
    await reloadData(data.pagination, { q: data.searchTerm });
  }

  const handleGenerateVariants = async () => {

    const propertyValues = selectedValues.map((value) => value.uuid);

    if (duplicateVariants && duplicateVariants.length) {
      const duplicateVariantsParsed = duplicateVariants.reduce((acc, cur) => {
        acc[cur.name] = cur.delete;
        return acc;
      }, {});
      await productService.generateVariants($params.id, { propertyValues, duplicateVariants: duplicateVariantsParsed });
      reloadData({ page: 1, limit });
      generateVariantsModelOpen = false;
      duplicateVariants = [];
      selectedValues = [];
      return null;
    }

    const res = await productService.checkDuplicateVariants($params.id, {
      propertyValues,
    });

    if (res.duplicateVariantNames.length) {
      duplicateVariants = res.duplicateVariantNames.map((name) => ({
        name,
        delete: false,
      }));
      return null;
    }

    generatingInProgress = true;
    await productService.generateVariants($params.id, { propertyValues, duplicateVariants: {} });
    reloadData({ page: 1, limit });
    generateVariantsModelOpen = false;
    duplicateVariants = [];
    selectedValues = [];
    generatingInProgress = false;
  };

  onMount(async () => {
    fields = AppService.getModel('ProductVariantModel').fields.filter((f) => f.varName !== 'thumb' && !f.hidden);

    if (productId) {
      await reloadData({ page: 1, limit });
    } else {
      model = getModelPrototypeFromFields(fields);
    }

    ready = true;
  });

  const handleAction = async (actionType, item = null) => {
    selectedItem = item;

    if (actionType === 'create') {
      createModalOpen = true;
      deleteModalOpen = false;
      editModalOpen = false;
      generateVariantsModelOpen = false;
    }

    if (actionType === 'delete') {
      deleteModalOpen = true;
      editModalOpen = false;
      createModalOpen = false;
      generateVariantsModelOpen = false;
    }

    if (actionType === 'edit') {
      editModalOpen = true;
      deleteModalOpen = false;
      createModalOpen = false;
      generateVariantsModelOpen = false;
      propertyValues = await p.findValueByVariantId(item.uuid);
    }

    if (actionType === 'generateVariants') {
      generateVariantsModelOpen = true;
      editModalOpen = false;
      deleteModalOpen = false;
      createModalOpen = false;
    }
  };

  const handleModalCancel = () => {
    selectedItem = {};
    propertyValues = [];
  };


</script>
<Modal size="sm" bind:open={generatingInProgress} title="Generating Variants"
       dialogClass="fixed top-0 left-0 right-0 h-modal md:inset-0 md:h-full  w-full p-4 flex z-[99999]">
  <div class="flex items-center justify-center">
    <Loading>Please wait...</Loading>
  </div>
</Modal>



<Modal size="xl" title="Generate variants" bind:open={generateVariantsModelOpen} outsideclose>
  <GenerateVariants bind:duplicateVariants bind:selectedValues />

  <Button on:click={() => handleGenerateVariants()} color="green">Add Selected</Button>
  <Button on:click={() => handleModalCancel()} color="red">Cancel</Button>
</Modal>


{#if ready}
<Table
  bind:fields
  bind:items
  bind:pagination
  bind:loading={loading}
  on:reload={(e) => reloadData(e.detail)}
  onSearch={search}
  on:action={(e) => handleAction(e.detail.actionType, e.detail.item)}>
  <svelte:fragment slot="actions">
      <Button on:click={() => handleAction('generateVariants')} color="green" class="gap-2.5"><Plus /> Generate variants</Button>
  </svelte:fragment>
</Table>
  {/if}
