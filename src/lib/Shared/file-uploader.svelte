<script lang="ts">
    import Uppy, {debugLogger} from '@uppy/core'
    import type {UppyOptions} from '@uppy/core';
    import Dashboard from '@uppy/dashboard'
    import Webcam from "@uppy/webcam";
    import RemoteSources from '@uppy/remote-sources'
    import ImageEditor from '@uppy/image-editor'
    import DropTarget from "@uppy/drop-target";
    import XHRUpload from "@uppy/xhr-upload";
    import Url from '@uppy/url';
    import GoldenRetriever from '@uppy/golden-retriever';
    import '@uppy/core/dist/style.css';
    import '@uppy/dashboard/dist/style.css';
    import '@uppy/webcam/dist/style.css';
    import '@uppy/image-editor/dist/style.min.css';
    import "@uppy/audio/dist/style.css";
    import Audio from "@uppy/audio";
    import {createEventDispatcher, onMount} from "svelte";
    const dispatch = createEventDispatcher();

    let uppyDashboard;
    export let uploaders = [
        'local'
    ], id = 'uploader',
        buttonTitle = 'Upload',
        webCamModes = [
            'video-audio',
            'video-only',
            'audio-only',
            'picture'
        ],
        closeAfterFinish = false,
        autoProceed = true,
        meta = {}
    ;

    export function close() {
        uppyDashboard.setState({files: []});

    }
    export let options: UppyOptions = {};
    onMount(() => {

        const companionUrl = `${import.meta.env.PUBLIC_BASE_URL}companion`;
        uppyDashboard = new Uppy({
                logger: debugLogger,
                meta,
                id,
                autoProceed,
                restrictions: {
                    maxNumberOfFiles: 10,
                    allowedFileTypes: ['image/*', '.pdf']
                },
                onBeforeUpload: (files) => {
                    uppyDashboard.setFileMeta({...{}, ...meta});
                    return files;
                },
            });

        uppyDashboard.use(Dashboard, {
                    inline: false,
                    // target: '#uploader',
                    trigger: `#trigger-${id}`,
                    showProgressDetails: true,
                    proudlyDisplayPoweredByUppy: false,
                    closeAfterFinish,
                });

        uppyDashboard.use(ImageEditor, {target: Dashboard});
        uppyDashboard.use(DropTarget, {
                    target: document.body
                });
        uppyDashboard.use(XHRUpload, {
                    endpoint: `${import.meta.env.PUBLIC_BASE_URL}upload/file`,
                    limit: 6,
                    bundle: true,
                    withCredentials: true,
                    formData: true,
                });

        uppyDashboard.use(GoldenRetriever);

        if (uploaders.indexOf('webcam') !== -1) {
            uppyDashboard.use(Webcam, {
                target: Dashboard,
                showVideoSourceDropdown: true,
                modes: webCamModes,
                videoConstraints: {
                    facingMode: 'environment'
                }
            });
        }

        if (uploaders.indexOf('audio') !== -1) {
            uppyDashboard.use(Audio, {
                target: Dashboard,
            });
        }

        if (uploaders.indexOf('url') !== -1) {
            uppyDashboard.use(Url, {
                target: Dashboard,
                companionUrl,
            });
        }

        if (uploaders.indexOf('remoteSources') !== -1) {
            uppyDashboard.use(RemoteSources, {
                companionUrl ,
                sources: ['Url', 'GoogleDrive']
            });
        }


        window['uppy'] = uppyDashboard;

        uppyDashboard.on("complete", (result) => {
            if (result.failed.length > 0) {
                dispatch('uploadFailed', {id, res: result.failed});
                return;
            }

            dispatch('allUploadsComplete', {id, res: result});
        });

        uppyDashboard.on('upload-success', (file, response) => {
            dispatch('uploadComplete', {id, file, response});
        });
    });
</script>


<div class="w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600 ">
<div class="grid h-full max-w-lg grid-cols-2 mx-auto font-medium ">
    <button id={`trigger-${id}`}
            type="button" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
        <svg class="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path fill="currentColor" d="M222 152v56a14 14 0 0 1-14 14H48a14 14 0 0 1-14-14v-56a6 6 0 0 1 12 0v56a2 2 0 0 0 2 2h160a2 2 0 0 0 2-2v-56a6 6 0 0 1 12 0ZM92.24 84.24L122 54.49V152a6 6 0 0 0 12 0V54.49l29.76 29.75a6 6 0 0 0 8.48-8.48l-40-40a6 6 0 0 0-8.48 0l-40 40a6 6 0 0 0 8.48 8.48Z"/></svg>
        <span class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Upload</span>
    </button>
    <button type="button" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
        <svg class="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M3 19q-.825 0-1.413-.588T1 17V7q0-.825.588-1.413T3 5h10q.825 0 1.413.588T15 7v10q0 .825-.588 1.413T13 19H3Zm15-8q-.425 0-.713-.288T17 10V6q0-.425.288-.713T18 5h4q.425 0 .713.288T23 6v4q0 .425-.288.713T22 11h-4ZM4 15h8l-2.625-3.5L7.5 14l-1.375-1.825L4 15Zm14 4q-.425 0-.713-.288T17 18v-4q0-.425.288-.713T18 13h4q.425 0 .713.288T23 14v4q0 .425-.288.713T22 19h-4Z"/></svg>
        <span class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Library</span>
    </button>
</div>
</div>
<main id="uploader" class=" py-2"></main>

