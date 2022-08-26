<script lang="ts">
  import type { IDynamicFieldConfigBlueprint } from "../types";
  import { Label, Textarea, Helper } from "flowbite-svelte";
  import { onMount } from "svelte";
  export let field: IDynamicFieldConfigBlueprint;
  export let onChange;
  export let model;
  export let placeholder;
  export let label;
  export let helperText;
  export let inputId: string;
  export let classes: string[] = [];

  let pristine = true;
  let value = field.value || "";

  let Editor;

  onMount(async () => {});

  let onValueChange = (key, value) => {
    pristine = false;
    if (typeof onChange === "function") {
      onChange(key, value);
    }
  };
</script>

<div class="mb-6">
  {#if field.label}
    <Label for="success" class="block mb-2 !text-gray-400">{field.label}</Label>
  {/if}

  <Textarea
    label={""}
    bind:value={model}
    placeholder={field.placeholder}
    on:blur={(e) => {
      onValueChange(field.varName, e.currentTarget.value);
    }}
    on:keyup={(e) => {
      onValueChange(field.varName, e.currentTarget.value);
    }}
  />
  {#if helperText}
    <Helper>{helperText}</Helper>
  {/if}
</div>
