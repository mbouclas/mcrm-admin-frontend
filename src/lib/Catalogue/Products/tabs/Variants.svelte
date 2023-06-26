<script lang="ts">
  import { AppService } from '../../../Shared/app.service';

  import type { IDynamicFieldConfigBlueprint } from '../../../DynamicFields/types';
  import Fields from '../../../DynamicFields/Renderer.svelte';

  import Table from './table/index.svelte';
  import getModelPrototypeFromFields from '../../../helpers/model-prototype';

  import { onMount } from 'svelte';
  import { useParams } from 'svelte-navigator';

  export let productId;
  import { VariantsService } from '../../services/variants/variants.service';
  import { Modal, Button } from 'flowbite-svelte';

  const s = new VariantsService();
  const params = useParams();
  let model;
  let selectedItem;
  let fields: IDynamicFieldConfigBlueprint[] = [];

  let items = [];

  let createModalOpen = false;
  let deleteModalOpen = false;
  let editModalOpen = false;

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

  const handleAction = (actionType, item) => {
    selectedItem = item;

    if (actionType === 'create') {
      createModalOpen = true;
      deleteModalOpen = false;
      editModalOpen = false;
    }

    if (actionType === 'delete') {
      deleteModalOpen = true;
      editModalOpen = false;
      createModalOpen = false;
    }

    if (actionType === 'edit') {
      editModalOpen = true;
      deleteModalOpen = false;
      createModalOpen = false;
    }
  };

  const handleModalCancel = () => {
    selectedItem = {};
  };
</script>

<Modal title="Confirm delete" bind:open={deleteModalOpen} autoclose outsideclose>
  <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">Are you sure you want to delete this item?</p>
  <svelte:fragment slot="footer">
    <Button on:click={() => handleConfirm({ value: selectedItem, action: 'delete' })}>Confirm</Button>
    <Button on:click={() => handleModalCancel()} color="alternative">Cancel</Button>
  </svelte:fragment>
</Modal>

<Modal title="Update item" bind:open={editModalOpen} autoclose outsideclose>
  <Fields {reloadData} {fields} bind:model={selectedItem} module="Product" itemId={selectedItem?.uuid || ''} />

  <svelte:fragment slot="footer">
    <Button on:click={() => handleConfirm({ value: selectedItem, action: 'edit' })}>Confirm</Button>
    <Button on:click={() => handleModalCancel()} color="alternative">Cancel</Button>
  </svelte:fragment>
</Modal>

<Table
  bind:fields
  bind:items
  bind:pagination
  on:reload={(e) => reloadData(e.detail.pagination)}
  on:action={(e) => handleAction(e.detail.actionType, e.detail.item)}
/>
