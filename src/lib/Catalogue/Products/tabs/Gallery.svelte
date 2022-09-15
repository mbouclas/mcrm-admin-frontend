<script lang="ts">
  import { PencilAlt, Trash } from "svelte-heros";
  import { Confirm } from "svelte-confirm";
  import type { IDynamicFieldConfigBlueprint } from "../../../DynamicFields/types";
  import Popup from "./Popup.svelte";

  export let model;
  let show_modal = false;
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
  let imgModel = {
    title: "",
    alt: "",
    description: "",
    caption: "",
  };

  function deleteImage(image) {
    console.log(image);
  }
  const showModal = () => {
    show_modal = true;
  };
  const hideModal = () => {
    show_modal = false;
  };
</script>

{#if show_modal}
  <Popup {hideModal} {showModal} {fields} model={imgModel} />
{/if}
<div class="grid-wrapper">
  {#each model.images as image}
    <div class="grid-item">
      <img src={image.url} alt="" on:click={showModal} />
      <div class="btn-wrapper">
        <button class="image-btn edit-btn"><PencilAlt size="16" /></button>
        <Confirm
          confirmTitle="Delete"
          cancelTitle="Cancel"
          let:confirm={confirmThis}
        >
          <button
            class="image-btn delete-btn"
            on:click={() => confirmThis(deleteImage.bind(this, image))}
            ><Trash size="16" /></button
          >
          <span slot="title"> Are you sure? </span>
          <span slot="description"> You won't be able to revert this! </span>
        </Confirm>
      </div>
    </div>
  {/each}
</div>

<style>
  .grid-wrapper {
    display: grid;
    grid-template-columns: 30% 30% 30%;
    grid-gap: 5%;
  }
  .grid-item {
    border-radius: 5px;
    background: #222736;
    padding: 10px;
  }
  .btn-wrapper {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
  }
  .image-btn {
    color: white;
    padding: 10px;
    background: #2a3042;
    border-radius: 50%;
  }
</style>
