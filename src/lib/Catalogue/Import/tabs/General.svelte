<script lang="ts">
  import FileUpload from '../../../DynamicFields/fields/file-upload.svelte';
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    Button,
    Heading,
    Select, Alert, Modal
  } from 'flowbite-svelte';
  import type { IDynamicFieldConfigFileUploadSettingsBluePrint } from '../../../DynamicFields/types';
  import type {
    IFileImportUploadResult,
    IImportAnalyzerInvalidRow,
    IImportAnalyzerResult,
    IImportProcessorFieldMap
  } from '../../types';
  import Loading from '../../../Shared/Loading.svelte';
  import Toast from '../../../Shared/Toast.svelte';
  import { ImportService} from '../../services/products/import.service';
  import type {IBaseProcessResult, IImportStartResult} from '../../services/products/import.service';
  import {onMount} from "svelte";
  import {ImportTemplatesService} from "../../services/import/import-templates.service";
  import type {IEvent} from "../../../Shared/models/generic";

  let model;
  const options: IDynamicFieldConfigFileUploadSettingsBluePrint = {
    accept: '.csv',
    baseUrl: 'import/validate',
    fileLimit: 1,
    multiple: false,
  };
  const pageTitle = `Import`;
  let validRows = 0,
          invalidRows: IImportAnalyzerInvalidRow[] = [],
          isInvalid = false,
          processing = false,
          analysisDone = false,
          immediateImportThreshold = 500,
          importInProgress = false,
          rows = [],
          propertyCols = [],
          fieldMap = [],
          rowsProcessed: number = null,
          file,
          backupInProgress = false,
          errors;

  let templates = [];
  let selectedTemplate;

  onMount(async () => {
    const service = new ImportTemplatesService();
    const res = await service.find({
      limit: 12,
      page: 1,
      orderBy: 'createdAt',
      way: 'desc',
      q: '',
    }, ['import templateCategory', 'variants'], true);
    templates = res;

  });

  function handleValidationUploadDone(e: IEvent<IFileImportUploadResult>) {
    fieldMap = e.detail.response.fieldMap;
    rows = e.detail.response.data;
    validRows = e.detail.response.validRows;
    invalidRows = e.detail.response.invalidRows;
    processing = false;
    analysisDone = true;
    file = e.detail.response.file;
  }



  function handleInvalidUpload() {
    isInvalid = true;
  }

  function handleUploadStart(e) {
    console.log('Started', e.detail);
    processing = true;
  }



  function handleImportDone(res: IBaseProcessResult) {
    importInProgress = false;
    rowsProcessed = res.rowsProcessed;
    reset();

    setTimeout(() => {
      rowsProcessed = null;
    }, 3000);
  }

  async function validate() {
    const service = new ImportService();
    importInProgress = true;

    const res = await service.validate(file, selectedTemplate.uuid);
  }

  async function handleStartImport() {
    const service = new ImportService();

    // run a backup first
    try {
      backupInProgress = true;
      await service.backup(import.meta.env.DEV);
      backupInProgress = false;
    } catch (e) {
      console.log(e);
      errors = e;
      return;
    }


    importInProgress = true;

    if (validRows <= immediateImportThreshold) {
      try {
        const res = await service.start(file, selectedTemplate.id, false) as IBaseProcessResult;
        handleImportDone(res);
      }
      catch (e) {
        errors = e;
        console.log(e)
      }
      return;
    }

    try {
      const res = await service.start(file, selectedTemplate.id, false) as IImportStartResult;
      // we now have a jobId which we need to query for
      service.startUploadUpdatesQuery(res.jobId); //Initialize the query
      // Receive updates until we have something valid
      service.uploadUpdates$.subscribe(async (result: { state: string } | null) => {
        if (!result || result.state !== 'completed') {
          return;
        }
        handleImportDone(result);
      });
    } catch (e) {
      errors = e;
    }
  }

  function handleTemplateChange(template) {
    selectedTemplate = template || selectedTemplate;
    const parts = options.baseUrl.split('?');
    options.baseUrl = `${parts[0]}?template=${selectedTemplate.id}`;
  }

  function renderProperty(row: any, key: IImportProcessorFieldMap) {
    // transform data
    return row[key.name];

  }

  function renderInvalidRowProperty(invalidRow: IImportAnalyzerInvalidRow, key: IImportProcessorFieldMap) {
    const field = invalidRow.fields.find((f) => f.key === key.name);
    if (!field) {
      return invalidRow.row[key.importFieldName];
    }

    return '<span class="text-red-500">INVALID VALUE</span>';
  }

  function reset() {
    validRows = 0;
    invalidRows = [];
    isInvalid = false;
    processing = false;
    analysisDone = false;
    importInProgress = false;
    selectedTemplate = null;
    rows = [];
    propertyCols = [];
    fieldMap = [];
    file = null;
    errors = null;
  }
