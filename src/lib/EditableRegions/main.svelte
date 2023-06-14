<script lang="ts">
    import {Listgroup, ListgroupItem} from 'flowbite-svelte'
    import {  Heading, P, Hr } from 'flowbite-svelte'
    import {app} from "../stores";
    import Edit from './layouts/edit.svelte';
    import type {IEditableRegion} from "./models";

    let regions: IEditableRegion[] = [],
        selectedRegion: IEditableRegion;

    app.subscribe(state => {
        if (!state || !state.configs || !Array.isArray(state.configs.editableRegions)) {
            return;
        }

        regions = state.configs.editableRegions;
    });

    function onLayoutClick(e: CustomEvent) {
        const region = e.detail as IEditableRegion;
        // bug on the listgroup component
        if (typeof region === 'number') {
            return;
        }

        const idx = regions.findIndex(r => r.name === region.name);
        selectedRegion = region;
        regions[idx]['current'] = true;
        console.log(region, idx);
    }

</script>
<Heading tag="h3" class="mb-4">Available Layouts</Heading>
<Listgroup active class="w-48" items={regions} let:item on:click={onLayoutClick}>
    {item.label}
</Listgroup>
  
  <Hr class="my-4" />

  {#if selectedRegion}
    <Edit region={selectedRegion} />
  {/if}