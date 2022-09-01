<script lang="ts">
  import CKEditor from "ckeditor5-svelte";
  import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document/build/ckeditor";

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

  let hasError = false;

  let editor = DecoupledEditor;
  let editorInstance = null;
  let editorConfig = {
    toolbar: {
      items: [
        "heading",
        "|",
        "fontFamily",
        "fontSize",
        "bold",
        "italic",
        "underline",
      ],
    },
  };

  function onReady({ detail: editor }) {
    // Insert the toolbar before the editable area.
    editorInstance = editor;
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
  }

  let onValueChange = (key) => {
    if (model === "") {
      hasError = true;
      helperText = "This field is required";
    } else {
      hasError = false;
      helperText = null;
    }
    pristine = false;
    if (typeof onChange === "function") {
      onChange(key, model);
    }
  };
</script>

<div class="mb-6">
  {#if field.label}
    <Label class={`block mb-2 !text-gray-400 ${hasError ? "has-error" : ""}`}>
      {field.label}
    </Label>
  {/if}

  <div class={`dynamic-field ${hasError ? "has-error" : ""}`}>
    <CKEditor
      bind:editor
      on:ready={onReady}
      bind:config={editorConfig}
      bind:value={model}
      bind:placeholder={field.placeholder}
      on:blur={(e) => {
        onValueChange(field.varName);
      }}
      on:input={(e) => {
        onValueChange(field.varName);
      }}
    />
  </div>
  {#if helperText}
    <Helper class={hasError ? "helper-text has-error" : "helper-text"}>
      {helperText}
    </Helper>
  {/if}
</div>

<style global>
  .dynamic-field {
    background-color: #2e3446 !important;
    border: 1px solid #32394e !important;
    color: #bfc8e2 !important;
    outline: none !important;
    box-shadow: none !important;
  }

  .dynamic-field .ck-toolbar {
    border: 1px solid #32394e !important;
    background-color: #00000052;
  }

  .dynamic-field .ck-content:focus {
    background-color: #303648 !important;
    border: 1px solid #32394e !important;
    color: #bfc8e2 !important;
    outline: none !important;
    box-shadow: none !important;
  }

  .dynamic-field.has-error {
    background-color: #ff000011 !important;
    border: 1px solid #970000 !important;
  }
</style>
