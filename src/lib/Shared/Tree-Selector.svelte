<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import CheckBox from '../DynamicFields/fields/checkbox.svelte';


    const _expansionState = {
        /* Holds the state of all expanded nodes */
    }
    const _leafState = {
        /* Holds the state of hovered nodes */
    }
    let loading = false;
    export let model = [];
    export let level = 0;
    export let tree = [];
    export let title = 'Select Categories';
    export let parent = null;
    const dispatch = createEventDispatcher();
    let expanded = false
    export let labelKey = 'title';
    export let leafKey = 'uuid';
    export let addIdsOnly = true; // set to false, to add the entire object to the selection array

    // This event comes form a child component, emit event to parent
    function handleEventPropagation(e) {
        onCheckboxChange(e);
    }

    function toggleExpansion(key) {
        _expansionState[key] = !_expansionState[key];
    }

    function onAddLeaf(parent) {
        console.log(parent)
    }

    function onCheckboxChange(e) {
        // If this is a child component, emit event to parent
        if (level > 0) {
            dispatch('change', e.detail);
            return;
        }

        const val = e.detail;

        const foundIndex = model.findIndex(item => {
            if (addIdsOnly) {
                return item === val[leafKey]
            }

            return item[leafKey] === val[leafKey]
        });

        if (foundIndex !== -1) {
            model.splice(model.indexOf(foundIndex, 1));
            dispatch('selection', model)
            return
        }

        model.push(addIdsOnly ? val[leafKey] : val);
        dispatch('selection', model)
    }


const isChecked = (leaf) => {
    const found = model.find(item => leaf[leafKey] === item[leafKey])
    // look ahead for selected children so that we can open the parent
    if (Array.isArray(leaf.children)) {
        leaf.children.forEach(item => {
            if (model.find(i => i[leafKey] === item[leafKey])) {
                _expansionState[leaf[leafKey]] = true;
            }
        })

    }

    return !!found;
}


</script>



<div class={`space-y-2 text-sm`}
     class:px-6={level > 0}
     aria-labelledby="dropdownDefault">
    {#each tree as leaf, idx}

        <div class="flex items-center dark:hover:bg-gray-600 space-y-1 my-2 p-2"
            on:mouseenter={() => _leafState[leaf[leafKey]] = true} on:mouseleave={() => _leafState[leaf[leafKey]] = false}>
            {#if Array.isArray(leaf.children) && leaf.children.length > 0}
             <span on:click={toggleExpansion.bind(this,leaf[leafKey])}>
				<span class="arrow"
                      class:arrowDown={_expansionState[leaf[leafKey]]}>&#x25b6</span>
			</span>
            {/if}

    <CheckBox bind:group={model} value={leaf}
              classes={`ml-8 ${Array.isArray(leaf.children) && leaf.children.length > 0 ? 'ml-5' : 'ml-8'}`}
              on:change={onCheckboxChange}
              name={leaf[leafKey]}
              checked={isChecked(leaf)}>
                {leaf[labelKey]}
    </CheckBox>
            <div class:hidden={!_leafState[leaf[leafKey]]}
                 class="ml-auto text-sm text-gray-500 dark:text-gray-400 ">
                <button on:click={onAddLeaf.bind(this, parent)}>Add Subcategory</button>
            </div>


        </div>
        {#if Array.isArray(leaf.children) && leaf.children.length > 0}
        <div class:hidden={!_expansionState[leaf[leafKey]]}>
            <svelte:self tree={leaf.children} bind:model level={level + 1} on:change={handleEventPropagation} parent={leaf}>
            <span slot="actions">

            </span>

            </svelte:self>
        </div>
        {/if}
    {/each}
</div>

<style>
    .arrow {
        cursor: pointer;
        display: inline-block;
         transition: transform 200ms;
    }

    .arrowDown {
        transform: rotate(90deg);
    }
</style>
