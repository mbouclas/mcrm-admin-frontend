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

  onMount(async () => {
    console.log("djole", AppService.getModel("ProductVariantModel"));
    fields = AppService.getModel("ProductVariantModel").fields.filter(
      (f) => f.varName !== "thumb" && !f.hidden
    );

    console.log("fields ", fields);
    if (productId) {
      model = await s.find({});
      console.log(model);
    } else {
      model = getModelPrototypeFromFields(fields);
    }
  });
</script>

<Table {fields} items={model?.data} />
