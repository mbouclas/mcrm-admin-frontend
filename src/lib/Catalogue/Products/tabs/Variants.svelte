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

  onMount(async () => {
    fields = AppService.getModel("ProductVariantModel").fields.filter(
      (f) => f.varName !== "thumb" && !f.hidden
    );

    console.log("fields ", fields);
    if (productId) {
      model = await s.find({});
      console.log(model);
      items = model?.data;
      pagination = {
        total: model.total,
        skip: model.skip,
        limit: model.limit,
        page: model.page,
      };
    } else {
      model = getModelPrototypeFromFields(fields);
    }
  });
</script>

<Table bind:fields bind:items bind:pagination />
