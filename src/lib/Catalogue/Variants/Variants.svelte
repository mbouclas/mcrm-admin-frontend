<script lang="ts">
  import { AppService } from '../../Shared/app.service';

  import type { IDynamicFieldConfigBlueprint } from '../../DynamicFields/types';
  import Fields from '../../DynamicFields/Renderer.svelte';

  import getModelPrototypeFromFields from '../../helpers/model-prototype';

  import { onMount } from 'svelte';
  import { useParams } from 'svelte-navigator';

  export let productId;
  import { VariantsService } from '../services/variants/variants.service';
  import { PropertiesService } from '../services/properties/properties.service';
  import { ProductsService } from '../services/products/products.service';
  import {
    Modal,
    Button,
    Table as TableFlowBite,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from 'flowbite-svelte';
  import Table from './VariantsTable.svelte';
  import GenerateVariants from './GenerateVariants.svelte';

  const s = new VariantsService();
  const productService = new ProductsService();
  const p = new PropertiesService();
  const params = useParams();

  $: console.log('params ', $params);
  let selectedValues = [];
  let model;
  let selectedItem;
  let propertyValues = [];
  let fields: IDynamicFieldConfigBlueprint[] = [];

  let items = [];

  let createModalOpen = false;
  let deleteModalOpen = false;
  let editModalOpen = false;
  let generateVariantsModelOpen = false;

  let pagination = {};

  const reloadData = async (currentPagination) => {
    selectedItem = {};
    if (productId) {
      model = await s.find({
        page: currentPagination.page,
        limit: currentPagination.limit,
      });
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
  };

  const handleGenerateVariants = async () => {
    await productService.generateVariants($params.id, { propertyValues: selectedValues.map((value) => value.uuid) });

    reloadData({ page: 1, limit: 10 });
  };

  const handleConfirm = async ({ value, action }) => {
    if (action === 'delete') {
      await s.deleteRow(value.uuid);
    }

    if (action === 'edit') {
      await s.update(value.uuid, value);
    }

    reloadData({ page: 1, limit: 10 });
  };

  onMount(async () => {
    fields = AppService.getModel('ProductVariantModel').fields.filter((f) => f.varName !== 'thumb' && !f.hidden);

    if (productId) {
      await reloadData({ page: 1, limit: 10 });
    } else {
      model = getModelPrototypeFromFields(fields);
    }
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

  $: console.log(propertyValues);
</script>

<Modal title="Confirm delete" bind:open={deleteModalOpen} autoclose outsideclose>
  <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">Are you sure you want to delete this item?</p>
  <svelte:fragment slot="footer">
    <Button on:click={() => handleConfirm({ value: selectedItem, action: 'delete' })}>Confirm</Button>
    <Button on:click={() => handleModalCancel()} color="alternative">Cancel</Button>
  </svelte:fragment>
</Modal>

<Modal size="xl" title="Update item" bind:open={editModalOpen} autoclose outsideclose>
  <Fields {reloadData} {fields} bind:model={selectedItem} module="Product" itemId={selectedItem?.uuid || ''} />

  {#if propertyValues && propertyValues.length}
    <TableFlowBite>
      <TableHead>
        <TableHeadCell>Property</TableHeadCell>
        <TableHeadCell>Value</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each propertyValues as propertyValue}
          <TableBodyRow>
            <TableBodyCell>{propertyValue.property.title}</TableBodyCell>
            <TableBodyCell>{propertyValue.name}</TableBodyCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    </TableFlowBite>
  {/if}

  <svelte:fragment slot="footer">
    <Button on:click={() => handleConfirm({ value: selectedItem, action: 'edit' })}>Confirm</Button>
    <Button on:click={() => handleModalCancel()} color="alternative">Cancel</Button>
  </svelte:fragment>
</Modal>

<Modal size="xl" title="Generate variants" bind:open={generateVariantsModelOpen} autoclose outsideclose>
  <GenerateVariants bind:selectedValues />

  <svelte:fragment slot="footer">
    <Button on:click={() => handleGenerateVariants()}>Confirm</Button>
    <Button on:click={() => handleModalCancel()} color="alternative">Cancel</Button>
  </svelte:fragment>
</Modal>

<Button on:click={() => handleAction('generateVariants')}>Generate variants</Button>

<Table
  bind:fields
  bind:items
  bind:pagination
  on:reload={(e) => reloadData(e.detail.pagination)}
  on:action={(e) => handleAction(e.detail.actionType, e.detail.item)}
/>
