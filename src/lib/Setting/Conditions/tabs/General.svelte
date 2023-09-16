<script lang="ts">
  import type { IDynamicFieldConfigBlueprint } from '../../../DynamicFields/types';
  import { Button, Modal, Toggle } from 'flowbite-svelte';
  import Fields from '../../../DynamicFields/Renderer.svelte';
  import Loading from '../../../Shared/Loading.svelte';
  import Input from '../../../Shared/Input.svelte';
  import DropDown from '../../../Shared/DropDown.svelte';
  import ErrorMessage from '../../../Shared/ErrorMessage.svelte';

  import { Trash } from 'svelte-heros-v2';
  import { navigate } from 'svelte-navigator';
  import { ConditionsService } from '../../services/conditions/condition.service';

  export let fields: IDynamicFieldConfigBlueprint[] = [];
  export let model;
  export let status: any = {};

  let mainFields = [];
  let secondaryFields = [];
  let deletePageModalOpen = false;
  let loading = false;
  let isRuleModalOpen = false;
  let isEditRuleModalOpen = false;
  let editRuleIndex;
  let ruleErrors = [];

  $: ruleErrors = getRuleErrors(model?.rules, status);

  const getRuleErrors = (rules = [], status) => {
    let newRuleErrors = [];
    const topRuleErrors = status['rules']?.errors;
    if (topRuleErrors) {
      newRuleErrors = [...topRuleErrors];
    }

    for (let i = 0; i < rules.length; i++) {
      for (const field of ['name', 'value', 'field', 'operator']) {
        const errors = status[`rules.${i}.${field}`]?.errors;
        if (errors?.length) {
          const formattedErrors = errors.map((message) => message + '<br>');
          newRuleErrors = [...newRuleErrors, ...formattedErrors];
        }
      }
    }

    return newRuleErrors;
  };

  const ruleFieldValues = [
    {
      key: 'quantity',
      value: 'quantity',
    },
    { key: 'price', value: 'price' },
    { key: 'subTotal', value: 'subTotal' },
    { key: 'total', value: 'total' },
    { key: 'promo', value: 'promo' },
    { key: 'items', value: 'items' },
    { key: 'numberOfItems', value: 'numberOfItems' },
  ];

  const ruleOperatorValues = [
    {
      key: '==',
      value: '==',
    },
    { key: '!=', value: '!=' },
    { key: '>', value: '>' },
    { key: '>=', value: '>=' },
    { key: '<', value: '<' },
    { key: '<=', value: '<=' },
    { key: 'in', value: 'in' },
    { key: 'not in', value: 'not in' },
  ];

  let ruleData = {
    name: '',
    field: '',
    operator: '',
    value: '',
  };
  const s = new ConditionsService();

  export let onSubmit: (data: any) => void;

  const onSubmitWithLoader = async (data) => {
    try {
      loading = true;
      await onSubmit(data);
    } finally {
      loading = false;
    }
  };

  async function toggleStatus() {
    const newActive = !model.active;
    await s.update(model.uuid, { active: newActive });
    model.active = newActive;
  }

  $: {
    fields.forEach((field) => {
      if (!field.group || field.group === 'main') {
        mainFields.push(field);
      }
      if (field.group === 'extra') {
        secondaryFields.push(field);
      }
    });
  }

  const handleDeleteModalOpen = () => {
    deletePageModalOpen = true;
  };

  const deletePage = async () => {
    await s.deleteRow(model.uuid);
    navigate('/settings/conditions/list');
  };

  const confirmRuleAdd = () => {
    model.rules = [...model.rules, ruleData];
    isRuleModalOpen = false;
  };

  const cancelRuleAdd = () => {
    isRuleModalOpen = false;
  };

  const confirmRuleEdit = () => {
    model.rules[editRuleIndex] = ruleData;
    editRuleIndex = null;
    isEditRuleModalOpen = false;
  };

  const cancelRuleEdit = () => {
    editRuleIndex = null;
    isEditRuleModalOpen = false;
  };
</script>

<Modal title="Confirm delete page" bind:open={deletePageModalOpen} autoclose outsideclose>
  <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
    Are you sure you want to <span class="text-lg font-bold">permanently delete</span>
    condition
    <span class="text-lg font-bold">{model.name}</span>?
  </p>
  <svelte:fragment slot="footer">
    <Button on:click={() => deletePage()}>Confirm</Button>
    <Button color="alternative">Cancel</Button>
  </svelte:fragment>
</Modal>

<Modal bind:open={isRuleModalOpen}>
  <div class="p-4">
    <h2 class="flowbite-modal-title mb-4 text-xl font-bold">Add rule</h2>

    <div class="mb-4">
      <Input label="Name" placeholder="Enter name" bind:value={ruleData.name} required />
    </div>
    <div class="mb-4">
      <DropDown placeholder="Select field" label="Field" bind:value={ruleData.field} values={ruleFieldValues} />
    </div>

    <div class="mb-4">
      <DropDown
        placeholder="Select operator"
        label="Operator"
        bind:value={ruleData.operator}
        values={ruleOperatorValues}
      />
    </div>

    <div class="mb-4">
      <Input label="Value" placeholder="Value" bind:value={ruleData.value} required />
    </div>
  </div>
  <svelte:fragment slot="footer">
    <Button on:click={confirmRuleAdd}>Add</Button>
    <Button color="alternative" on:click={cancelRuleAdd}>Cancel</Button>
  </svelte:fragment>
</Modal>

