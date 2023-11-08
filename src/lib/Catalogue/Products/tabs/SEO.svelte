<script lang="ts">
  import type { IDynamicFieldConfigBlueprint } from '../../../DynamicFields/types';
  import Loading from '../../../Shared/Loading.svelte';
  import {createEventDispatcher, onMount} from 'svelte';
  import {AppService} from "../../../Shared/app.service";
  import CustomFields from "../../../CustomFields/group-field-renderer.svelte";
  import FieldRenderer from "../../../CustomFields/single-field-renderer.svelte";
  import  {ProductModel} from "../../models/product.model";
  import {getModelValueFromFieldSchema, setupModelFromFields} from "../../../helpers/data";
  import {ProductsService} from "../../services/products/products.service";
  import {Button} from "flowbite-svelte";

  export let model: ProductModel = new ProductModel();

  export let onSubmit: (data: any) => void;
  let ready = false;
  const groupFields = AppService.getModel('ProductModel').fieldGroups;
  const allFields = AppService.getModel('ProductModel').fields;
  const fs = groupFields.find((field) => field.name === 'seo');
  let seoFields: IDynamicFieldConfigBlueprint[] = fs.fields.map(f => {
    return allFields.find((field) => field.varName === f);
  });

  onMount(() => {
    if (Object.keys(model.seo).length === 0) {
      model.seo = setupModelFromFields(model.seo, seoFields[0].fields);
    }

    seoFields[0].fields.forEach(field => {
      if (!model.seo[field.varName]) {
        model.seo[field.varName] = getModelValueFromFieldSchema(field, model.seo[field.varName]);
      }
    });


    seoFields[0].fields.forEach(field => {
      if (model.seo[field.varName].length === 0 && field.settings &&  field.settings['bindTo']) {
        model.seo[field.varName] = model[field.settings['bindTo']];
      }
    });

    ready = true;
  });


  let loading = false;
  const dispatch = createEventDispatcher();



  async function save() {
    await new ProductsService().update(model.uuid, model);
  }
</script>

{#if ready}
<form on:submit|preventDefault={save}>
  <CustomFields fields={seoFields[0].fields} let:field={field}  >
    <div class="my-4">
      <FieldRenderer {field} bind:model={model.seo[field['varName']]} outerClass={''} useHeadingsForNestedFields={false} />
    </div>
  </CustomFields>

  <div
          class="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600"
  >
    <div class="grid h-full max-w-lg grid-cols-1 mx-auto font-medium">
      {#if loading}
        <button
                class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
          <Loading />
        </button>
      {:else}
        <Button
                type="submit"
                class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
          <svg
                  class="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
          ><path
                  fill="currentColor"
                  d="M21 7v12q0 .825-.588 1.413T19 21H5q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h12l4 4Zm-9 11q1.25 0 2.125-.875T15 15q0-1.25-.875-2.125T12 12q-1.25 0-2.125.875T9 15q0 1.25.875 2.125T12 18Zm-6-8h9V6H6v4Z"
          /></svg
          >
          <span class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
          >Save</span
          >
        </Button>
      {/if}
    </div>
  </div>
</form>
{/if}


