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
  // import ImagePicker from "../../DynamicFields/fields/image-select.svelte";
  import Select from "../../DynamicFields/fields/select.svelte";
  import Checkbox from "../../DynamicFields/fields/checkbox.svelte";
  import Radio from "../../DynamicFields/fields/radio.svelte";
  import Toggle from "../../DynamicFields/fields/toggle.svelte";

  const s = new ProductsService();
  const params = useParams();
  let model;
  let fields: IDynamicFieldConfigBlueprint[] = [];
  let mainFields = [];
  let secondaryFields = [];
  export let itemId;

  onMount(async () => {
    fields = AppService.getModel("ProductModel").fields;

    if (itemId) {
      model = await s.findOne(itemId, ["*"]);
      model.thumb = {
        url: "https://res.cloudinary.com/businesslink/image/upload/v1662548134/rps/b3eaf906-a112-46c5-aeef-d5c125864b23.png",
      };
    } else {
      if ($params.id === "new") {
        model = getModelPrototypeFromFields(fields);
      } else {
        model = await s.findOne($params.id, ["*"]);
        model.thumb = {
          url: "https://res.cloudinary.com/businesslink/image/upload/v1662548134/rps/b3eaf906-a112-46c5-aeef-d5c125864b23.png",
        };
      }
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
  <!-- <div class="text-white">
    {JSON.stringify(model)}
  </div> -->
  <Form {onSubmit} withSubmit bind:model>
    <div class="block lg:flex">
      <div class="w-full p-2">
        <Fields
          fields={mainFields}
          bind:model
          module="Product"
          itemId={model.uuid}
        />

        <!-- for the test -->

        <!-- <DateInput /> -->
        <!-- <Select bind:model multiple={true} /> -->

        <!-- <Checkbox /> -->
        <!-- <Radio /> -->
        <!-- <Toggle /> -->

        <!-- <ImagePicker /> -->
      </div>
      <!-- END BLOCK -->
      <div class="w-full p-2">
        <Fields
          fields={secondaryFields}
          bind:model
          module="Product"
          itemId={model.uuid}
        />
      </div>
      <!-- END BLOCK -->
    </div>
  </Form>
{/if}
