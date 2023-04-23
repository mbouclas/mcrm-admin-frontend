<script lang="ts">
  import { onMount } from "svelte";
  import { Label } from "flowbite-svelte";
  import TextInput from "./fields/text-input.svelte";
  import DropDown from "./fields/dropdown.svelte";
  import Text from "./fields/text.svelte";
  import NumberInput from "./fields/number-input.svelte";
  import RichText from "./fields/richtext.svelte";
  import TextArea from "./fields/textarea.svelte";
  import DateInput from "./fields/date-input.svelte";
  import ImageSelect from "./fields/image-select/index.svelte";
  import type { IDynamicFieldConfigBlueprint } from "./types";

  export let model = {};
  export let onModelChange;
  export let rootModel;
  export let module;
  export let itemId;
  export let fields: IDynamicFieldConfigBlueprint[] = [];

  interface Rule {
    type: string;
    value: string;
  }

  interface Rules {
    must: Rule[];
  }

  const roleLevel = 99;

  const specialCharsIndex = (value, specialChars) => {
    for (const char of specialChars) {
      const index = value.indexOf(char);
      if (index !== -1) {
        return index;
      }
    }
    return -1;
  };

  const compare = (value1, specialChar, value2) => {
    if (specialChar === "=") {
      return value1 === value2;
    }

    if (specialChar === "<") {
      return value1 < value2;
    }

    if (specialChar === ">") {
      return value1 > value2;
    }

    return false;
  };

  const isValidForEdit = (field, model) => {
    //if (
    //  !field.editableRules ||
    //  (!field?.must?.length && !field?.should?.length)
    //) {
    //  return true;
    //}

    let rules: Rules = field.updateRules;
    let mustRules = rules?.must;
    if (!mustRules) {
      return true;
    }

    for (let i = 0; i < mustRules.length; i++) {
      const rule = mustRules[i];
      if (rule.type === "role") {
        if (rule.value > roleLevel) {
          return false;
        }
      }

      if (rule.type === "field") {
        const parsedValues = rule.value.split(",");

        for (let i = 0; i < parsedValues.length; i++) {
          const ruleValue = parsedValues[i];
          const specialChars = ["=", "<", ">"];

          const index = specialCharsIndex(ruleValue, specialChars);
          const specialChar = ruleValue[index];

          if (index === -1) {
            console.log("Invalid rule value");
            continue;
          }

          const firstValueKey = ruleValue.slice(0, index);
          const firstValue = model[firstValueKey];
          let secondValue = ruleValue.slice(index + 1);

          if (!isNaN(Number(secondValue))) {
            const isValid = compare(
              firstValue,
              specialChar,
              parseInt(secondValue)
            );

            if (!isValid) {
              return false;
            }
          } else {
            const isValid = compare(firstValue, specialChar, secondValue);

            if (!isValid) {
              return false;
            }
          }
        }
      }
    }

    return true;
  };

  $: sortedFields = fields.sort((a, b) => {
    if (
      typeof a.groupIndex !== "undefined" &&
      typeof b.groupIndex !== "undefined"
    ) {
      return a.groupIndex - b.groupIndex;
    }

    if (typeof a.groupIndex === "undefined") {
      return 1;
    }

    if (typeof b.groupIndex === "undefined") {
      return -1;
    }
  });
  $: console.log("sroted ", sortedFields, model);
</script>

{#each sortedFields as field}
  {#if field.type === "related"}
    <div class="pb-5">
      {#if field.label}
        <Label class={`block mb-2 !text-gray-400`}>{field.label}</Label>
      {/if}

      {#if field.isCollection}
        {#each model[field.varName] as subModel}
          <div class="p-3 bg-blue-500 bg-opacity-10">
            <svelte:self
              {itemId}
              {module}
              bind:model={subModel}
              {rootModel}
              fields={field.fields}
            />
          </div>
        {/each}
      {:else}
        <div class="p-3 bg-blue-500 bg-opacity-10">
          <svelte:self
            {itemId}
            {module}
            bind:model={model[field.varName]}
            {rootModel}
            fields={field.fields}
          />
        </div>
      {/if}
    </div>
  {/if}

  {#if (field.type === "json" || field.type === "nested") && field?.fields?.length}
    <div class="pb-5">
      {#if field.label}
        <Label class={`block mb-2 !text-gray-400`}>{field.label}</Label>
      {/if}

      <div class="p-3 bg-blue-500 bg-opacity-10">
        <svelte:self
          {itemId}
          {module}
          bind:model={model[field.varName]}
          {rootModel}
          fields={field.fields && field.fields.length
            ? field.fields.map((nestedField) => ({
                ...nestedField,
                updateRules: field.updateRules,
              }))
            : []}
        />
      </div>
    </div>
  {/if}

  {#if field.type === "text"}
    {#if isValidForEdit(field, rootModel || model)}
      <TextInput
        {field}
        bind:model={model[field.varName]}
        onChange={onModelChange}
      />
    {:else}
      <Text
        {field}
        bind:model={model[field.varName]}
        onChange={onModelChange}
      />
    {/if}
  {/if}

  {#if field.type === "number"}
    {#if field.ui && field.ui.component === "DropDown"}
      <DropDown
        {field}
        bind:model={model[field.varName]}
        onChange={onModelChange}
      />
    {:else if isValidForEdit(field, rootModel || model)}
      <NumberInput
        {field}
        bind:model={model[field.varName]}
        onChange={onModelChange}
      />
    {:else}
      <Text
        {field}
        bind:model={model[field.varName]}
        onChange={onModelChange}
      />
    {/if}
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
