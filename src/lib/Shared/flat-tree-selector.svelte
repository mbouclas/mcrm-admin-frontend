<script lang="ts">
    import {createEventDispatcher, onMount} from "svelte";
    import type {IBaseTree} from "../DynamicFields/base-model";
    import {flattenTree} from "../helpers/data";
    import { Button, Dropdown, Search } from 'flowbite-svelte';
    import { ChevronDownSolid } from 'flowbite-svelte-icons';

    const dispatch = createEventDispatcher();
    export let labelKey = 'title';
    let searchTerm = '';
    export let leafKey = 'uuid';
    export let parent = null;
    export let tree: IBaseTree[] = [];
    export let model: IBaseTree  = undefined;
    export let selectionKey: string = null;
    let items = flattenTree(tree);
    let dropdownOpen = false;

    function selectItem(item) {
        if (!item) {model = null; return;}// in case of reset

        model = (selectionKey) ? item[selectionKey] : item;
        dispatch('change', item);
        dropdownOpen = false;
    }

    $: filteredItems = items.filter((item) => item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
</script>
<Button color="light">Category<ChevronDownSolid class="w-3 h-3 ml-2" /></Button>
<Dropdown class="overflow-y-auto px-3 pb-3 text-sm h-44" bind:open={dropdownOpen}>
    <div slot="header" class="p-3">
        <Search size="md" bind:value={searchTerm} />
    </div>
    <li class=" flex">
        <Button class="w-full justify-start" on:click={selectItem.bind(this, null)}>All</Button>
    </li>
    {#each filteredItems as item}
    <li class=" flex">
        <Button class="w-full justify-start" on:click={selectItem.bind(this, item)}>
        {#each Array(item.level) as _}
            &nbsp;&nbsp; -
        {/each}
        {item[labelKey]}
        </Button>
    </li>
        {/each}
</Dropdown>
<!--<Select bind:value={model}>
    <option value={null}>All</option>
    {#each items as item}
        <option value={item[leafKey]}>
            {#each Array(item.level) as _}
                &nbsp;&nbsp; -
            {/each}
            <span class={`ml-2`}>{item[labelKey]}</span>
        </option>
    {/each}
</Select>-->
