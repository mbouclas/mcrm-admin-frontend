<script lang="ts">
  import {
    TabWrapper,
    TabHead,
    TabHeadItem,
    TabContentItem,
    Button,
  } from "flowbite-svelte";
  import General from "./tabs/General.svelte";
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
    // if (!model.seo) {
    //   model.seo = {
    //     title: model.title,
    //   };
    // }
    model = {
      createdAt: "2022-08-08T07:36:55.023Z",
      quantity: 0,
      fromImport: true,
      price: 2.14,
      active: true,
      sku: "1020",
      title: "Cretus",
      uuid: "bf362f75-1992-4cc4-a4b4-543ff714b1bc",
      slug: "cretus",
      updatedAt: "2022-08-09T05:28:22.785Z",
      variants: [],
      productCategory: [],
      categoryFilter: [],
      owner: [],
      tag: [],
      tagCount: 0,
      property: [],
      propertyValue: [],
      extraField: [],
      editor: [
        {
          model: null,
          relationship: null,
        },
      ],
      cart: [],
      images: [
        {
          createdAt: "2022-09-12T06:25:40.616Z",
          active: true,
          uuid: "3cab47bb-6e28-4543-8289-95b770fb7663",
          url: "https://res.cloudinary.com/businesslink/image/upload/v1662548134/rps/b3eaf906-a112-46c5-aeef-d5c125864b23.png",
          updatedAt: "2022-09-12T06:25:40.632Z",
          type: "main",
        },
        {
          createdAt: "2022-09-12T06:23:54.151Z",
          active: true,
          uuid: "79786d3a-b646-4128-abfc-58514f5b20d7",
          url: "https://res.cloudinary.com/businesslink/image/upload/v1662548134/rps/b3eaf906-a112-46c5-aeef-d5c125864b23.png",
          updatedAt: "2022-09-12T06:23:54.162Z",
          type: null,
        },
        {
          createdAt: "2022-09-12T06:21:14.953Z",
          active: true,
          uuid: "95cf6c79-e6d2-4cfe-9d88-8c6db79e9ffd",
          url: "https://res.cloudinary.com/businesslink/image/upload/v1662548134/rps/b3eaf906-a112-46c5-aeef-d5c125864b23.png",
          updatedAt: "2022-09-12T06:21:14.965Z",
          type: null,
        },
        {
          createdAt: "2022-09-12T06:13:55.599Z",
          active: true,
          uuid: "6fa6ece8-0076-4838-9aa0-abf1475fef76",
          url: "https://res.cloudinary.com/businesslink/image/upload/v1662548134/rps/b3eaf906-a112-46c5-aeef-d5c125864b23.png",
          updatedAt: "2022-09-12T06:13:55.612Z",
          type: null,
        },
        {
          createdAt: "2022-09-12T06:11:05.982Z",
          active: true,
          uuid: "c99b90fc-119d-4eab-aea4-0223d7ba32ed",
          url: "https://res.cloudinary.com/businesslink/image/upload/v1662548134/rps/b3eaf906-a112-46c5-aeef-d5c125864b23.png",
          updatedAt: "2022-09-12T06:11:06.000Z",
          type: null,
        },
      ],
      thumb: {
        createdAt: "2022-09-12T06:25:40.616Z",
        active: true,
        uuid: "3cab47bb-6e28-4543-8289-95b770fb7663",
        url: "https://res.cloudinary.com/businesslink/image/upload/v1662548134/rps/b3eaf906-a112-46c5-aeef-d5c125864b23.png",
        updatedAt: "2022-09-12T06:25:40.632Z",
        type: "main",
      },
    };
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

  //We need this to reflect model changes that are not passed down the event bubble
  function handleModelChange(key: string, e) {
    model[key] = e.detail;
  }

  import isEmpty from "../../helpers/isEmpty";
  import Gallery from "./tabs/Gallery.svelte";
  import { Modals } from "svelte-modals";

  let errors = {};
  let hasError = false;

  function validateModel() {
    Object.keys(model).map((key) => {
      if (isEmpty(model[key])) {
        hasError = true;
        errors[key] = true;
      } else {
        errors[key] = false;
      }
    });

    return !hasError;
  }

  function onNativeSubmit(e) {
    e.preventDefault();
    if (e.currentTarget.checkValidity() && onSubmit && validateModel()) {
      onSubmit(model);
    }
  }
</script>

<!-- {JSON.stringify(model)} -->

<!-- <Modals /> -->

<Form {onSubmit} withSubmit bind:model {onNativeSubmit} {hasError}>
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
        on:click={() => handleTabClick(1)}>General</TabHeadItem
      >
      <TabHeadItem
        id={2}
        tabStyle="custom"
        {activeTabValue}
        {customActiveClass}
        {customInActiveClass}
        on:click={() => handleTabClick(2)}>Gallery</TabHeadItem
      >
      <TabHeadItem
        tabStyle="custom"
        {customActiveClass}
        {customInActiveClass}
        id={3}
        {activeTabValue}
        on:click={() => handleTabClick(3)}>SEO</TabHeadItem
      >
      <TabHeadItem
        tabStyle="custom"
        {customActiveClass}
        {customInActiveClass}
        id={4}
        {activeTabValue}
        on:click={() => handleTabClick(4)}>Files</TabHeadItem
      >
      <TabHeadItem
        tabStyle="custom"
        {customActiveClass}
        {customInActiveClass}
        id={5}
        {activeTabValue}
        on:click={() => handleTabClick(5)}>Items</TabHeadItem
      >
      <TabHeadItem
        tabStyle="custom"
        {customActiveClass}
        {customInActiveClass}
        id={6}
        {activeTabValue}
        on:click={() => handleTabClick(6)}>Variants</TabHeadItem
      >
      <TabHeadItem
        tabStyle="custom"
        {customActiveClass}
        {customInActiveClass}
        id={7}
        {activeTabValue}
        on:click={() => handleTabClick(7)}>Properties</TabHeadItem
      >
      <li class="submit-button-wrapper">
        <Button type="submit" on:click={onNativeSubmit}>Submit</Button>
      </li>
    </TabHead>
    <TabContentItem id={1} {activeTabValue} {contentDivClass}>
      <General {fields} {model} {onSubmit} />
    </TabContentItem>
    <TabContentItem id={2} {activeTabValue} {contentDivClass}>
      <Gallery {model} />
    </TabContentItem>
    <TabContentItem id={3} {activeTabValue} {contentDivClass}>
      <SEO
        model={model.seo}
        {onSubmit}
        on:change={handleModelChange.bind(this, "seo")}
      />
    </TabContentItem>
    <TabContentItem id={4} {activeTabValue} {contentDivClass}>
      <p class="text-sm text-gray-500 dark:text-gray-400">Tab Content 3</p>
    </TabContentItem>
    <TabContentItem id={5} {activeTabValue} {contentDivClass}>
      <p class="text-sm text-gray-500 dark:text-gray-400">Tab Content 4</p>
    </TabContentItem>
    <TabContentItem id={6} {activeTabValue} {contentDivClass}>
      <p class="text-sm text-gray-500 dark:text-gray-400">Tab Content 5</p>
    </TabContentItem>
    <TabContentItem id={7} {activeTabValue} {contentDivClass}>
      <p class="text-sm text-gray-500 dark:text-gray-400">Tab Content 6</p>
    </TabContentItem>
  </TabWrapper>
</Form>

<style>
  .submit-button-wrapper {
    line-height: 54px;
    margin-left: auto;
  }
</style>