</script>

<svelte:head>
  <title>{pageTitle}</title>
</svelte:head>
<Modal title="Backup in progress" autoclose={false} size="xl" bind:open={backupInProgress}>
  <div>
    <Heading tag="h2">Backup in progress</Heading>
    <p>Do not close or refresh this window</p>
  </div>
  <div class="flex items-center justify-center">
    <Loading color="green" />
  </div>

</Modal>

{#if processing}<Loading /> {/if}
<div class="my-6">


</div>
{#if !importInProgress && rowsProcessed}
  <Alert color="green" rounded={false} class="border-t-4">
    <p class="font-medium">Import Complete</p>
    {rowsProcessed} rows processed successfully
  </Alert>
{/if}

{#if !importInProgress && !analysisDone}
  <Table>
    <TableHead>
      <TableHeadCell>Template</TableHeadCell>
      <TableHeadCell>Description</TableHeadCell>
      <TableHeadCell></TableHeadCell>

    </TableHead>
    <TableBody class="divide-y">
      {#each templates as template}
        <TableBodyRow>
          <TableBodyCell>{template.name}</TableBodyCell>
          <TableBodyCell>{template.description}</TableBodyCell>
          <TableBodyCell>
            {#if selectedTemplate === template}
              Selected
              {:else}
            <Button on:click={handleTemplateChange.bind(this, template)}>Select</Button>
              {/if}
          </TableBodyCell>

        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
  {#if selectedTemplate}
    <div class="my-6">
    <Heading tag="h4">Using {selectedTemplate.name}</Heading>
    </div>
  <FileUpload {options} {model} on:done={handleValidationUploadDone} on:started={handleUploadStart} />
    {/if}
{/if}



{#if analysisDone && invalidRows.length === 0}
  <Heading tag="h2">Upload Results Sample</Heading>
  <Table>
    <TableHead>
      {#each fieldMap as col}
        <TableHeadCell>{col.name}</TableHeadCell>
      {/each}
    </TableHead>
    <TableBody class="divide-y">
      {#each rows.slice(0, 10) as row}
        <TableBodyRow>
          {#each fieldMap as c}
            <TableBodyCell>{renderProperty(row, c)}</TableBodyCell>
          {/each}
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
<div class="my-6">
  <Button gradient color="green" class="w-full" on:click={handleStartImport} disabled={importInProgress}
  >Start Import</Button
  >
</div>
{/if}
{#if analysisDone}
  <div class="my-6">
  <p>Valid Rows: {validRows}</p>
  <p>Invalid Rows: {invalidRows.length}</p>
  </div>
  <div class="my-6">
    <Button color="red" on:click={reset}>Reset</Button>
  </div>
{/if}
{#if invalidRows.length > 0}
  <Heading tag="h2" class="my-6">List of invalid rows</Heading>
  <Table>
    <TableHead>
      <TableHeadCell>#Row</TableHeadCell>
      {#each fieldMap as col}
        <TableHeadCell>{col.name}</TableHeadCell>
      {/each}
    </TableHead>
    <TableBody class="divide-y">
      {#each invalidRows as row}
        <TableBodyRow>
          <TableBodyCell>{row.id}</TableBodyCell>
          {#each fieldMap as c}
            <TableBodyCell>{@html renderInvalidRowProperty(row, c)}</TableBodyCell>
          {/each}
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
{/if}
<div class="w-full">
  <div class="relative h-56">
    <Toast simple position="bottom-right" show={importInProgress} message="Import started" type="success" />
  </div>
</div>
