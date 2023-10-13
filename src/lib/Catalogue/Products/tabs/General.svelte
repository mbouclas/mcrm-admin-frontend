<script lang="ts">
  import type { IDynamicFieldConfigBlueprint } from '../../../DynamicFields/types';
  import {Button, Toggle, Modal, Dropdown, Search, NumberInput, Label} from 'flowbite-svelte';
  import Fields from '../../../DynamicFields/Renderer.svelte';
  import Loading from '../../../Shared/Loading.svelte';
  import Input from '../../../Shared/Input.svelte';
  import ErrorMessage from '../../../Shared/ErrorMessage.svelte';
  import SalesChannelsSelector from '../../../SalesChannels/sales-channels-selector.svelte';
  import { Trash } from 'svelte-heros-v2';
  import RichText from '../../../DynamicFields/fields/richtext.svelte';
  import Image from '../../../DynamicFields/fields/image.svelte';
  import ProductCategorySelector from '../ProductCategorySelector.svelte';
  import Tags from '../ProductCategoriesTags.svelte';
  import { ProductsService } from '../../services/products/products.service';
  import { ManufacturersService } from '../../services/manufacturers/manufacturers.service';
  import { navigate } from 'mcrm-svelte-navigator';
  import { type ISalesChannel, SalesChannelsService } from '../../../SalesChannels/services/sales-channels.service';
  import DropDown from '../../../Shared/DropDown.svelte';

  const s = new ProductsService();
  const m = new ManufacturersService();

  export let onSubmit: (data: any) => void;
  export let status: any = {};

  let manufacturerDropDownOpen = false;
  let allManufacturers = [];

  let searchManufacturerText = '';

  $: manufacturers = searchManufacturerText
    ? allManufacturers.filter((item) => item?.title?.includes(searchManufacturerText))
    : allManufacturers;

  const getManufacturers = async () => {
    let data = await m.find();
    allManufacturers = data.data;
  };

  const setManufacturer = (manufacturer) => {
    model.manufacturer = manufacturer;
    manufacturerDropDownOpen = false;
  };

  const onSubmitWithLoader = async (data) => {
    try {
      loading = true;
      await onSubmit(data);
    } finally {
      loading = false;
    }
  };

  async function toggleStatus() {
    const newActive = !model.active;
    await s.update(model.uuid, { active: newActive });
    model.active = newActive;
  }

  export let fields: IDynamicFieldConfigBlueprint[] = [];
  export let model;
  let mainFields = [];
  let secondaryFields = [];
  let deleteProductModalOpen = false;
  let loading = false;

  $: {
    fields.forEach((field) => {
      if (!field.group || field.group === 'main') {
        mainFields.push(field);
      }
      if (field.group === 'extra') {
        secondaryFields.push(field);
      }
    });
  }

  function getField(name: string) {
    return fields.find((field) => field.varName === name);
  }

  function getSlug(e, value) {
    model.slug = value
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }

  const handleDeleteModalOpen = () => {
    deleteProductModalOpen = true;
  };

  const deletePage = async () => {
    await s.deleteRow(model.uuid);
    navigate('/catalogue/products/list');
  };

  async function saveSalesChannel(channels: ISalesChannel[], itemId: string) {
    await new SalesChannelsService().sync(channels, itemId, 'Product');
  }
</script>

<Modal title="Confirm delete product" bind:open={deleteProductModalOpen} autoclose outsideclose>
  <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
    Are you sure you want to <span class="text-lg font-bold">permanently delete</span>
    product
    <span class="text-lg font-bold">{model.title}</span>?
  </p>
  <svelte:fragment slot="footer">
    <Button on:click={() => deletePage()}>Confirm</Button>
    <Button color="alternative">Cancel</Button>
  </svelte:fragment>
</Modal>

