<script lang="ts">
  import { onMount } from 'svelte';
  import {
    Button,
    Modal,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell
  } from 'flowbite-svelte';
  import { ImportTemplatesService } from '../../services/import/import-templates.service';
  import { navigate, useLocation } from 'mcrm-svelte-navigator';
  import {EditOutline} from "flowbite-svelte-icons";


  const defaultTemplateData = {
    uuid: '',
    type: '',
    name: '',
    default: false,
    fieldMap: [],
    processor: '',
    settings: { delimiter: '' },
  };

  let importTemplateData = defaultTemplateData;
  let isImportTemplateModalOpen = false;

  let isEditImportTemplateModalOpen = false;
  let editImportTemplateIndex = null;

  let isDeleteImportTemplateModalOpen = false;

  const location = useLocation();
  const currentPath = $location.pathname;
  const queryParams = new URLSearchParams($location.search);

  let templates = [];
  const service = new ImportTemplatesService();
  const defaultFilters = {
    limit: 12,
    page: 1,
    orderBy: 'createdAt',
    way: 'desc',
    q: '',
  };
  let filters: typeof defaultFilters,
    appliedFilters = [],
          ready = false,
          selectedTemplate = null,
          templateHelp = null,
    loading = false;
  reset();

  onMount(async () => {
    await search();
    ready = true;
  });

  async function search() {

    loading = true;
    templates = await service.find(filters, []);

    loading = false;
  }

  async function reset() {
    filters = Object.assign({}, defaultFilters);
    navigate(currentPath);
    await search();
  }

  async function changeOrderBy(order: string, way: string) {
    if (filters.orderBy === order) {
      filters.way = filters.way === 'asc' ? 'desc' : 'asc';
    }

    filters.orderBy = order;

    await search();
  }

  async function handlePageChange(e) {
    filters.page = e.detail;
    await search();
  }

  const confirmImportTemplateAdd = async () => {
    await service.store(importTemplateData);
    await search();
    isImportTemplateModalOpen = false;
    importTemplateData = defaultTemplateData;
  };

  const cancelImportTemplateAdd = () => {
    isImportTemplateModalOpen = false;
  };

  const confirmImportTemplateEdit = async () => {
    await service.update(importTemplateData.uuid, importTemplateData);
    await search();
    isEditImportTemplateModalOpen = false;
    importTemplateData = defaultTemplateData;
  };

  const cancelImportTemplateEdit = () => {
    isEditImportTemplateModalOpen = false;
  };

  const handleDeleteModalOpen = (item) => {
    importTemplateData = item;
    isDeleteImportTemplateModalOpen = true;
  };

  const deleteImportTemplate = async () => {
    await service.deleteRow(importTemplateData.uuid);
    isDeleteImportTemplateModalOpen = false;
    importTemplateData = defaultTemplateData;

    await search();
  };

  const cancelDeleteImportTemplate = () => {
    isDeleteImportTemplateModalOpen = false;
    importTemplateData = defaultTemplateData;
  };

  async function toggleStatus(item, value) {
    await service.update(item.uuid, { default: value });
  }

  function edit(item) {
    selectedTemplate = item;
    isEditImportTemplateModalOpen = true;
  }
</script>
{#if ready}
<Table>
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
            <Button on:click={edit.bind(this, template)} >
              <EditOutline />
            </Button>
          {/if}
        </TableBodyCell>

      </TableBodyRow>
    {/each}
  </TableBody>
</Table>
  {/if}
