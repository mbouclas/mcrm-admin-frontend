<script lang="ts">
  import type { IDynamicFieldConfigBlueprint } from "../../../DynamicFields/types";
  import Fields from "../../../DynamicFields/Renderer.svelte";
  import Loading from "../../../Shared/Loading.svelte";
  import Form from "../../../DynamicFields/Form.svelte";
  import { createEventDispatcher } from "svelte";

  export let model;
  const dispatch = createEventDispatcher();
  let fields: IDynamicFieldConfigBlueprint[] = [
    { type: "text", varName: "title", label: "Title", placeholder: "Title" },
    {
      type: "text",
      varName: "description",
      label: "Description",
      placeholder: "Description",
    },
    {
      type: "text",
      varName: "keywords",
      label: "Keywords",
      placeholder: "Keywords",
    },
    {
      type: "text",
      varName: "og_title",
      label: "og_title",
      placeholder: "og_title",
    },
    {
      type: "text",
      varName: "og_description",
      label: "og_description",
      placeholder: "og_description",
    },
  ];
  export let onSubmit: (data: any) => void;

  function handleModelChange(e) {
    model[e.detail.key] = e.detail.value;
    dispatch("change", model);
  }
</script>

<Fields
  {fields}
  bind:model
  module="Product"
  itemId={model.uuid}
  on:change={handleModelChange}
/>
