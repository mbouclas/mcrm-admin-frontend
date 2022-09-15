<script lang="ts">
  import { Label, Helper, Progressbar } from "flowbite-svelte";
  import {filedrop} from "filedrop-svelte";
  import fileSize from "filesize";
  import type { Files } from "filedrop-svelte";


  import type {
    IDynamicFieldConfigBlueprint,
    IDynamicFieldConfigImageSettingsBluePrint,
  } from "../../types";
  import {XhrFileUploads} from "../../../helpers/xhr-file-uploads";
  import type {IUploadResponse} from "../../../helpers/xhr-file-uploads";

  export let options: IDynamicFieldConfigImageSettingsBluePrint =
    {} as IDynamicFieldConfigImageSettingsBluePrint;

  export let field: IDynamicFieldConfigBlueprint =
    {} as IDynamicFieldConfigBlueprint;
  export let model;
  export let module;
  export let itemId;
  export let files: Files;
  export let label: string;
  export let helperText: string;
  let preview;
  showPreview();

  async function onFilesDropped(e) {
    files = e.detail.files;
    for (let idx = 0; files.accepted.length > idx; idx++) {
      files.accepted[idx]['progress'] = 0;
      files.accepted[idx]['index'] = idx;
      const uploader = new XhrFileUploads(files.accepted[idx], {module, type: 'image', id: itemId});
      // Handle progress updates
      uploader.subscription.subscribe(res => {
        if (res.error) {
          handleUploadError(res.error);
          return;
        }

        // Update the progress for this upload
        files.accepted[idx]['progress'] = res.progress;

        //The image is not ready, we need to query it until we get a valid image object
        if (res.response && res.response.jobId) {
          uploader.startUploadUpdatesQuery(res.response.jobId);//Initialize the query
          // Receive updates until we have something valid
          uploader.uploadUpdates$.subscribe(async (res) => {
            if (!res) { return; }
            handleUploadDone(res);
          })

          return;
        }

        if (res.response && res.response.url) {
          model = res.response;
          return;
        }

      });
      uploader.start();
    }

  }

  function handleUploadDone(response: IUploadResponse) {
    preview = response.url;
    model = response;
    showPreview();
  }

  function handleUploadError(error) {
    console.log(error)
  }

  function showPreview() {
    preview = ((options && options.showPreview && preview) || (model && model.url))
  }
</script>

<div class="mb-6">
  {#if label}
    <Label for="success" class="block mb-2 !text-gray-400">{label}</Label>
  {/if}

  {#if preview}
    <div class="group aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
      <img src={preview} alt="" class="pointer-events-none object-cover group-hover:opacity-75">
      <button type="button" class="inset-0 focus:outline-none">
        Delete
      </button>
    </div>
  {/if}

  <div
    use:filedrop={options}
    on:filedrop={onFilesDropped}
    class="filedrop"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="48"
      height="48"
      ><path fill="none" d="M0 0h24v24H0z" /><path
        d="M1 14.5a6.496 6.496 0 0 1 3.064-5.519 8.001 8.001 0 0 1 15.872 0 6.5 6.5 0 0 1-2.936 12L7 21c-3.356-.274-6-3.078-6-6.5zm15.848 4.487a4.5 4.5 0 0 0 2.03-8.309l-.807-.503-.12-.942a6.001 6.001 0 0 0-11.903 0l-.12.942-.805.503a4.5 4.5 0 0 0 2.029 8.309l.173.013h9.35l.173-.013zM13 13v4h-2v-4H8l4-5 4 5h-3z"
      /></svg
    >
    <!-- <p>Drag &amp; drop files</p> -->
  </div>
  {#if files}
    <h2>Accepted files</h2>
    <ul>
      {#each files.accepted as file}
        <li>{file.name} - {fileSize(file.size)} <Progressbar progress={file.progress} />  - {file.progress}</li>
      {/each}
    </ul>
    <h2>Rejected files</h2>
    <ul>
      {#each files.rejected as rejected}
        <li>{rejected.file.name} - {rejected.error.message}</li>
      {/each}
    </ul>
  {/if}

  {#if helperText}
    <Helper>{helperText}</Helper>
  {/if}
</div>

<style>
  .filedrop {
    background-color: #2e3446;
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 0.375rem;
    border: none;
    outline: none;
    transition: border 0.3s ease-in-out;
    outline-offset: -1.3em;
    padding: 0.475em;
    cursor: pointer;
  }
  .filedrop:focus {
    border-color: #2196f3;
  }
  .filedrop:hover {
    border-color: #343434;
  }
  .filedrop p,
  .filedrop svg {
    transition: color 0.1s;
    transition: fill 0.1s;
  }
  .filedrop:focus p,
  .filedrop:focus svg {
    color: #343434;
    fill: #343434;
  }
  .filedrop:hover p,
  .filedrop:hover svg {
    color: #2196f3;
    fill: #2196f3;
  }
  p {
    color: #373737;
    font-size: 1.2em;
    cursor: default;
    align-content: center;
  }
</style>
