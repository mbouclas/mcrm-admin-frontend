<script lang="ts">
  import { onMount } from "svelte";
  import TextInput from "./fields/text-input.svelte";
  import NumberInput from "./fields/number-input.svelte";
  import RichText from "./fields/richtext.svelte";
  import TextArea from "./fields/textarea.svelte";
  import DateInput from "./fields/date-input.svelte";
  import ImageSelect from "./fields/image-select/index.svelte";
  import type { IDynamicFieldConfigBlueprint } from "./types";

  export let model = {};
  export let fields: IDynamicFieldConfigBlueprint[] = [];

  function onModelChange(key, value) {
    console.log(key, value);
    // console.log(typeof value);
  }
</script>

{#each fields as field}
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
      {field}
      options={field.imageSettings}
      bind:model={model[field.varName]}
      onChange={onModelChange}
    />
  {/if}
{/each}
