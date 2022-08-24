<script lang="ts">
  import { onMount } from "svelte";
  import TextInput from "./fields/text-input.svelte";
  import NumberInput from "./fields/number-input.svelte";
  import TextArea from "./fields/textarea.svelte";
  import type { IDynamicFieldConfigBlueprint } from "./types";

  export let model = {};
  export let fields: IDynamicFieldConfigBlueprint = [];

  function onModelChange(key, value) {
    console.log(key, value);
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
    <TextArea
      {field}
      bind:model={model[field.varName]}
      onChange={onModelChange}
    />
  {/if}
{/each}
