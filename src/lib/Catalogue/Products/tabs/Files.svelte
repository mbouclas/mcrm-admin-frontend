<script lang="ts">
  import { Confirm } from "svelte-confirm";
  import type { IDynamicFieldConfigBlueprint } from "../../../DynamicFields/types";
  import ImageSelect from "../../../DynamicFields/fields/image-select/index.svelte";

  export let model;
  let imageSettings = {
    multiple: false,
    accept: "image/*",
    addFromUrl: true,
    selectFromMediaLibrary: true,
    showPreview: true,
    width: 250,
    height: 250,
    defaultCopy: "thumb",
    maxFileSize: 5000,
    quality: 70,
  };
</script>

<ImageSelect options={imageSettings} />
