<script lang="ts">
    import {
        salesChannelItemSelectorConfig
    } from "../../../Shared/item-selector-configs";
    import {Badge, Button, Heading, Helper, Radio, StepIndicator} from "flowbite-svelte";
    import ItemSelector from "../../../DynamicFields/fields/item-selector.svelte";
    import {ProductsService} from "../../services/products/products.service";
    import {createEventDispatcher} from "svelte";
    const dispatch = createEventDispatcher();
    let currentStep = 1;
    let steps = ['Step 1', 'Step 2','Finalize'];
    let handleType = 'replace';
    let skipUuids = [];
    let selectedItem = null;
    let selectedItems = [];
    const config = salesChannelItemSelectorConfig;
    const selectMode = 'multiple';
    export let uuids = [];
    function onSelect(e) {
        const item = e.detail;
    }

    function onRemove(item) {
        const temp = [...selectedItems];
        const foundIdx = temp.findIndex(i => i.uuid === item.uuid);

        if (foundIdx === -1) {
            return;
        }


        temp.splice(foundIdx, 1);
        selectedItems = temp;
    }

    async function finalize() {
        const data = uuids.map(uuid => {
            return {
                uuid,
                categories: selectedItems.map(i => i.uuid),
                handleType
            }
        });
        //convert to a flatmap based on the categories property
        const flatData = data.flatMap(d => d.categories.map(c => {
            return {
                uuid: d.uuid,
                relatedUuid: c,
                handleType: d.handleType
            }
        }));

        await new ProductsService().bulkUpdateRelationships(flatData, 'sales-channel');

        dispatch('done');

    }
</script>
<StepIndicator {currentStep} {steps} glow color="indigo" />
{#if currentStep === 1}
    <Heading tag="h4">Step 1: Select the categories to assign to the product</Heading>
    <div class="flex gap-1.5">
        {#each selectedItems as item}
            <Badge dismissable on:close={onRemove.bind(this, item)} large color="indigo">{item.title}</Badge>

        {/each}
    </div>

    <ItemSelector {selectMode} bind:skipUuids bind:selectedItem bind:selectedItems on:select={onSelect} {config} />
    <div class="my-4">
        <Button color="blue" on:click={() => currentStep = 2} disabled={selectedItems.length === 0} class="w-full">
            {#if selectedItems.length === 0}
                Select at least one category to continue
            {:else}
                Next
            {/if}
        </Button>
    </div>

{:else if currentStep === 2}
    <Heading tag="h4">Step 2: How to handle the assignment</Heading>
    <Helper>
        <p class="mb-2">Select how to handle the assignment of the categories to the product.</p>
        <p class="mb-2">If you select <strong>Replace</strong>, the categories will be replaced with the selected ones.</p>
        <p class="mb-2">If you select <strong>Append</strong>, the selected categories will be added to the existing ones.</p>
        <p class="mb-2">If you select <strong>Remove</strong>, the selected categories will be removed from the product.</p>
    </Helper>
    {handleType} {uuids.length}
    <ul class="w-48 bg-white dark:bg-gray-800">
        <li><Radio class="p-3" bind:group={handleType} value="append">Append</Radio></li>
        <li><Radio class="p-3" bind:group={handleType} value="replace">Replace</Radio></li>
        <li><Radio class="p-3" bind:group={handleType} value="remove">Remove</Radio></li>
    </ul>

    <div class="my-4 grid grid-cols-2 gap-4">
        <Button color="blue" on:click={() => currentStep = 1} class="w-full">Back</Button>
        <Button color="purple" on:click={() => currentStep = 3} class="w-full">Next</Button>
    </div>

{:else if currentStep === 3}
    <Heading tag="h4">Step 3: Finalize</Heading>
    <p>
        {#if handleType === 'replace'}
            The selected <strong>{selectedItems.length}</strong> categories will replace the existing ones for  <strong>{uuids.length}</strong> items.
        {:else if handleType === 'append'}
            The selected <strong>{selectedItems.length}</strong> categories will be added to the existing ones for  <strong>{uuids.length}</strong> items.
        {:else if handleType === 'remove'}
            The selected <strong>{selectedItems.length}</strong> categories will be removed from <strong>{uuids.length}</strong> items.
        {/if}

    </p>
    <ul>
        {#each selectedItems as item}
            <li>{item.title}</li>
        {/each}
    </ul>
    <div class="my-4 grid grid-cols-2 gap-4">
        <Button color="blue" on:click={() => currentStep = 2} class="w-full">Back</Button>
        <Button color="green" on:click={finalize} class="w-full">Finish</Button>
    </div>
{/if}
