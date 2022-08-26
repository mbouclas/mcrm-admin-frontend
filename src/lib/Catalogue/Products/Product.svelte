<script lang="ts">
  import { useParams } from "svelte-navigator";
  import Form from "../../DynamicFields/Form.svelte";
  import Fields from "../../DynamicFields/Renderer.svelte";
  import { ProductsService } from "../services/products/products.service";
  import { Datepicker, Label, Helper } from "flowbite-svelte";
  import { onMount } from "svelte";
  import { AppService } from "../../Shared/app.service";
  import type { IDynamicFieldConfigBlueprint } from "../../DynamicFields/types";
  import Loading from "../../Shared/Loading.svelte";
  import getModelPrototypeFromFields from "../../helpers/model-prototype";

  import DateInput from "../../DynamicFields/fields/date-input.svelte";
  import ImagePicker from "../../DynamicFields/fields/image-select.svelte";
  import Select from "../../DynamicFields/fields/select.svelte";

  const s = new ProductsService();
  const params = useParams();
  let model;
  let fields: IDynamicFieldConfigBlueprint[] = [];
  let mainFields = [];
  let secondaryFields = [];

  onMount(async () => {
    fields = AppService.getModel("ProductModel").fields;
    if ($params.id === "new") {
      model = getModelPrototypeFromFields(fields);
    } else {
      model = await s.findOne($params.id, ["*"]);
    }

    fields.forEach((field) => {
      if (!field.group || field.group === "main") {
        mainFields.push(field);
      }
      if (field.group === "right") {
        secondaryFields.push(field);
      }
    });
    // console.log(mainFields);
    console.log(secondaryFields);
  });

  const onSubmit = (data) => {
    console.log("Submit", data);
  };
</script>

{#if !model}<Loading /> {/if}
{#if model}
  <div class="text-white">
    {JSON.stringify(model)}
  </div>
  <Form {onSubmit} withSubmit bind:model>
    <div class="flex">
      <div class="w-full p-2">
        <Fields fields={mainFields} bind:model />
      </div>
      <!-- END BLOCK -->
      <div class="w-full p-2">
        <Fields fields={secondaryFields} bind:model />

        <!-- for the test -->

        <!-- <DateInput bind:model={model.updatedAt} /> -->
        <!-- <Select bind:model /> -->
        <!-- <ImagePicker /> -->
      </div>
      <!-- END BLOCK -->
    </div>
  </Form>
{/if}
