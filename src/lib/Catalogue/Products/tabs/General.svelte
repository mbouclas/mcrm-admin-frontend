<script lang="ts">
  import type { IDynamicFieldConfigBlueprint } from '../../../DynamicFields/types';
  import {
    Button,
    Toggle,
    Modal,
    NumberInput,
    Label,
    Sidebar,
    SidebarWrapper,
    SidebarGroup,
    SidebarItem, BottomNav, BottomNavItem
  } from 'flowbite-svelte';
  import Loading from '../../../Shared/Loading.svelte';
  import { Trash } from 'svelte-heros-v2';
  import {productSchema, ProductsService} from '../../services/products/products.service';
  import { ManufacturersService } from '../../services/manufacturers/manufacturers.service';
  import { navigate } from 'mcrm-svelte-navigator';
  import { type ISalesChannel, SalesChannelsService } from '../../../SalesChannels/services/sales-channels.service';
  import Card from "../../../Shared/card.svelte";
  import {ProductModel} from "../../models/product.model";
  import {ArrowUpRightFromSquareOutline, FileCheckOutline} from "flowbite-svelte-icons";
  import {onMount} from "svelte";
  import {AppService} from "../../../Shared/app.service";
  import Basic from './components/basic.svelte';
  import Pricing from './components/pricing.svelte';
  import Description from './components/description.svelte';
  import Taxonomy from './components/taxonomy.svelte';
  import Image from './components/image.svelte';
  import Inventory from './components/inventory.svelte';
  import Storefront from './components/storefront.svelte';
  import Purchasability from './components/purchasability.svelte';
  import Extra from './components/extras.svelte';
  import {ZodError} from "zod";
  import {formatZodErrors} from "../../../helpers/errors";

  const s = new ProductsService();

  let errors = {},
  ready = false;
  export let onSubmit: (model: ProductModel) => void;
  export let status: any = {};
  export let model = new ProductModel();


  const groupFields = AppService.getModel('ProductModel').fieldGroups;
  const allFields = AppService.getModel('ProductModel').fields;
  onMount(async () => {

    ready = true;
  });

  function getGroupFields(group: string) {
    const fs = groupFields.find((field) => field.name === group);
    if (!fs) {return  []}


    if (!Array.isArray(fs.fields)) {
      return [];
    }

    return fs.fields.map(f => {
      return allFields.find((field) => field.varName === f);
    });
  }

  async function toggleStatus() {
    model.active = !model.active;
  }

  export let fields: IDynamicFieldConfigBlueprint[] = [];

  let deleteProductModalOpen = false;



  function getField(name: string) {
    return fields.find((field) => field.varName === name);
  }


  const handleDeleteModalOpen = () => {
    deleteProductModalOpen = true;
  };

  const deletePage = async () => {
    await s.deleteRow(model.uuid);
    navigate('/catalogue/products/list');
  };


  function goToSection(event: Event) {
    event.preventDefault()
    const link = event.currentTarget
    const anchorId = new URL(link['href']).hash.replace('#', '')
    const anchor = document.getElementById(anchorId)
    window.scrollTo({
      top: anchor.offsetTop,
      behavior: 'smooth'
    })
  }

  async function save() {
    try {
      productSchema.parse(model)
    }
    catch (e) {
      if (e instanceof ZodError) {
        errors = formatZodErrors(e);
      }
      console.log(errors)
      return;
    }

    try {
      await new ProductsService().update(model.uuid, model);
    }
    catch (e) {
      console.log(e)
    }

  }

  async function onKeyPressed(e) {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();

      await save();
      return
    }
  }
</script>
<svelte:window on:keydown={onKeyPressed}/>
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

