<script lang="ts">
  import type { IDynamicFieldConfigBlueprint } from '../../../DynamicFields/types';
  import Fields from '../../../DynamicFields/Renderer.svelte';
  import Loading from '../../../Shared/Loading.svelte';
  import { createEventDispatcher } from 'svelte';

  export let model;
  export let onSubmit: (data: any) => void;

  const onSubmitWithLoader = async (data) => {
    try {
      loading = true;
      await onSubmit(data);
    } finally {
      loading = false;
    }
  };

  let loading = false;
  const dispatch = createEventDispatcher();
  let fields: IDynamicFieldConfigBlueprint[] = [
    { type: 'text', varName: 'title', label: 'Title', placeholder: 'Title' },
    {
      type: 'text',
      varName: 'description',
      label: 'Description',
      placeholder: 'Description',
    },
    {
      type: 'text',
      varName: 'keywords',
      label: 'Keywords',
      placeholder: 'Keywords',
    },
    {
      type: 'text',
      varName: 'og_title',
      label: 'og_title',
      placeholder: 'og_title',
    },
    {
      type: 'text',
      varName: 'og_description',
      label: 'og_description',
      placeholder: 'og_description',
    },
  ];

  function handleModelChange(e) {
    model[e.detail.key] = e.detail.value;
    dispatch('change', model);
  }
</script>

<Fields {fields} bind:model module="Product" itemId={model.uuid} on:change={handleModelChange} />

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
        <span class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
          >Save</span
        >
      </button>
    {/if}
  </div>
</div>
