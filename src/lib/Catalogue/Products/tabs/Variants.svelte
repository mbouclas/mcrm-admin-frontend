<script lang="ts">
  import { AppService } from "../../../Shared/app.service";

  import type { IDynamicFieldConfigBlueprint } from "../../../DynamicFields/types";
  import Table from "./table/index.svelte";
  import getModelPrototypeFromFields from "../../../helpers/model-prototype";

  import { onMount } from "svelte";
  import { useParams } from "svelte-navigator";

  export let productId;
  import { VariantsService } from "../../services/variants/variants.service";
  import { Modal, Button } from "flowbite-svelte";

  const s = new VariantsService();
  const params = useParams();
  let model;
  let selectedItem;
  let fields: IDynamicFieldConfigBlueprint[] = [];

  let items = [];

  let deleteModalOpen = false;
  let editModalOpen = false;

  let pagination = {};

  const reloadData = async (currentPagination) => {
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

  const handleAction = (actionType, item) => {
    selectedItem = item;
    if (actionType === "delete") {
      deleteModalOpen = true;
      editModalOpen = false;
    }

    if (actionType === "edit") {
      editModalOpen = true;
      deleteModalOpen = false;
    }
  };

  const handleDeleteConfirm = async () => {
    console.log("DJOLET DELET", selectedItem);
    await s.deleteRow(selectedItem.uuid);
    selectedItem = null;
  };

  const handleDeleteCancel = async () => {
    selectedItem = null;
  };

  onMount(async () => {
    fields = AppService.getModel("ProductVariantModel").fields.filter(
      (f) => f.varName !== "thumb" && !f.hidden
    );

    if (productId) {
      await reloadData({ page: 1, limit: 10 });
    } else {
      model = getModelPrototypeFromFields(fields);
    }
  });
</script>

<Modal
  title="Confirm delete"
  bind:open={deleteModalOpen}
  autoclose
  outsideclose
>
  <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
    Are you sure you want to delet this variant?
  </p>
  <svelte:fragment slot="footer">
    <Button on:click={() => handleDeleteConfirm()}>Confirm</Button>
    <Button on:click={() => handleDeleteCancel()} color="alternative"
      >Cancel</Button
    >
  </svelte:fragment>
</Modal>

<Modal title="Update variant" bind:open={editModalOpen} autoclose outsideclose>
  <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
    Are you sure you want to delet this variant?
  </p>
  <svelte:fragment slot="footer">
    <Button on:click={() => alert('Handle "success"')}>Confirm</Button>
    <Button color="alternative">Cancel</Button>
  </svelte:fragment>
</Modal>

<Table
  bind:fields
  bind:items
  bind:pagination
  on:reload={(e) => reloadData(e.detail.pagination)}
  on:action={(e) => handleAction(e.detail.actionType, e.detail.item)}
/>
