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
  import { createEventDispatcher } from "svelte";

  export let model = {};
  export let module;
  export let itemId;
  export let fields: IDynamicFieldConfigBlueprint[] = [];

  const dispatch = createEventDispatcher();

  interface Rule {
    type: string;
    value: string;
  }

  interface Rules {
    must: Rule[];
  }

  function onModelChange(key, value) {
    dispatch("change", { key, value });
    console.log(key, value);
    // console.log(typeof value);
  }

  const role = "ADMIN";

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
        if (rule.value !== role) {
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

            console.log({
              firstValue,
              specialChar,
              sv: parseInt(secondValue),
              isValid,
            });

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
</script>

{#each fields as field}
  {#if field.type === "related"}
    <div class="pb-5">
      {#if field.label}
        <Label class={`block mb-2 !text-gray-400`}>{field.label}</Label>
      {/if}

      {#each model[field.varName] as subModel}
        <div class="p-3 bg-blue-500 bg-opacity-10">
          <svelte:self
            {itemId}
            {module}
            bind:model={subModel}
            fields={field.fields}
          />
        </div>
      {/each}
    </div>
  {/if}

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
    {#if isValidForEdit(field, model)}
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
    {:else if isValidForEdit(field, model)}
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
