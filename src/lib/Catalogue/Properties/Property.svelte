<script lang="ts">
  import {
    TabWrapper,
    TabHead,
    TabHeadItem,
    TabContentItem,
    Button,
  } from "flowbite-svelte";
  import General from "./tabs/General.svelte";

  import { useParams } from "svelte-navigator";
  import Form from "../../DynamicFields/Form.svelte";
  import Fields from "../../DynamicFields/Renderer.svelte";
  import { PropertiesService } from "../services/properties/properties.service";
  import { Datepicker, Label, Helper } from "flowbite-svelte";
  import { onMount } from "svelte";
  import { AppService } from "../../Shared/app.service";
  import type { IDynamicFieldConfigBlueprint } from "../../DynamicFields/types";
  import getModelPrototypeFromFields from "../../helpers/model-prototype";
  import { setNotificationAction } from "../../../lib/stores";

  const s = new PropertiesService();
  const params = useParams();
  let model;
  let fields: IDynamicFieldConfigBlueprint[] = [];
  export let itemId;
  let relationships: any[] = [];

  onMount(async () => {
    let rawModel = AppService.getModel("PropertyModel");
    fields = rawModel.fields;
    relationships = rawModel.relationships;

    const typeIndex = fields.findIndex((field) => field.varName === "type");

    fields[typeIndex].ui.values = fields[typeIndex].ui.defaultValues.map(
      (value) => ({ label: value, value })
    );

    if ($params.id === "new") {
      Object.keys(relationships)
        .filter(
          (relationshipKey) =>
            relationships[relationshipKey].tabs &&
            relationships[relationshipKey].tabs.includes("General")
        )
        .map((relationshipKey) => {
          let relationshipData = relationships[relationshipKey];
          const relationshipFields = relationshipData.fields.filter(
            (field) => field.group !== "hidden"
          );

          const isCollection = relationshipData.isCollection || true;

          fields = [
            ...fields,
            {
              varName: relationshipKey,
              label: relationshipData.model,
              placeholder: relationshipKey,
              type: "related_create",
              isSortable: true,
              isCollection,
              group: "bottom",
              fields: relationshipFields,
            },
          ];
        });
    }

    if ($params.id !== "new") {
      Object.keys(relationships)
        .filter(
          (relationshipKey) =>
            relationships[relationshipKey].tabs &&
            relationships[relationshipKey].tabs.includes("General")
        )
        .map((relationshipKey) => {
          let relationshipData = relationships[relationshipKey];

          const relationshipFields = relationshipData.fields.filter(
            (field) => field.group !== "hidden"
          );

          fields = [
            ...fields,
            {
              varName: relationshipData.modelAlias,
              label: relationshipData.model,
              placeholder: relationshipData.model,
              type: "related_create",
              isSortable: true,
              isCollection: relationshipData.isCollection || true,
              group: "bottom",
              fields: relationshipFields,
            },
          ];
        });
    }
    if (itemId) {
      model = await s.findOne(itemId, ["*"]);
    } else {
      if ($params.id === "new") {
        model = getModelPrototypeFromFields(fields);
      } else {
        model = await s.findOne($params.id, ["*"]);
      }
    }

    if (!model.seo) {
      model.seo = {
        title: model.title,
        description: model.description,
        keywords: "",
        og_title: "",
        og_description: "",
      };
    }
  });

  const onSubmit = async (data) => {
    if ($params.id === "new") {
      await s.store(data).then(res=>{
        if(res.success){
          setNotificationAction({message:"Created successfully", type:"success"})
        } else {
          setNotificationAction({message:"Failed to create", type:"error"})
        } 
      });
      return null;
    }

    await s.update($params.id, data)
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
    //if (e.currentTarget.checkValidity() && onSubmit && validateModel()) {
    onSubmit(model);

    //}
  }
</script>

<!-- {JSON.stringify(model)} -->

<!-- <Modals /> -->

<Form bind:model {hasError}>
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
      <li class="submit-button-wrapper">
        <Button type="submit" on:click={onNativeSubmit}>Submit</Button>
      </li>
    </TabHead>
    <TabContentItem id={1} {activeTabValue} {contentDivClass}>
      <General {fields} {model} />
    </TabContentItem>
  </TabWrapper>
</Form>

<style>
  .submit-button-wrapper {
    line-height: 54px;
    margin-left: auto;
  }
</style>
