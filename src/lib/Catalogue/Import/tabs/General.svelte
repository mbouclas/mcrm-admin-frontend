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
    Alert, Modal, Hr
  } from 'flowbite-svelte';
  import type { IDynamicFieldConfigFileUploadSettingsBluePrint } from '../../../DynamicFields/types';
  import type {
    IFileImportUploadResult,
    IImportAnalyzerInvalidRow,

    IImportProcessorFieldMap
  } from '../../types';
  import Loading from '../../../Shared/Loading.svelte';
  import Toast from '../../../Shared/Toast.svelte';
  import { ImportService} from '../../services/products/import.service';
  import type {IBaseProcessResult, IImportStartResult} from '../../services/products/import.service';
  import {onMount} from "svelte";
  import {ImportTemplatesService} from "../../services/import/import-templates.service";
  import type {IEvent} from "../../../Shared/models/generic";
  import {QuestionMark} from "radix-icons-svelte";
  import {ArrowRightToBracketOutline, EditOutline} from "flowbite-svelte-icons";
  import {getPropertyFromObject, schemaToFields} from "../../../helpers/data";
  import CustomFields from "../../../CustomFields/group-field-renderer.svelte";
  import {truncate} from "lodash";
  import {moneyFormat} from "../../../helpers/money";
  import {setNotificationAction} from "../../../stores";

  let model;
  const options: IDynamicFieldConfigFileUploadSettingsBluePrint = {
    accept: '.csv',
    baseUrl: 'import/validate',
    fileLimit: 1,
    multiple: false,
  };
  const pageTitle = `Import`;
  let validRows = 0,
          skippedRows = undefined,
          invalidRows: IImportAnalyzerInvalidRow[] = [],
          isInvalid = false,
          processing = false,
          analysisDone = false,
          immediateImportThreshold = 300,
          importInProgress = false,
          rows = [],
          propertyCols = [],
          fieldMap = [],
          rowsProcessed: number = null,
          file,
          backupInProgress = false,
          showSelectedTemplateHelpModal = false,
          selectedTemplateForHelp = null,
          invalidRowsCount = undefined,
          errors;

  let templates = [];
  let selectedTemplate;
  let loading = false;

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
    templates.forEach(template => {
      if (template.settingsSchema) {
        template.settingsSchema = schemaToFields(template.settingsSchema);
        template.settings = (typeof template.settings !== 'object') ? {} : template.settings;
      }
    });
  });

  function handleValidationUploadDone(e: IEvent<IFileImportUploadResult>) {
    invalidRowsCount = e.detail.response.invalidRowsCount || undefined;
    fieldMap = e.detail.response.fieldMap;
    rows = e.detail.response.data;
    validRows = e.detail.response.validRows;
    invalidRows = e.detail.response.invalidRows;
    skippedRows = e.detail.response.skippedRows;
    processing = false;
    analysisDone = true;
    file = e.detail.response.file;
    loading = false;
    if (e.detail.response.isInvalid && typeof e.detail.response.metaData === 'object') {
      isInvalid = true;
      errors = e.detail.response.metaData;
    }
  }

  function handleInvalidUpload() {
    isInvalid = true;
  }

  function handleUploadStart(e) {
    console.log('Started', e.detail);
    loading = true;
    processing = true;
  }



  function handleImportDone(res: IBaseProcessResult) {
    importInProgress = false;
    rowsProcessed = res.rowsProcessed;
    setNotificationAction({
      message: 'Import Complete',
      type: 'success',
    });
    reset();

    setTimeout(() => {
      rowsProcessed = null;
    }, 3000);
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
      loading = true;
      try {
        const res = await service.start(file, selectedTemplate.id, true, selectedTemplate.settings) as IBaseProcessResult;
        handleImportDone(res);
      }
      catch (e) {
        errors = e;
        console.log(e)
      }

      loading = false;
      return;
    }

    setNotificationAction({
      message: 'Import Started in the background',
      type: 'info',
    });

    try {
      const res = await service.start(file, selectedTemplate.id, false, selectedTemplate.settings) as IImportStartResult;
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
    selectedTemplate.data = {};
    if (selectedTemplate.settings && typeof selectedTemplate.settings === 'object') {
        selectedTemplate.data = {...{settings: selectedTemplate.settings}};
    }
  }

  function renderProperty(row: any, key: IImportProcessorFieldMap) {
    // transform data
    switch (key.type) {
      case "image":
        try {
          const json = JSON.parse(row[key.name]);
          return `<img src="${json.url}"  class="w-20 h-20 object-cover" />`;
        }
        catch (e) {
          return `<img src="${row[key.name]}" alt="${row[key.name]}" class="w-20 h-20 object-cover" />`;

        }
      case "boolean":
        return row[key.name] ? 'Yes' : 'No';
      case "price":
        return moneyFormat(row[key.name]);
      case 'category' : {
        if (row['productCategory']) {

            if (!key.displayUsing) {
              return row[key.name].join(', ');
            }

            if (key.displayUsing.indexOf('.') !== -1) {
              const parts = key.displayUsing.split('.');
              return row[parts[0]].map(c => c[parts[1]]).join(', ');
            }

            return row[key.displayUsing].join(', ');
        }

      }

      default: return truncate(row[key.name]);
    }

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

  function templateHelp(template) {
    selectedTemplateForHelp = template;
    showSelectedTemplateHelpModal = true;
  }
</script>

<svelte:head>
  <title>{pageTitle}</title>
</svelte:head>
<Modal size="sm" bind:open={loading} title="Please wait..."
       dialogClass="fixed top-0 left-0 right-0 h-modal md:inset-0 md:h-full  w-full p-4 flex z-[99999]">
  <div class="flex items-center justify-center">
    <Loading>Please wait...</Loading>
  </div>
</Modal>
<Modal title="Backup in progress" autoclose={false} size="xl" bind:open={backupInProgress}>
  <div>
    <Heading tag="h2">Backup in progress</Heading>
    <p>Do not close or refresh this window</p>
  </div>
  <div class="flex items-center justify-center">
    <Loading color="green" />
  </div>

</Modal>
<div class="w-full  overflow-x-auto">
{#if selectedTemplateForHelp}
<Modal title={`Help for ${selectedTemplateForHelp.title}`} autoclose={false} size="xl" bind:open={showSelectedTemplateHelpModal}>
  <Table shadow striped>
    <TableHead>
      <TableHeadCell>Field Name</TableHeadCell>
      <TableHeadCell>CSV Field Name</TableHeadCell>
      <TableHeadCell>Type</TableHeadCell>
      <TableHeadCell>Required</TableHeadCell>
      <TableHeadCell>Instructions</TableHeadCell>

    </TableHead>
    <TableBody class="divide-y">
      {#each selectedTemplateForHelp.fieldMap as field}
        <TableBodyRow>
          <TableBodyCell>{field.name}</TableBodyCell>
          <TableBodyCell>{field.importFieldName}</TableBodyCell>
          <TableBodyCell>{field.type}</TableBodyCell>
          <TableBodyCell>{field.required ? 'Yes' : 'No'}</TableBodyCell>
          <TableBodyCell>{@html field.description || ''}</TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>

</Modal>
  {/if}

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
  <Table shadow striped hoverable={true}>
    <TableHead>
      <TableHeadCell>Template</TableHeadCell>
      <TableHeadCell>Description</TableHeadCell>
      <TableHeadCell>#Fields</TableHeadCell>
      <TableHeadCell></TableHeadCell>

    </TableHead>
    <TableBody class="divide-y">
      {#each templates as template}
        <TableBodyRow>
          <TableBodyCell>{template.title}</TableBodyCell>
          <TableBodyCell>{template.description}</TableBodyCell>
          <TableBodyCell>
            <Button on:click={templateHelp.bind(this, template)} color="purple">{template.fieldMap.length}</Button>
          </TableBodyCell>
          <TableBodyCell>
            {#if selectedTemplate === template}
              Selected
              {:else}
            <Button on:click={handleTemplateChange.bind(this, template)}><ArrowRightToBracketOutline /></Button>
            <Button on:click={handleTemplateChange.bind(this, template)}><EditOutline /></Button>
              {/if}
          </TableBodyCell>

        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
  {#if selectedTemplate}
    <div class="my-6 flex justify-between">
    <Heading tag="h4">Using {selectedTemplate.title}</Heading>
      <span></span>
      <Button on:click={templateHelp.bind(this, selectedTemplate)} color="purple" title="Help">
        <QuestionMark />
      </Button>
    </div>

    {#if selectedTemplate.settingsSchema}
      <CustomFields fields={selectedTemplate.settingsSchema} let:field={field} fieldPrimaryKey="varName" bind:model={selectedTemplate.settings}>

      </CustomFields>
      {/if}


  <FileUpload {options} {model} bind:data={selectedTemplate.data}
              on:done={handleValidationUploadDone} on:started={handleUploadStart} />
    {/if}
{/if}

{#if analysisDone}
  <div class="my-6">
    <p>Valid Rows: {validRows}</p>
    <p>Invalid Rows: {invalidRows.length}</p>
    {#if errors && errors.skippedProducts}
      <Alert color="red" rounded={false} class="border-t-4">
        <p class="font-medium">{errors.skippedProducts.count} Products already exist</p>
      </Alert>
      {/if}
    {#if skippedRows}
      <p>Skipped Rows: {skippedRows}</p>
      {/if}
  </div>
  <div class="my-6">
    <Button color="red" on:click={reset}>Reset</Button>
  </div>
{/if}

{#if analysisDone && invalidRows.length === 0}
  <Heading tag="h2">Upload Results Sample</Heading>
  <Hr />
<div class="w-[98%] max-w-[90%] overflow-x-auto">
    <Table shadow striped>
      <TableHead>
        {#each fieldMap as col}
          <TableHeadCell>{col.name}</TableHeadCell>
        {/each}
      </TableHead>
      <TableBody class="divide-y">
        {#each rows.slice(0, 10) as row}
          <TableBodyRow>
            {#each fieldMap as c}
              <TableBodyCell>{@html renderProperty(row, c)}</TableBodyCell>
            {/each}
          </TableBodyRow>
        {/each}
      </TableBody>
    </Table>

  <div class="my-6">
    <Button gradient color="green" class="w-full" on:click={handleStartImport} disabled={importInProgress || isInvalid}
    >Start Import</Button>
  </div>
</div>


{/if}

{#if invalidRows.length > 0}
  <Heading tag="h2" class="my-6">List of invalid rows</Heading>
  {#if invalidRowsCount}
    <p class="my-6 text-red-800">Only showing first 50 invalid rows. Found <strong>{invalidRowsCount}</strong> more</p>
    {/if}
  <Table shadow striped>
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
</div>
