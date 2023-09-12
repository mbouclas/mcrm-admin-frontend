<script lang="ts">
  import { Button } from 'flowbite-svelte';
  import Modal from '../../../Shared/Modal.svelte';
  import Input from '../../../Shared/Input.svelte';
  import Toggle from '../../../Shared/Toggle.svelte';
  import DropDown from '../../../Shared/DropDown.svelte';

  let typeValues = [
    'text',
    'number',
    'float',
    'boolean',
    'category',
    'property',
    'image',
    'variantId',
    'productId',
    'price',
    'tag',
  ];

  export let items: any[];

  const defaultTemplateData = {
    name: '',
    importFieldName: '',
    rename: false,
    required: false,
    type: 'text',
  };

  let importTemplateData = JSON.parse(JSON.stringify(defaultTemplateData));
  let isFieldMapModalOpen = false;

  let isEditFieldMapModalOpen = false;
  let editFieldMapIndex = null;

  const confirmFieldMapAdd = async () => {
    items = [...items, { ...importTemplateData }];
    isFieldMapModalOpen = false;
  };

  const cancelFieldMapAdd = () => {
    isFieldMapModalOpen = false;
  };

  const confirmFieldMapEdit = async () => {
    items[editFieldMapIndex] = { ...importTemplateData };
    isEditFieldMapModalOpen = false;
  };

  const cancelFieldMapEdit = () => {
    isEditFieldMapModalOpen = false;
  };

  const handleOpenFieldMapAdd = () => {
    importTemplateData = { ...defaultTemplateData };
    isFieldMapModalOpen = true;
  };

  const handleOpenFieldMapEdit = (item, index) => {
    importTemplateData = { ...item };
    isEditFieldMapModalOpen = true;
    editFieldMapIndex = index;
  };
</script>

<Modal className="w-3/4" bind:showModal={isFieldMapModalOpen}>
  <div slot="header">Add Field Map</div>

  <div slot="content">
    <div class="mb-4 mt-4">
      <Input label="Name" placeholder="Enter name" bind:value={importTemplateData.name} required />
    </div>

    <div class="mb-4">
      <DropDown placeholder="Type" label="Type" bind:value={importTemplateData['type']} values={typeValues} />
    </div>

    <div class="mb-4">
      <Input
        label="Import Field Name"
        placeholder="Enter import field name"
        bind:value={importTemplateData.importFieldName}
        required
      />
    </div>

    <div class="mb-4">
      <Toggle label="Required" bind:value={importTemplateData.required} />
    </div>

    <div class="mb-4">
      <Toggle label="Rename" bind:value={importTemplateData.rename} />
    </div>
  </div>
  <svelte:fragment slot="footer">
    <Button on:click={confirmFieldMapAdd}>Add</Button>
    <Button color="alternative" on:click={cancelFieldMapAdd}>Cancel</Button>
  </svelte:fragment>
</Modal>

<Modal className="w-3/4" bind:showModal={isEditFieldMapModalOpen}>
  <div slot="header">Edit field map</div>

  <div slot="content">
    <div class="mb-4 mt-4">
      <Input label="Name" placeholder="Enter name" bind:value={importTemplateData.name} required />
    </div>

    <div class="mb-4">
      <DropDown placeholder="Type" label="Type" bind:value={importTemplateData['type']} values={typeValues} />
    </div>

    <div class="mb-4">
      <Input
        label="Import Field Name"
        placeholder="Enter import field name"
        bind:value={importTemplateData.importFieldName}
        required
      />
    </div>

    <div class="mb-4">
      <Toggle label="Required" bind:value={importTemplateData.required} />
    </div>

    <div class="mb-4">
      <Toggle label="Rename" bind:value={importTemplateData.rename} />
    </div>
  </div>
  <svelte:fragment slot="footer">
    <Button on:click={confirmFieldMapEdit}>Confirm</Button>
    <Button color="alternative" on:click={cancelFieldMapEdit}>Cancel</Button>
  </svelte:fragment>
</Modal>

<div class="max-w-screen-xl">
  <div class="max-w-screen-sm">
    <h2 class="mb-4 text-xl lg:text-2xl tracking-tight font-extrabold text-gray-900 dark:text-white">
      <span class="text-blue-400"> {items.length}</span> Import templates
    </h2>
  </div>
</div>

<div class="flex items-center space-x-4">
  <button on:click={() => handleOpenFieldMapAdd()} class="bg-green-500 rounded p-2">Add field map</button>
</div>

<div class="flex flex-col mt-6">
  <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
      <div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                <div class="flex items-center gap-x-3">
                  <input
                    type="checkbox"
                    class="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
                  />

                  <span>Name</span>
                </div>
              </th>

              <th
                scope="col"
                class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                <div class="flex items-center gap-x-3">
                  <span>Type</span>
                </div>
              </th>

              <th
                scope="col"
                class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                <div class="flex items-center gap-x-3">
                  <span>Import field name</span>
                </div>
              </th>

              <th
                scope="col"
                class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                <div class="flex items-center gap-x-3">
                  <span>Required</span>
                </div>
              </th>

              <th
                scope="col"
                class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                <div class="flex items-center gap-x-3">
                  <span>Rename</span>
                </div>
              </th>

              <th scope="col" class="relative py-3.5 px-4">
                <span class="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
            {#if items}
              {#each items as item, index}
                <tr>
                  <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                    <div class="inline-flex items-center gap-x-3">
                      <input
                        type="checkbox"
                        class="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
                      />

                      <span>
                        {item.name}
                      </span>
                    </div>
                  </td>

                  <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                    <div class="inline-flex items-center gap-x-3">
                      <span>
                        {item.type}
                      </span>
                    </div>
                  </td>

                  <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                    <div class="inline-flex items-center gap-x-3">
                      <span>
                        {item.importFieldName}
                      </span>
                    </div>
                  </td>

                  <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                    <div class="inline-flex items-center gap-x-3">
                      <Toggle bind:value={item.required} />
                    </div>
                  </td>

                  <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                    <div class="inline-flex items-center gap-x-3">
                      <Toggle bind:value={item.rename} />
                    </div>
                  </td>

                  <td class="px-4 py-4 text-sm whitespace-nowrap">
                    <div class="flex items-center gap-x-6">
                      <button
                        title="Edit Rule"
                        on:click={() => {
                          handleOpenFieldMapEdit(item, index);
                        }}
                        type="button"
                        class="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="w-5 h-5"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                      </button>

                      <button
                        title="Delete Rule"
                        on:click|preventDefault={() => {
                          items = items.filter((item, itemIndex) => itemIndex !== index);
                        }}
                        class="text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 hover:text-red-500 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="w-5 h-5"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
