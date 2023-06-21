<script lang="ts">
  import { AppService } from "../../../Shared/app.service";

  import type { IDynamicFieldConfigBlueprint } from "../../../DynamicFields/types";
  import Table from "./table/index.svelte";
  import getModelPrototypeFromFields from "../../../helpers/model-prototype";

  import { onMount } from "svelte";
  import { useParams } from "svelte-navigator";

  export let productId;
  import { VariantsService } from "../../services/variants/variants.service";

  const s = new VariantsService();
  const params = useParams();
  let model;
  let fields: IDynamicFieldConfigBlueprint[] = [];

  let items = [];
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

<Table
  bind:fields
  bind:items
  bind:pagination
  on:reload={(e) => reloadData(e.detail.pagination)}
/>
