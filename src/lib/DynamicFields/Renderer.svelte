<script lang="ts">
  import { onMount } from "svelte";
  import { Label } from "flowbite-svelte";
  import TextInput from "./fields/text-input.svelte";
  import NumberInput from "./fields/number-input.svelte";
  import RichText from "./fields/richtext.svelte";
  import TextArea from "./fields/textarea.svelte";
  import DateInput from "./fields/date-input.svelte";
  import ImageSelect from "./fields/image-select/index.svelte";
  import type { IDynamicFieldConfigBlueprint } from "./types";
  import { createEventDispatcher } from "svelte";

  export let model = {};
  export let module;
  export let itemId;
  export let fields: IDynamicFieldConfigBlueprint[] = [];
  const dispatch = createEventDispatcher();

  function onModelChange(key, value) {
    dispatch("change", { key, value });
    console.log(key, value);
    // console.log(typeof value);
  }

  $: console.log("field", fields);
</script>

{#each fields as field}
  {#if field.type === "json" || field.type === "nested"}
    <div class="pb-5">
      {#if field.label}
        <Label class={`block mb-2 !text-gray-400`}>{field.label}</Label>
      {/if}

      <div class="p-3 bg-blue-500 bg-opacity-10">
        <svelte:self
          {itemId}
          {module}
          bind:model={model[field.varName]}
          fields={field.fields}
        />
      </div>
    </div>
  {/if}

  {#if field.type === "text"}
    <TextInput
      {field}
      bind:model={model[field.varName]}
      onChange={onModelChange}
    />
  {/if}

  {#if field.type === "number"}
    <NumberInput
      {field}
      bind:model={model[field.varName]}
      onChange={onModelChange}
    />
  {/if}

  {#if field.type === "richText"}
    <RichText
      {field}
      bind:model={model[field.varName]}
      onChange={onModelChange}
    />
  {/if}

  {#if field.type === "date"}
    <DateInput
      {field}
      bind:model={model[field.varName]}
      onChange={onModelChange}
    />
  {/if}

  {#if field.type === "image"}
    <ImageSelect
      {module}
      {itemId}
      {field}
      options={field.imageSettings}
      bind:model={model[field.varName]}
      onChange={onModelChange}
    />
  {/if}
{/each}
