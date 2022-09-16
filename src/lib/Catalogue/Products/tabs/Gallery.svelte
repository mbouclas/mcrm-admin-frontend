<script lang="ts">
  import { PencilAlt, Trash } from "svelte-heros";
  import { Confirm } from "svelte-confirm";
  import type { IDynamicFieldConfigBlueprint } from "../../../DynamicFields/types";
  import ImageSelect from "../../../DynamicFields/fields/image-select/index.svelte";

  import Popup from "./Popup.svelte";

  export let model;
  let imageIndex;
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
  let imgModel;
  let imageSettings = {
    multiple: false,
    accept: "image/*",
    addFromUrl: true,
    selectFromMediaLibrary: true,
    showPreview: true,
    width: 250,
    height: 250,
    defaultCopy: "thumb",
    maxFileSize: 5000,
    quality: 70,
  };

  function deleteImage(image) {
    console.log(image);
  }
  const showModal = (index) => {
    show_modal = true;
    imageIndex = index;
    imgModel = {
      title: "",
      alt: "",
      description: "",
      caption: "",
    };
  };

  const showModalForEdit = (index) => {
    show_modal = true;
    imageIndex = index;
    imgModel = {
      title: model.images[index].title,
      alt: model.images[index].alt,
      description: model.images[index].description,
      caption: model.images[index].caption,
    };
  };
  const hideModal = () => {
    show_modal = false;
  };

  function onSave() {
    hideModal();
    model.images[imageIndex] = { ...model.images[imageIndex], ...imgModel };
  }
</script>

{#if show_modal}
  <Popup {hideModal} {showModal} {onSave} {fields} model={imgModel} />
{/if}
<ImageSelect options={imageSettings} />
<hr class="mt-4" />
<div class="grid-wrapper mt-4">
  {#each model.images as image, index}
    <div class="grid-item">
      <img src={image.url} alt="" on:click={showModal.bind(this, index)} />
      <div class="btn-wrapper">
        <button
          class="image-btn edit-btn"
          on:click={showModalForEdit.bind(this, index)}
          ><PencilAlt size="16" /></button
        >
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
