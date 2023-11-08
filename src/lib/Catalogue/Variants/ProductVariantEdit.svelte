<script lang="ts">
    import {createEventDispatcher, onMount} from "svelte";
    import type {ProductVariantModel} from "../models/product-variant.model";
    import {basicVariantsSchema, VariantsService} from "../services/variants/variants.service";
    import Pricing from "../Products/tabs/components/pricing.svelte";
    import Card from "../../Shared/card.svelte";
    import {AppService} from "../../Shared/app.service";
    import Description from "../Products/tabs/components/description.svelte";
    import Image from "../Products/tabs/components/image.svelte";
    import Inventory from "../Products/tabs/components/inventory.svelte";
    import Extra from "../Products/tabs/components/extras.svelte";
    import Purchasability from "../Products/tabs/components/purchasability.svelte";
    import {FileCheckOutline} from "flowbite-svelte-icons";
    import {Trash} from "svelte-heros-v2";
    import {BottomNav, BottomNavItem} from "flowbite-svelte";
    import Main from './components/basic-fields.svelte';
    import {ZodError} from "zod";
    import {formatZodErrors} from "../../helpers/errors";

    const dispatch = createEventDispatcher();

    export let uuid: string;
    export let onSave: (model: ProductVariantModel) => void;
    let model: ProductVariantModel;
    let ready = false;
    let errors = {};

    const groupFields = AppService.getModel('ProductVariantModel').fieldGroups;
    const allFields = AppService.getModel('ProductVariantModel').fields;

    onMount(async () => {
        model = await new VariantsService().findOne(uuid, ['*']);

        ready = true;
    })

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

    async function save() {
        errors = {};
        try {
            basicVariantsSchema.parse(model);
        }
        catch (e) {
            if (e instanceof ZodError) {
                errors = formatZodErrors(e);
            }
            console.log(errors)
            return;
        }

        await new VariantsService().update(uuid, model);

        if (onSave) {
            onSave(model);
        }

        dispatch('saved', model);
    }


    async function onKeyPressed(e) {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();

            await save();
            return
        }
    }
</script>
{#if ready}
    <form on:submit|preventDefault={save}>

        <div class="lg:col-span-10 md:col-span-8">
            <div class="my-4" id="Basic Information">
                <Card>
                    <svelte:fragment slot="header">Basic Information</svelte:fragment>
                    <Main bind:model={model} bind:errors={errors} fields={getGroupFields('main')} />
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


    </div>

    <div class="my-6">
        <BottomNav position="fixed" classInner="grid-cols-2">
            <BottomNavItem btnName="Save" type="submit">
                <FileCheckOutline class="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500"  />
            </BottomNavItem>


            <BottomNavItem btnName="Delete">
                <Trash class="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500"  />
            </BottomNavItem>
        </BottomNav>
    </div>
    </form>
{/if}
