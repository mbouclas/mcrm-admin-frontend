<svelte:head>
    <title>{pageTitle}</title>
</svelte:head>
<script lang="ts">
import FileUpload from '../../DynamicFields/fields/file-upload.svelte';
import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Button, Heading } from 'flowbite-svelte';
import type {IDynamicFieldConfigFileUploadSettingsBluePrint} from "../../DynamicFields/types";
import type {IImportAnalyzerResult} from "../types";
import Loading from "../../Shared/Loading.svelte";
import Toast from "../../Shared/Toast.svelte";
import {ImportService} from "../services/products/import.service";

export let model;
const options: IDynamicFieldConfigFileUploadSettingsBluePrint = {
    accept: '.csv',
    baseUrl: 'import/analyze',
    fileLimit: 1,
    multiple: false,
};
const pageTitle = `Import Products`;
let validRows = 0,
    invalidRows = 0,
    isInvalid = false,
    processing = false,
    analysisDone = false,
    importInProgress = false,
    rows = [],
    propertyCols = [],
    file,
    errors;

const templates = [
    {
        name: 'Template 1',
        id: 1,
        default: true
    },
    {
        name: 'Template 2',
        id: 2,
        default: false
    }
];
let selectedTemplate;


function handleUploadDone(e) {
    const res: IImportAnalyzerResult = e.detail.response;
    if (res.isInvalid) {
        handleInvalidUpload();
        return;
    }

    validRows = res.data.length;
    invalidRows = res.invalidRows.length;

    file = res.file;
    rows = res.data;
    rows.forEach(row => {
        // console.log(row.properties)
        if (!Array.isArray(row.properties)) {return;}

        row.properties.forEach(prop => {
            const key = prop.key.replace('property.', '');
            if (propertyCols.indexOf(key) !== -1) {return;}

            propertyCols.push(key);
        })
    });

    processing = false;
    analysisDone = true;
}

function handleInvalidUpload() {
    isInvalid = true;
}

function handleUploadStart(e) {
    console.log('Started', e.detail)
    processing = true;
}

function renderProperty(idx: number, properties) {
    const found = properties.find(p => p.key === propertyCols[idx]);
    if (!found) {return ''}
    return found.value;
}

function handleImportDone(res) {
    importInProgress = false;
    console.log('Import done', res)
}

async function handleStartImport() {
    const service = new ImportService();
    importInProgress = true;

    try {
        const res = await service.start(file);
        // we now have a jobId which we need to query for
        service.startUploadUpdatesQuery(res.jobId);//Initialize the query
        // Receive updates until we have something valid
        service.uploadUpdates$.subscribe(async (result: {state: string}|null) => {

            if (!result || result.state !== 'completed') { return; }
            handleImportDone(result);
        })
    }
    catch (e) {
        errors = e;
    }
}

function handleTemplateChange() {
    const parts = options.baseUrl.split('?');
    options.baseUrl = `${parts[0]}?template=${selectedTemplate.id}`;

    console.log(options.baseUrl, selectedTemplate)
}

</script>

{#if processing}<Loading /> {/if}
<p>Valid Rows: {validRows}</p>
<p>Invalid Rows: {invalidRows}</p>
{#if !importInProgress}
    {selectedTemplate?.name}
    <select bind:value={selectedTemplate} on:change="{handleTemplateChange}">
        {#each templates as template}
            <option value={template}>{template.name}</option>
        {/each}
    </select>
<FileUpload {options} {model} on:done={handleUploadDone} on:started={handleUploadStart} />
{/if}

{#if analysisDone}
    <Heading tag="h2">Upload Results Sample</Heading>
    <Table>
        <TableHead>
            <TableHeadCell>Product name</TableHeadCell>
            <TableHeadCell>Categories</TableHeadCell>
            <TableHeadCell>Price</TableHeadCell>
            {#each propertyCols as col}
                <TableHeadCell>{col}</TableHeadCell>
            {/each}
        </TableHead>
        <TableBody class="divide-y">
            {#each rows.slice(0, 10) as row}
            <TableBodyRow>
                <TableBodyCell>{row.title}</TableBodyCell>
                <TableBodyCell>{#each row.categories as category}{category}{/each}</TableBodyCell>
                <TableBodyCell>{row.price}</TableBodyCell>
                {#each propertyCols as col, idx}
                    <TableBodyCell>{renderProperty(idx, row.properties)}</TableBodyCell>
                {/each}
            </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
    <Button gradient color="red" class="w-full" on:click={handleStartImport}
            disabled={importInProgress}>Start Import</Button>

{/if}




<div class="w-full">
    <div class="relative h-56">
        <Toast simple
               position="bottom-right"
               show={importInProgress}
               message="Import started"
               type="success"
        ></Toast>
    </div>

</div>
