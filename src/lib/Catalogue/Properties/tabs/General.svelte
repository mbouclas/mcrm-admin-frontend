<script lang="ts">
  import type { IDynamicFieldConfigBlueprint } from "../../../DynamicFields/types";
  import Fields from "../../../DynamicFields/Renderer.svelte";
  import Loading from "../../../Shared/Loading.svelte";
  import Form from "../../../DynamicFields/Form.svelte";

  export let fields: IDynamicFieldConfigBlueprint[] = [];
  export let model;
  let mainFields = [];
  let secondaryFields = [];
  let bottomFields = [];
  // export let onSubmit: (data: any) => void;

  $: {
    fields.forEach((field) => {
      if (!field.group || field.group === "main") {
        mainFields.push(field);
      }
      if (field.group === "right") {
        secondaryFields.push(field);
      }

      if (field.group === "bottom") {
        bottomFields.push(field);
      }
    });
  }
</script>

{#if !model}<Loading /> {/if}
{#if model}
  <div class="block lg:flex">
    <div class="w-full p-2">
      <Fields
        fields={mainFields}
        bind:model
        module="Property"
        itemId={model.uuid}
      />
    </div>
    <!-- END BLOCK -->
    <div class="w-full p-2">
      <Fields
        fields={secondaryFields}
        bind:model
        module="Property"
        itemId={model.uuid}
      />
    </div>
    <!-- END BLOCK -->
  </div>

  <div class="block lg:flex">
    <div class="w-full p-2">
      <Fields
        fields={bottomFields}
        bind:model
        module="Property"
        itemId={model.uuid}
      />
    </div>
  </div>
{/if}
