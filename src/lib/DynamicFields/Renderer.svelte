<script lang="ts">
  import RendererRecursive from "./RendererRecursive.svelte";
  import type { IDynamicFieldConfigBlueprint } from "./types";
  import { createEventDispatcher } from "svelte";

  let rootModel = null;

  export let model = null;
  export let module;
  export let itemId;
  export let fields: IDynamicFieldConfigBlueprint[] = [];

  const dispatch = createEventDispatcher();
  function onModelChange(key, value) {
    dispatch("change", { key, value });
    rootModel = model;
    // console.log(typeof value);
  }
</script>

<RendererRecursive
  {onModelChange}
  {fields}
  bind:model
  module="Order"
  itemId={model?.uuid}
/>
