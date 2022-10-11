<script lang="ts">
  import { PencilAlt, Trash } from "svelte-heros";
  import { Confirm } from "svelte-confirm";
  import type { IDynamicFieldConfigBlueprint } from "../../../DynamicFields/types";
  import ImageSelect from "../../../DynamicFields/fields/image-select/index.svelte";

  import Popup from "./Popup.svelte";

  export let model = [];
  let imageIndex;
  let show_modal = false;

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
    imgModel = model[index];
  };

  const showModalForEdit = (index) => {
    show_modal = true;
    imgModel = model[index];
  };
  const hideModal = () => {
    show_modal = false;
  };

  function onSave() {
    hideModal();
    model[imageIndex] = { ...model[imageIndex], ...imgModel };
  }

  /**
   * Will update the images model when something changes on the popup
   * @param e
   */
  function handleModalModelChange(e) {
    const foundIndex = model.findIndex(item => item.uuid === e.detail.uuid);
    model[foundIndex] = e.detail;
  }
</script>

{#if show_modal}
  <Popup {hideModal} {showModal} {onSave}  model={imgModel} on:change={handleModalModelChange} />
{/if}
{JSON.stringify(model)}
<ImageSelect options={imageSettings} />
<hr class="mt-4" />
<div class="grid-wrapper mt-4">
  {#each model as image, index}
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
