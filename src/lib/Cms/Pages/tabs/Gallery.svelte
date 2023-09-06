<script context="module">
  import Sortable, { MultiDrag, Swap } from 'sortablejs';
</script>

<script lang="ts">
  import { PencilSquare, Trash, Bars3 } from 'svelte-heros-v2';

  import Popup from './Popup.svelte';
  import type { IEvent } from '../../../Shared/models/generic';
  import type { SuccessResponse, UploadResult, UppyFile } from '@uppy/core';
  import FileUploader from '../../../Shared/file-uploader.svelte';
  import { ImageService } from '../../../Shared/services/image.service';
  import { setNotificationAction } from '../../../stores';
  import { createEventDispatcher } from 'svelte';

  const uploadIdPrefix = 'upload-';
  export let model = [];
  export let itemId;
  export let module;
  let imageIndex;
  let show_modal = false;
  let uploader = {};
  let type = 'image';
  let imgModel;
  let temp = model;
  const dispatch = createEventDispatcher();

  const metaData = {
    id: itemId,
    module,
    type,
  };

  async function deleteImage(image) {
    const r = confirm('Are you sure you want to delete this image?');
    if (!r) {
      return;
    }

    await new ImageService().deleteImage(image.uuid);
    const foundIndex = model.findIndex((item) => item.uuid === image.uuid);

    temp.splice(foundIndex, 1);
    model = temp;

    setNotificationAction({
      message: 'Image deleted successfully',
      type: 'success',
    });
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

  async function onSave(updatedModel) {
    const foundIndex = model.findIndex((item) => item.uuid === updatedModel.uuid);
    model[foundIndex] = updatedModel;
    hideModal();
    await new ImageService().updateImageDetails(updatedModel.uuid, updatedModel, module, itemId);

    setNotificationAction({
      message: 'Image details updated successfully',
      type: 'success',
    });
  }

  /**
   * Will update the images model when something changes on the popup
   * @param e
   */
  function handleModalModelChange(e) {
    const foundIndex = model.findIndex((item) => item.uuid === e.detail.uuid);
    model[foundIndex] = e.detail;
  }

  function uploadComplete(
    e: IEvent<{
      id: string;
      file: UppyFile<Record<string, unknown>, Record<string, unknown>>;
      response: SuccessResponse;
    }>,
  ) {
    const idx = parseInt(e.detail.id.replace(uploadIdPrefix, ''));

    if (!Array.isArray(model)) {
      temp = Object.assign({}, model);
      temp = e.detail.response.body[0];

      setNotificationAction({
        message: 'Image uploaded successfully',
        type: 'success',
      });

      model = temp;
      return;
    }

    temp = Object.assign([], model);
    e.detail.response.body.forEach((item) => {
      const found = temp.find((i) => i.uuid === item.uuid);
      if (found) {
        return;
      }

      temp.push(item);
    });

    model = temp;

    setNotificationAction({
      message: 'Image uploaded successfully',
      type: 'success',
    });
  }

  function onAllUploadsComplete(e: IEvent<{ id: string; res: UploadResult<Record<string, unknown>> }>) {
    const uploadedFiles = e.detail.res.successful;
    // model = Object.assign([], temp);
    // temp = [];
  }

  function onUploadFailed(e: IEvent<{ id: string; res: UploadResult<Record<string, unknown>> }>) {
    const failure = e.detail.res.failed;
  }

  setTimeout(() => {
    addSortable();
  }, 1000);

  function addSortable() {
    const el = document.getElementById('gallery');

    const s = new Sortable(el, {
      animation: 150,
      handle: '.handle',
      dataIdAttr: 'data-id',
      ghostClass: 'blue-background-class',
      onEnd: async function (/**Event*/ evt) {
        const temp = s.toArray().map((id) => {
          return model.find((item) => item.uuid === id);
        });

        temp.forEach((item, index) => {
          const idx = model.findIndex((i) => i.uuid === item.uuid);
          model[idx].order = index;
        });

        await new ImageService().updateImagesOrder(temp, module, itemId);

        //required to allow the DOM to render
        model = [];
        setTimeout(() => {
          model = temp;

          setNotificationAction({
            message: 'Saved successfully',
            type: 'success',
          });
        });
        //
      },
    });
  }

  async function setAsThumbnail(image) {
    const r = confirm('Are you sure you want to set this image as the thumbnail?');
    if (!r) {
      return;
    }

    await new ImageService().setImageAsMain(image.uuid, module, itemId);
    const foundIndex = model.findIndex((item) => item.uuid === image.uuid);

    model.splice(foundIndex, 1);

    dispatch('thumbnailSet', image);

    setNotificationAction({
      message: 'Thumb assigned successfully',
      type: 'success',
    });
  }
</script>

{#if imgModel}
  <Popup bind:showModal={show_modal} {onSave} model={imgModel} on:change={handleModalModelChange} />
{/if}

<div class="fixed bottom-0 left-0 z-50 w-full flex items-center justify-center">
  <FileUploader
    id="page-upload-button"
    on:uploadComplete={uploadComplete}
    on:allUploadsComplete={onAllUploadsComplete}
    on:uploadFailed={onUploadFailed}
    bind:this={uploader}
    allowedFileTypes={['.jpg', '.jpeg', '.png', '.webp']}
    maxNumberOfFiles={50}
    meta={metaData}
    webCamModes={['picture']}
    uploaders={['webcam']}
    buttonTitle="Upload photo"
  >
    <div class="w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
      <div class="grid h-full max-w-lg grid-cols-2 mx-auto font-medium">
        <button
          id="page-upload-button"
          type="button"
          class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
          <svg
            class="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 256 256"
          >
            <path
              fill="currentColor"
              d="M222 152v56a14 14 0 0 1-14 14H48a14 14 0 0 1-14-14v-56a6 6 0 0 1 12 0v56a2 2 0 0 0 2 2h160a2 2 0 0 0 2-2v-56a6 6 0 0 1 12 0ZM92.24 84.24L122 54.49V152a6 6 0 0 0 12 0V54.49l29.76 29.75a6 6 0 0 0 8.48-8.48l-40-40a6 6 0 0 0-8.48 0l-40 40a6 6 0 0 0 8.48 8.48Z"
            />
          </svg>
          <span
            class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
            >Upload</span
          >
        </button>
        <button
          type="button"
          class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
          <svg
            class="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M3 19q-.825 0-1.413-.588T1 17V7q0-.825.588-1.413T3 5h10q.825 0 1.413.588T15 7v10q0 .825-.588 1.413T13 19H3Zm15-8q-.425 0-.713-.288T17 10V6q0-.425.288-.713T18 5h4q.425 0 .713.288T23 6v4q0 .425-.288.713T22 11h-4ZM4 15h8l-2.625-3.5L7.5 14l-1.375-1.825L4 15Zm14 4q-.425 0-.713-.288T17 18v-4q0-.425.288-.713T18 13h4q.425 0 .713.288T23 14v4q0 .425-.288.713T22 19h-4Z"
            />
          </svg>
          <span
            class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
            >Library</span
          >
        </button>
      </div>
    </div>
  </FileUploader>
</div>

<ul
  id="gallery"
  role="list"
  class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
>
  {#each model as image, index}
    <li class="relative group" data-id={image.uuid}>
      <div
        class=" aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100"
      >
        <img src={image.url} alt="" title={image.uuid} class="object-cover group-hover:opacity-75" />
        {#if image.title}
          <p class="text-center py-2 text-gray-400 h-12 bg-black/70">{image.title || ''}</p>
        {/if}
        <div class="flex w-full h-full">
          <div
            class="absolute items-center right-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 focus:outline-none"
          >
            <div class="flex items-center justify-center space-x-4">
              <button type="button" title="move image" class="image-btn handle">
                <Bars3 size="16" />
              </button>
              <button class="image-btn edit-btn" on:click={showModalForEdit.bind(this, index)}>
                <PencilSquare size="16" />
              </button>

              <button class="image-btn delete-btn" on:click={deleteImage.bind(this, image)}>
                <Trash size="16" />
              </button>
              <button title="Set as Thumbnail" class="image-btn delete-btn" on:click={setAsThumbnail.bind(this, image)}>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M3 19q-.825 0-1.413-.588T1 17V7q0-.825.588-1.413T3 5h10q.825 0 1.413.588T15 7v10q0 .825-.588 1.413T13 19H3Zm15-8q-.425 0-.713-.288T17 10V6q0-.425.288-.713T18 5h4q.425 0 .713.288T23 6v4q0 .425-.288.713T22 11h-4Zm1-2h2V7h-2v2ZM3 17h10V7H3v10Zm1-2h8l-2.625-3.5L7.5 14l-1.375-1.825L4 15Zm14 4q-.425 0-.713-.288T17 18v-4q0-.425.288-.713T18 13h4q.425 0 .713.288T23 14v4q0 .425-.288.713T22 19h-4Zm1-2h2v-2h-2v2ZM3 17V7v10Zm16-8V7v2Zm0 8v-2v2Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  {/each}
</ul>

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

  .blue-background-class {
    background-color: #c8ebfb;
  }

  .handle {
    cursor: grab;
  }
</style>
