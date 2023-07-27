<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Fields from "../../../DynamicFields/Renderer.svelte";
  import type {IDynamicFieldConfigBlueprint} from "../../../DynamicFields/types.js";
  const dispatch = createEventDispatcher();
  export let hideModal;
  export let showModal;
  export let onSave;
  let fields: IDynamicFieldConfigBlueprint[] = [
    {
      type: "text",
      varName: "title",
      label: "Title",
      placeholder: "Title",
    },
    {
      type: "text",
      varName: "alt",
      label: "ALT",
      placeholder: "ALT",
    },
    {
      type: "richText",
      varName: "description",
      label: "Description",
      placeholder: "Description",
    },
    {
      type: "text",
      varName: "caption",
      label: "Caption",
      placeholder: "Caption",
    },
  ];
  export let model;

  function handleChange(e) {
    dispatch('change', model)
  }
</script>

<div class="modal">
  <div class="backdrop" on:click={hideModal} />
  <div class="content">
    <h1 class="title">Image Details</h1>

    <Fields
            fields={fields}
            bind:model
            itemId={model.uuid}
            on:change={handleChange}
    />
    <button class="save-btn" on:click={onSave}> S A V E</button>
  </div>
</div>

<style scoped>
  .modal {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .backdrop {
    z-index: 100;
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.829);
  }
  .content {
    padding: 30px;
    position: relative;
    z-index: 101;
    width: 80%;
    /* height: 80%; */
    background-color: #222736;
  }
  .title {
    color: #9ca3af;
    margin-bottom: 20px;
    text-align: center;
  }
  .save-btn {
    display: block;
    width: 100%;
    color: white;
    background: #556ee6;
    padding: 10px;
    border-radius: 3px;
  }
  .save-btn:hover {
    opacity: 0.8;
  }
</style>
