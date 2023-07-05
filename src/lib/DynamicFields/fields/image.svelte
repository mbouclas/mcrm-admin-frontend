<script lang="ts">
import FileUploader from "../../Shared/file-uploader.svelte";
import type {IEvent} from "../../Shared/models/generic";
import type {SuccessResponse, UploadResult, UppyFile} from "@uppy/core";
const uploadIdPrefix = 'upload-';
export let model;
export let title = 'Image';
let uploader = {};

function uploadComplete(e: IEvent<{id: string, file: UppyFile<Record<string, unknown>, Record<string, unknown>>, response: SuccessResponse}>) {
    const idx = parseInt(e.detail.id.replace(uploadIdPrefix, ''));
}

function onAllUploadsComplete(e: IEvent<{id: string, res: UploadResult<Record<string, unknown>>}>) {
    const uploadedFiles = e.detail.res.successful;
}

function onUploadFailed(e: IEvent<{id: string, res: UploadResult<Record<string, unknown>>}>) {
    const failure = e.detail.res.failed;
}
</script>

<div class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 max-h-[500px]">
    <div class="pt-4 items-center text-center">
        <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{title}</h5>
    </div>
    <img class="p-8 rounded-t-lg" src={model.url}  />

    <div class=" items-center text-center">
        <div class="flex items-center justify-center">
            <FileUploader id={`product`} on:uploadComplete={uploadComplete} on:allUploadsComplete={onAllUploadsComplete} on:uploadFailed={onUploadFailed}
                          bind:this={uploader}
                          webCamModes={['picture']} uploaders={['webcam']} buttonTitle="Upload photo"  />
        </div>
    </div>
</div>
