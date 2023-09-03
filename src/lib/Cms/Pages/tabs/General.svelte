<script lang="ts">
  import type { IDynamicFieldConfigBlueprint } from '../../../DynamicFields/types';
  import Fields from '../../../DynamicFields/Renderer.svelte';
  import Loading from '../../../Shared/Loading.svelte';
  import Input from '../../../DynamicFields/fields/input.svelte';
  import Number from '../../../DynamicFields/fields/number-input.svelte';
  import RichText from '../../../DynamicFields/fields/richtext.svelte';
  import Image from '../../../DynamicFields/fields/image.svelte';
  import PageCategorySelector from '../PageCategorySelector.svelte';
  import Tags from '../PageCategoriesTags.svelte';

  export let fields: IDynamicFieldConfigBlueprint[] = [];
  export let model;
  let mainFields = [];
  let secondaryFields = [];

  export let onSubmit: (data: any) => void;

  // console.log(fields);

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

  function getField(name: string) {
    return fields.find((field) => field.varName === name);
  }

  function getSlug(e, value) {
    model.slug = value
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }

  function onCategorySelected(e) {}
</script>

{#if !model}<Loading /> {/if}
{#if model}
  <!--{JSON.stringify(model)}-->
  <!--{JSON.stringify(model.categories)}-->

  <form>
    <div class="grid md:grid-cols-2 md:gap-6">
      <div class="relative z-0 w-full mb-6 group">
        <Input
          bind:model={model.title}
          placeholder="Title"
          label="Title"
          onChange={getSlug}
          field={getField('title')}
        />
        <div class="relative z-0 w-full mb-6 group">
          <PageCategorySelector
            bind:model={model.pageCategory}
            label="Categories"
            pageId={model.uuid}
            saveOnSelect={true}
            on:selection={onCategorySelected}
          />
        </div>
      </div>
      <div class="w-full mb-6">
        <div class="flex justify-center w-full">
          <Image
            model={model.thumb}
            title="Main Image"
            maxNumberOfFiles={1}
            module="Page"
            itemId={model.uuid}
            type="main"
            on:allUploadsComplete={(e) => {
              model.thumb = e.detail;
            }}
          />
        </div>

        <div class="pt-6">
          <h3>Tags</h3>
          <Tags bind:model={model.tag} itemId={model.uuid} saveOnAction={true} />
        </div>
      </div>
    </div>

    <button type="submit" class="hidden">Submit</button>
  </form>

  <div
    class="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600"
  >
    <div class="grid h-full max-w-lg grid-cols-1 mx-auto font-medium">
      <button
        on:click={() => onSubmit(model)}
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
    </div>
  </div>

  <div class="w-full p-2 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    <Fields fields={secondaryFields} bind:model module="Page" itemId={model.uuid} />
  </div>
{/if}