<Modal bind:open={isEditRuleModalOpen}>
  <div class="p-4">
    <h2 class="flowbite-modal-title mb-4 text-xl font-bold">Edit rule</h2>

    <div class="mb-4">
      <Input label="Name" placeholder="Enter name" bind:value={ruleData.name} required />
    </div>
    <div class="mb-4">
      <Input label="Value" placeholder="Value" bind:value={ruleData.value} required />
    </div>

    <div class="mb-4">
      <DropDown placeholder="Select field" label="Field" bind:value={ruleData.field} values={ruleFieldValues} />
    </div>

    <DropDown
      placeholder="Select operator"
      label="Operator"
      bind:value={ruleData.operator}
      values={ruleOperatorValues}
    />
  </div>
  <svelte:fragment slot="footer">
    <Button on:click={confirmRuleEdit}>Save edit</Button>
    <Button color="alternative" on:click={cancelRuleEdit}>Cancel</Button>
  </svelte:fragment>
</Modal>

{#if !model}<Loading /> {/if}
{#if model}
  {#if model.uuid}
    <div class="flex w-full pb-5 pr-3 justify-end">
      <div class="flex items-center w-20">
        <span
          >{model.active ? 'Active' : 'Inactive'}<span>
            <Toggle on:click={(e) => toggleStatus()} color="green" checked={model.active} />
          </span></span
        >
      </div>

      {#if true}
        <button on:click={() => handleDeleteModalOpen()} class="text-gray-500"><Trash color="white" /></button>
      {/if}
    </div>
  {/if}

  <form>
    <div class="grid md:grid-cols-2 md:gap-6">
      <div class="relative z-0 w-full mb-6 group">
        <Input bind:value={model.title} bind:errors={status.title.errors} placeholder="Title" label="Title" />
      </div>

      <div class="w-full mb-6 group">
        <DropDown
          placeholder="Select type"
          label="Type"
          bind:value={model.type}
          bind:errors={status.type.errors}
          values={fields
            .find((field) => field.varName === 'type')
            .ui.defaultValues.map((item) => ({
              key: item,
              value: item,
            }))}
        />
      </div>

      <div class="relative z-0 w-full mb-6 group">
        <Input bind:value={model.value} bind:errors={status.value.errors} placeholder="Value" label="Value" />
      </div>

      <div class="relative z-0 w-full mb-6 group">
        <DropDown
          placeholder="Select target"
          label="Target"
          bind:value={model.target}
          bind:errors={status.target.errors}
          values={fields
            .find((field) => field.varName === 'target')
            .ui.defaultValues.map((item) => ({
              key: item,
              value: item,
            }))}
        />
      </div>
    </div>

    <div class="flex flex-col items-center justify-center gap-y-4">
      <button on:click|preventDefault={() => (isRuleModalOpen = true)} class="bg-green-500 rounded p-2">Add rule</button
      >
      <ErrorMessage errors={ruleErrors} />
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
                      <span>Field</span>
                    </div>
                  </th>

                  <th
                    scope="col"
                    class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                  >
                    <div class="flex items-center gap-x-3">
                      <span>Operator</span>
                    </div>
                  </th>

                  <th
                    scope="col"
                    class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                  >
                    <div class="flex items-center gap-x-3">
                      <span>Value</span>
                    </div>
                  </th>

                  <th scope="col" class="relative py-3.5 px-4">
                    <span class="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                {#if loading}
                  <tr>
                    <td colspan="10" class="text-center py-10">
                      <Loading />
                    </td>
                  </tr>
                {/if}
                {#each model.rules as rule, ruleIndex}
                  <tr>
                    <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                      <div class="inline-flex items-center gap-x-3">
                        <input
                          type="checkbox"
                          class="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
                        />
                        <span class="hover:underline">
                          {rule.name}
                        </span>
                      </div>
                    </td>

                    <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                      <div class="inline-flex items-center gap-x-3">
                        <span class="hover:underline">
                          {rule.field}
                        </span>
                      </div>
                    </td>

                    <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                      <div class="inline-flex items-center gap-x-3">
                        <span class="hover:underline">
                          {rule.operator}
                        </span>
                      </div>
                    </td>

                    <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                      <div class="inline-flex items-center gap-x-3">
                        <span class="hover:underline">
                          {rule.value}
                        </span>
                      </div>
                    </td>

                    <td class="px-4 py-4 text-sm whitespace-nowrap">
                      <div class="flex items-center gap-x-6">
                        <button
                          title="Edit Rule"
                          on:click={() => {
                            isEditRuleModalOpen = true;
                            ruleData = rule;
                            editRuleIndex = ruleIndex;
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
                            model.rules = model.rules.filter((item, index) => index !== ruleIndex);
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </form>

  <div
    class="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600"
  >
    <div class="grid h-full max-w-lg grid-cols-1 mx-auto font-medium">
      {#if loading}
        <button
          class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
          <Loading />
        </button>
      {:else}
        <button
          on:click={() => onSubmitWithLoader(model)}
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
              d="M21 7v12q0 .825-.588 1.413T19 21H5q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h12l4 4Zm-9 11q1.25 0 2.125-.875T15 15q0-1.25-.875-2.125T12 12q-1.25 0-2.125.875T9 15q0 1.25.875 2.125T12 18Zm-6-8h9V6H6v4Z"
            /></svg
          >
          <span
            class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
            >Save</span
          >
        </button>
      {/if}
    </div>
  </div>

  <div class="w-full p-2 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    <Fields fields={secondaryFields} bind:model module="Page" itemId={model.uuid} />
  </div>
{/if}
