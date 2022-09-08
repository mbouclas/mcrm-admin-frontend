<script lang="ts">
  import { Modal, Button } from "flowbite-svelte";
  import { Tabs, Tab, TabList, TabPanel } from "svelte-tabs";
  import { Upload, PlusSm, Adjustments, ClipboardList } from "svelte-heros";
  import UploadImage from "./image-upload.svelte";
  import UrlInput from "./url-input.svelte";
  import type {
    IDynamicFieldConfigBlueprint,
    IDynamicFieldConfigImageSettingsBluePrint,
  } from "../../types";

  export let field: IDynamicFieldConfigBlueprint =
    {} as IDynamicFieldConfigBlueprint;
  export let options: IDynamicFieldConfigImageSettingsBluePrint =
    {} as IDynamicFieldConfigImageSettingsBluePrint;
  export let model;
  export let module;
  export let itemId;

  let defaultModal;

</script>

<Tabs>
  <TabList>
    <Tab>
      <Upload />
    </Tab>
    {#if options.addFromUrl}
    <Tab>
      <PlusSm />
    </Tab>
      {/if}
    {#if options.selectFromMediaLibrary}
    <Tab>
      <Adjustments />
    </Tab>
      {/if}
  </TabList>

  <TabPanel>
    <h2>
      <UploadImage {field} bind:model {options} {module} {itemId} />
    </h2>
  </TabPanel>

  {#if options.addFromUrl}
  <TabPanel>
    <UrlInput />
  </TabPanel>
    {/if}
  {#if options.selectFromMediaLibrary}
  <TabPanel>
    <div class="dynamic-field">
      <Button on:click={() => (defaultModal = true)}
        >Select from media library</Button
      >
    </div>
    <Modal title="Media Library" bind:open={defaultModal}>
      <p>content here...</p>
      <svelte:fragment slot="footer">
        <Button>Select</Button>
        <Button color="alternative">Cancel</Button>
      </svelte:fragment>
    </Modal>
  </TabPanel>
    {/if}
</Tabs>

<style global>
  .svelte-tabs__tab:focus {
    outline: none !important;
  }
  .svelte-tabs__tab-list {
    border: none !important;
  }
</style>
