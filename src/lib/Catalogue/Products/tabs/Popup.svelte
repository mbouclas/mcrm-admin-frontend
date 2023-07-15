<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type {IDynamicFieldConfigBlueprint} from "../../../DynamicFields/types.js";
  import Input from "../../../DynamicFields/fields/input.svelte";
  import TextArea from "../../../DynamicFields/fields/textarea.svelte";
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
      required: false,
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
      required: false,
    },
    {
      type: "text",
      varName: "caption",
      label: "Caption",
      placeholder: "Caption",
      required: false,
    },
  ];
  export let model;

  function handleChange(e) {
    dispatch('change', model)
  }

  $: {
    if (showModal) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }

  function toggle() {
    showModal = !showModal;

    dispatch('close');
  }
  function getField(name: string) {
    return fields.find((field) => field.varName === name);
  }
</script>
{#if showModal}
<div class="modal z-[999]">
  <div class="backdrop" on:click={toggle} />
  <div class="content">
    <h1 class="title">Image Details</h1>
    <form action="" on:submit|preventDefault={onSave.bind(this, model)}>
    <Input  bind:model={model.title} placeholder="Title" label="Title"  field={getField('title')} />
    <Input  bind:model={model.alt} placeholder="Alt" label="Alt"  field={getField('alt')} />
    <TextArea  bind:model={model.description} placeholder="Description" label="Description"  field={getField('description')} />
    <TextArea  bind:model={model.caption} placeholder="Caption" label="Caption"  field={getField('caption')} />

    <button class="save-btn" type="submit">Save</button>
    </form>
  </div>
</div>
  {/if}
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
