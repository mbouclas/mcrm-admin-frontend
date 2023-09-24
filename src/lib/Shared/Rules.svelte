<script>
  import { Button } from 'flowbite-svelte';
  import DropDown from './DropDown.svelte';
  import Input from './Input.svelte';
  import Modal from './Modal.svelte';
  import ErrorMessage from './ErrorMessage.svelte';
  import Loading from './Loading.svelte';

  export let model;
  export let loading;
  export let status = {};

  let ruleErrors = [];
  let isRuleModalOpen = false;
  let isEditRuleModalOpen = false;
  let editRuleIndex;

  $: ruleErrors = getRuleErrors(model, status);

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

  const defaultRuleData = {
    name: '',
    field: '',
    operator: '',
    value: '',
  };

  let ruleData = { ...defaultRuleData };

  const handleAddRule = () => {
    ruleData = { ...defaultRuleData };
    isRuleModalOpen = true;
  };

  const confirmRuleAdd = () => {
    model = [...model, ruleData];
    isRuleModalOpen = false;
  };

  const cancelRuleAdd = () => {
    isRuleModalOpen = false;
  };

  const confirmRuleEdit = () => {
    model[editRuleIndex] = ruleData;
    editRuleIndex = null;
    isEditRuleModalOpen = false;
  };

  const cancelRuleEdit = () => {
    editRuleIndex = null;
    isEditRuleModalOpen = false;
  };
</script>

<Modal className="w-full max-w-3xl" bind:showModal={isRuleModalOpen}>
  <h2 slot="header" class="flowbite-modal-title mb-4 text-xl font-bold">Add rule</h2>
  <div slot="content">
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

  <div slot="footer">
    <Button color="blue" on:click={confirmRuleAdd}>Add</Button>
    <Button color="alternative" on:click={cancelRuleAdd}>Cancel</Button>
  </div>
</Modal>

<Modal className="w-full max-w-3xl" bind:showModal={isEditRuleModalOpen}>
  <h2 slot="header" class="flowbite-modal-title mb-4 text-xl font-bold">Edit rule</h2>
  <div slot="content">
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
  <div slot="footer">
    <Button color="blue" on:click={confirmRuleEdit}>Save edit</Button>
    <Button color="alternative" on:click={cancelRuleEdit}>Cancel</Button>
  </div>
</Modal>

<div class="flex flex-col items-center justify-center gap-y-4">
  <button on:click|preventDefault={handleAddRule} class="bg-green-500 rounded p-2">Add rule</button>
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
            {#each model as rule, ruleIndex}
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
                        model = model.filter((item, index) => index !== ruleIndex);
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
