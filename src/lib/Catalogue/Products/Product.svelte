<script lang="ts">
  import {
    TabWrapper,
    TabHead,
    TabHeadItem,
    TabContentItem,
  } from "flowbite-svelte";
  import Gallery from "./tabs/Gallery.svelte";
  import SEO from "./tabs/SEO.svelte";

  import { useParams } from "svelte-navigator";
  import Form from "../../DynamicFields/Form.svelte";
  import Fields from "../../DynamicFields/Renderer.svelte";
  import { ProductsService } from "../services/products/products.service";
  import { Datepicker, Label, Helper } from "flowbite-svelte";
  import { onMount } from "svelte";
  import { AppService } from "../../Shared/app.service";
  import type { IDynamicFieldConfigBlueprint } from "../../DynamicFields/types";
  import Loading from "../../Shared/Loading.svelte";
  import getModelPrototypeFromFields from "../../helpers/model-prototype";

  import DateInput from "../../DynamicFields/fields/date-input.svelte";
  // import ImagePicker from "../../DynamicFields/fields/image-select.svelte";
  import Select from "../../DynamicFields/fields/select.svelte";
  import Checkbox from "../../DynamicFields/fields/checkbox.svelte";
  import Radio from "../../DynamicFields/fields/radio.svelte";
  import Toggle from "../../DynamicFields/fields/toggle.svelte";

  const s = new ProductsService();
  const params = useParams();
  let model;
  let fields: IDynamicFieldConfigBlueprint[] = [];
  let mainFields = [];
  let secondaryFields = [];
  export let itemId;

  onMount(async () => {
    fields = AppService.getModel("ProductModel").fields;

    if (itemId) {
      model = await s.findOne(itemId, ["*"]);
      model.thumb = {
        url: "https://res.cloudinary.com/businesslink/image/upload/v1662548134/rps/b3eaf906-a112-46c5-aeef-d5c125864b23.png",
      };
    } else {
      if ($params.id === "new") {
        model = getModelPrototypeFromFields(fields);
      } else {
        model = await s.findOne($params.id, ["*"]);
        model.thumb = {
          url: "https://res.cloudinary.com/businesslink/image/upload/v1662548134/rps/b3eaf906-a112-46c5-aeef-d5c125864b23.png",
        };
      }
    }
  });

  const onSubmit = (data) => {
    console.log("Submit", data);
  };

  let activeTabValue = 1;
  function handleTabClick(id) {
    activeTabValue = id;
  }

  let contentDivClass = "p-4 bg-[#2a3042] rounded-lg dark:bg-gray-800";
  let customActiveClass =
    "inline-block p-4 text-white rounded-t-lg border-b-2 border-white active dark:text-white-500 dark:border-white-500";
  let customInActiveClass =
    "inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300";
</script>

<TabWrapper
  tabStyle="underline"
  class="mb-4"
  bind:activeTabValue
  let:tabStyle
  let:tabId
>
  <TabHead {tabStyle} {tabId}>
    <TabHeadItem
      id={1}
      tabStyle="custom"
      {activeTabValue}
      {customActiveClass}
      {customInActiveClass}
      on:click={() => handleTabClick(1)}>Gallery</TabHeadItem
    >
    <TabHeadItem
      tabStyle="custom"
      {customActiveClass}
      {customInActiveClass}
      id={2}
      {activeTabValue}
      on:click={() => handleTabClick(2)}>SEO</TabHeadItem
    >
    <TabHeadItem
      tabStyle="custom"
      {customActiveClass}
      {customInActiveClass}
      id={3}
      {activeTabValue}
      on:click={() => handleTabClick(3)}>Files</TabHeadItem
    >
    <TabHeadItem
      tabStyle="custom"
      {customActiveClass}
      {customInActiveClass}
      id={4}
      {activeTabValue}
      on:click={() => handleTabClick(4)}>Items</TabHeadItem
    >
    <TabHeadItem
      tabStyle="custom"
      {customActiveClass}
      {customInActiveClass}
      id={5}
      {activeTabValue}
      on:click={() => handleTabClick(5)}>Variants</TabHeadItem
    >
    <TabHeadItem
      tabStyle="custom"
      {customActiveClass}
      {customInActiveClass}
      id={6}
      {activeTabValue}
      on:click={() => handleTabClick(6)}>Properties</TabHeadItem
    >
  </TabHead>
  <TabContentItem id={1} {activeTabValue} {contentDivClass}>
    <Gallery {fields} {model} {onSubmit} />
  </TabContentItem>
  <TabContentItem id={2} {activeTabValue} {contentDivClass}>
    <SEO {model} {onSubmit} />
  </TabContentItem>
  <TabContentItem id={3} {activeTabValue} {contentDivClass}>
    <p class="text-sm text-gray-500 dark:text-gray-400">Tab Content 3</p>
  </TabContentItem>
  <TabContentItem id={4} {activeTabValue} {contentDivClass}>
    <p class="text-sm text-gray-500 dark:text-gray-400">Tab Content 4</p>
  </TabContentItem>
  <TabContentItem id={5} {activeTabValue} {contentDivClass}>
    <p class="text-sm text-gray-500 dark:text-gray-400">Tab Content 5</p>
  </TabContentItem>
  <TabContentItem id={6} {activeTabValue} {contentDivClass}>
    <p class="text-sm text-gray-500 dark:text-gray-400">Tab Content 6</p>
  </TabContentItem>
</TabWrapper>
