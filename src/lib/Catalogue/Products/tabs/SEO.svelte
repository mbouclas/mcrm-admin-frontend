<script lang="ts">
  import type { IDynamicFieldConfigBlueprint } from "../../../DynamicFields/types";
  import Fields from "../../../DynamicFields/Renderer.svelte";
  import Loading from "../../../Shared/Loading.svelte";
  import Form from "../../../DynamicFields/Form.svelte";
  import {createEventDispatcher} from "svelte";

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
      varName: "og:title",
      label: "og:title",
      placeholder: "og:title",
    },
    {
      type: "text",
      varName: "og:description",
      label: "og:description",
      placeholder: "og:description",
    },
  ];
  // export let fields: IDynamicFieldConfigBlueprint[] = [];
  // let mainFields = [];
  // let secondaryFields = [];
  export let onSubmit: (data: any) => void;

  // console.log(fields);

  // $: {
  //   fields.forEach((field) => {
  //     if (!field.group || field.group === "main") {
  //       mainFields.push(field);
  //     }
  //     if (field.group === "right") {
  //       secondaryFields.push(field);
  //     }
  //   });
  // }


  function handleModelChange(e) {
      model[e.detail.key] = e.detail.value;
      dispatch('change', model);
  }

</script>
<Fields {fields} bind:model module="Product" itemId={model.uuid} on:change={handleModelChange} />
