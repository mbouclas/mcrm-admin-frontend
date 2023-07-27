<script lang="ts">
  import FileUploader from '../../Shared/file-uploader.svelte';
  import type { IEvent, IGenericObject } from '../../Shared/models/generic';
  import type { SuccessResponse, UploadResult, UppyFile } from '@uppy/core';
  const uploadIdPrefix = 'upload-';
  export let model;
  export let itemId;
  export let module = 'Product';
  export let title = 'Image';
  export let metaData: IGenericObject = {};
  export let id = 'image';
  export let type: 'main' | 'image' = 'main';
  export let maxNumberOfFiles = 1;
  let show_modal = false;
  import { createEventDispatcher } from 'svelte';
  import Popup from '../../Catalogue/Products/tabs/Popup.svelte';
  import { ImageService } from '../../Shared/services/image.service';
  import { setNotificationAction } from '../../stores';
  const dispatch = createEventDispatcher();

  let uploader = {};

  if (Object.keys(metaData).length === 0) {
    metaData = {
      id: itemId,
      module,
      type,
    };
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
      model = e.detail.response.body[0];
      dispatch('uploadComplete', model);
      return;
    }

    model[idx] = e.detail.response.body[0];
    dispatch('uploadComplete', model);
  }

  function onAllUploadsComplete(e: IEvent<{ id: string; res: UploadResult<Record<string, unknown>> }>) {
    const uploadedFiles = e.detail.res.successful;
    dispatch('allUploadsComplete', model);
  }

  function onUploadFailed(e: IEvent<{ id: string; res: UploadResult<Record<string, unknown>> }>) {
    const failure = e.detail.res.failed;
  }

  async function onSave(updatedModel) {
    // const foundIndex = model.findIndex((item) => item.uuid === updatedModel.uuid);
    // model[foundIndex] = updatedModel;
    // hideModal();
    await new ImageService().updateImageDetails(updatedModel.uuid, updatedModel, module, itemId);

    setNotificationAction({
      message: 'Image details updated successfully',
      type: 'success',
    });
    show_modal = false;
  }

  function handleModalModelChange(e) {
    model = e.detail;
  }

  function edit() {
    show_modal = !show_modal;
  }
</script>

<Popup bind:showModal={show_modal} {onSave} {model} on:change={handleModalModelChange} />
<div class="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
  <div class="pt-4 items-center text-center">
    <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{title}</h5>
  </div>
  <img class="p-8 rounded-t-lg" src={model.url} />

  <div class=" items-center text-center">
    <div class="flex items-center justify-center">
      <FileUploader
        id="product-upload-button"
        on:uploadComplete={uploadComplete}
        on:allUploadsComplete={onAllUploadsComplete}
        on:uploadFailed={onUploadFailed}
        bind:this={uploader}
        allowedFileTypes={['.jpg', '.jpeg', '.png', '.webp']}
        {maxNumberOfFiles}
        meta={metaData}
        webCamModes={['picture']}
        uploaders={['webcam']}
        buttonTitle="Upload photo"
      >
        <div class="w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
          <div class="grid h-full max-w-lg grid-cols-3 mx-auto font-medium">
            <button
              id="product-upload-button"
              type="button"
              class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
            >
              <svg
                class="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 256 256"
                ><path
                  fill="currentColor"
                  d="M222 152v56a14 14 0 0 1-14 14H48a14 14 0 0 1-14-14v-56a6 6 0 0 1 12 0v56a2 2 0 0 0 2 2h160a2 2 0 0 0 2-2v-56a6 6 0 0 1 12 0ZM92.24 84.24L122 54.49V152a6 6 0 0 0 12 0V54.49l29.76 29.75a6 6 0 0 0 8.48-8.48l-40-40a6 6 0 0 0-8.48 0l-40 40a6 6 0 0 0 8.48 8.48Z"
                /></svg
              >
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
                ><path
                  fill="currentColor"
                  d="M3 19q-.825 0-1.413-.588T1 17V7q0-.825.588-1.413T3 5h10q.825 0 1.413.588T15 7v10q0 .825-.588 1.413T13 19H3Zm15-8q-.425 0-.713-.288T17 10V6q0-.425.288-.713T18 5h4q.425 0 .713.288T23 6v4q0 .425-.288.713T22 11h-4ZM4 15h8l-2.625-3.5L7.5 14l-1.375-1.825L4 15Zm14 4q-.425 0-.713-.288T17 18v-4q0-.425.288-.713T18 13h4q.425 0 .713.288T23 14v4q0 .425-.288.713T22 19h-4Z"
                /></svg
              >
              <span
                class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                >Library</span
              >
            </button>
            <button
              on:click={edit}
              type="button"
              class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
            >
              <svg
                class="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                ><path
                  fill="currentColor"
                  d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75l1.83-1.83z"
                /></svg
              >
              <span
                class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                >Edit</span
              >
            </button>
          </div>
        </div>
      </FileUploader>
    </div>
  </div>
</div>