{#if !model}<Loading /> {/if}
{#if model}
  {#if model.uuid}
    <div class="flex w-full pb-5 pr-3 justify-end">
      <div class="flex items-center w-20">
        <span
          >Status<span>
            <Toggle on:click={(e) => toggleStatus()} color="green" checked={model.active} />
          </span></span
        >
      </div>

      {#if true}
        <button on:click={() => handleDeleteModalOpen()} class="text-gray-500"><Trash color="white" /></button>
      {/if}
    </div>
  {/if}

  <form>
    <div class="grid md:grid-cols-2 md:gap-6">
      <div class="relative z-0 w-full mb-6 group">
        <div class="grid md:grid-cols-2 md:gap-6 my-4">
          <div class="relative z-0 w-full mb-6 group">
            <Input bind:value={model.title} bind:errors={status.title.errors} placeholder="Title" label="Title" />
          </div>

          <div class="relative z-0 w-full mb-6 group">
            <Input bind:value={model.sku} bind:errors={status.sku.errors} placeholder="SKU" label="SKU" />
          </div>
          </div>
        <div class="grid md:grid-cols-2 md:gap-6 my-4">
          <div class="relative z-0 w-full mb-6 group">
            <Label>Price</Label>
            <NumberInput bind:value={model.price} min="0"  placeholder="Price" label="Price" />
          </div>
          <div class="relative z-0 w-full mb-6 group">
            <Label>Sale Price</Label>
            <NumberInput
              bind:value={model.salePrice}
              bind:errors={status.price.errors}
              min="0"
            />
          </div>
        </div>
        <div class="relative z-0 w-full mb-6 group">
          <ProductCategorySelector
            bind:model={model.productCategory}
            label="Categories"
            productId={model.uuid}
            saveOnSelect={false}
          />
        </div>
      </div>
      <div class="w-full mb-6">
        <div class="flex justify-center w-full">
          <Image
            model={model.thumb}
            title="Main Image"
            maxNumberOfFiles={1}
            module="Product"
            itemId={model.uuid}
            type="main"
            on:allUploadsComplete={(e) => {
              model.thumb = e.detail;
            }}
          />
        </div>

        <div class="pt-6">
          <h3>Tags</h3>
          <Tags bind:model={model.tag} itemId={model.uuid} saveOnAction={false} />
        </div>

        <div class="pt-6">
          {#if model}
            <DropDown
              on:opened={(e) => {
                const opened = e.detail;
                if (opened) {
                  getManufacturers();
                }
              }}
              placeholder="Select manufacturer"
              label="Manufacturers"
              bind:searchText={searchManufacturerText}
              bind:value={model.manufacturer}
              bind:key={model.manufacturer.title}
              values={manufacturers.map((item) => ({
                key: item.title,
                value: item,
              }))}
            />
          {/if}
        </div>
        <div class="my-6">
          <SalesChannelsSelector
            model={model.salesChannel}
            itemId={model.uuid}
            saveOnSelect={true}
            onSave={saveSalesChannel}
          />
        </div>
      </div>
    </div>

    <div class="relative z-0 w-full mb-6 group">
      <RichText id="description" bind:model={model.description} field={getField('description')} />
      <ErrorMessage errors={status.description.errors} />
    </div>

    <div class="relative z-0 w-full mb-6 group">
      <RichText id="description_long" bind:model={model.description_long} field={getField('description_long')} />
    </div>
  </form>

  <div
    class="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600"
  >
    <div class="grid h-full max-w-lg grid-cols-1 mx-auto font-medium">
      {#if loading}
        <button
          class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
          <Loading />
        </button>
      {:else}
        <button
          on:click={() =>
            onSubmitWithLoader({
              ...model,
              price: parseFloat(model.price),
            })}
          type="button"
          class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
          <svg
            class="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            ><path
              fill="currentColor"
              d="M21 7v12q0 .825-.588 1.413T19 21H5q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h12l4 4Zm-9 11q1.25 0 2.125-.875T15 15q0-1.25-.875-2.125T12 12q-1.25 0-2.125.875T9 15q0 1.25.875 2.125T12 18Zm-6-8h9V6H6v4Z"
            /></svg
          >
          <span
            class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
            >Save</span
          >
        </button>
      {/if}
    </div>
  </div>

  <div class="w-full p-2 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    <Fields fields={secondaryFields} bind:model module="Product" itemId={model.uuid} />
  </div>
{/if}
