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

  let defaultModal;
</script>

<Tabs>
  <TabList>
    <Tab>
      <Upload />
    </Tab>
    <Tab>
      <PlusSm />
    </Tab>
    <Tab>
      <Adjustments />
    </Tab>
  </TabList>

  <TabPanel>
    <h2>
      <UploadImage {field} bind:model {options} />
    </h2>
  </TabPanel>

  <TabPanel>
    <UrlInput />
  </TabPanel>

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
</Tabs>

<style global>
  .svelte-tabs__tab:focus {
    outline: none !important;
  }
  .svelte-tabs__tab-list {
    border: none !important;
  }
</style>