{#if !ready}
  <div class="flex justify-center">
    <Loading />
  </div>
{/if}

{#if ready}

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


  <form on:submit|preventDefault={save}>
  <div class="grid grid-cols-12 gap-2.5 my-4">
    <div class="lg:col-span-2 md:col-span-4">
  <Sidebar class="w-48 fixed">
    <SidebarWrapper>
      <SidebarGroup>
        <SidebarItem href={`#basic`} on:click={goToSection} label="Basic"></SidebarItem>
        <SidebarItem href={`#pricing`} on:click={goToSection} label="Pricing"></SidebarItem>
        <SidebarItem href={`#description`} on:click={goToSection} label="Descriptions"></SidebarItem>
        <SidebarItem href={`#taxonomy`} on:click={goToSection} label="Taxonomy"></SidebarItem>
        <SidebarItem href={`#image`} on:click={goToSection} label="Image"></SidebarItem>
        <SidebarItem href={`#inventory`} on:click={goToSection} label="Inventory"></SidebarItem>
        <SidebarItem href={`#storefront`} on:click={goToSection} label="Storefront"></SidebarItem>
        <SidebarItem href={`#purchasability`} on:click={goToSection} label="Purchasability"></SidebarItem>
        {#if getGroupFields('extras').length > 0}
        <SidebarItem href={`#extra`} on:click={goToSection} label="Extras"></SidebarItem>
          {/if}
      </SidebarGroup>
    </SidebarWrapper>
  </Sidebar>
    </div><!-- END LEFT SIDEBAR -->
    <div class="lg:col-span-10 md:col-span-8">
      <div class="my-4">
        <Card id="basic">
          <svelte:fragment slot="header">Basic Information</svelte:fragment>
          <Basic bind:model={model} bind:errors={errors} fields={getGroupFields('main')} />
        </Card>
      </div>

      <div class="my-4" id="pricing">
        <Card>
          <svelte:fragment slot="header">Pricing</svelte:fragment>
          <Pricing bind:model={model} bind:errors={errors} fields={getGroupFields('pricing')} />
        </Card>
      </div>

      <div class="my-4">
        <Card id="description">
          <svelte:fragment slot="header">Description</svelte:fragment>
          <Description bind:model={model} bind:errors={errors} fields={getGroupFields('descriptions')} />
        </Card>
      </div>

      <div class="my-4">
        <Card id="taxonomy">
          <svelte:fragment slot="header">Taxonomy (categories + tags + sales channels + manufacturer)</svelte:fragment>
          <Taxonomy bind:model={model} bind:errors={errors} />
        </Card>
      </div>

      <div class="my-4">
        <Card id="image">
          <svelte:fragment slot="header">Main Image</svelte:fragment>
          <Image bind:model={model} bind:errors={errors} onSave={save} />
        </Card>
      </div>

      <div class="my-4">
        <Card id="inventory">
          <svelte:fragment slot="header">Inventory</svelte:fragment>
          <Inventory bind:model={model} bind:errors={errors} fields={getGroupFields('inventory')} />
        </Card>
      </div>

      <div class="my-4">
        <Card id="storefront">
          <svelte:fragment slot="header">Storefront details</svelte:fragment>
          <Storefront bind:model={model} bind:errors={errors} fields={getGroupFields('storefront')} />
        </Card>
      </div>

      <div class="my-4">
        <Card id="purchasability">
          <svelte:fragment slot="header">Purchasability</svelte:fragment>
          <Purchasability bind:model={model} bind:errors={errors} fields={getGroupFields('purchasability')} />
        </Card>
      </div>

      {#if getGroupFields('extras').length > 0}
      <div class="my-4">
        <Card id="extra">
          <svelte:fragment slot="header">Extras</svelte:fragment>
          <Extra bind:model={model} bind:errors={errors} fields={getGroupFields('extras')} />
        </Card>
      </div>
        {/if}
  </div><!-- END RIGHT -->
  </div>

<div class="my-6">
  <BottomNav position="fixed" classInner="grid-cols-3">
    <BottomNavItem btnName="Save" type="submit">
      <FileCheckOutline class="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500"  />
    </BottomNavItem>

    <BottomNavItem btnName="Preview">
      <ArrowUpRightFromSquareOutline class="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500"  />
    </BottomNavItem>

    <BottomNavItem btnName="Delete">
      <Trash class="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500"  />
    </BottomNavItem>
  </BottomNav>
</div>
  </form>




{/if}
