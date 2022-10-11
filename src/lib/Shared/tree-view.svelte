<script context="module">
    // retain module scoped expansion state for each tree node
    const _expansionState = {
        /* treeNodeId: expanded <boolean> */
    }
</script>
<script>
    import {createEventDispatcher} from "svelte";
    import {Button, Dropdown, DropdownDivider, DropdownItem} from "flowbite-svelte";
    import {ChevronDown} from "svelte-heros-v2";
    	import { slide } from 'svelte/transition'
    export let tree;
    export let labelKey = 'title';
    export let leafKey = 'uuid';

    const dispatch = createEventDispatcher();
    let expanded = false

    const toggleExpansion = (key) => {
        expanded = _expansionState[key] = !expanded
    }
    $: arrowDown = expanded

    function handleAction(type, node) {
        dispatch('change', {type, node})
    }

    // Event coming from a child component through recursion
    function handleEventPropagation(e) {
        handleAction(e.detail.type, e.detail.node);
    }
</script>

<ul><!-- transition:slide -->
    {#each tree as leaf}
        <li>
            {#if Array.isArray(leaf.children) && leaf.children.length > 0}
             <span on:click={toggleExpansion.bind(this,leaf[leafKey])}>
				<span class="arrow" class:arrowDown>&#x25b6</span>
			</span>
            {/if}


            {leaf[labelKey]}
            --
            <Button class=""
            ><ChevronDown>Dropdown button</ChevronDown></Button>
            <Dropdown class="w-44">
                <DropdownItem><div on:click={() => handleAction('edit', leaf)}>Edit</div></DropdownItem>
                <DropdownItem><div on:click={() => handleAction('delete', leaf)}>Delete</div></DropdownItem>
                <DropdownItem><div on:click={() => handleAction('move', leaf)}>Move</div></DropdownItem>
                <DropdownDivider />
                <DropdownItem><div on:click={() => handleAction('newCategoryBefore', leaf)}>New Category Before</div></DropdownItem>
                <DropdownItem><div on:click={() => handleAction('newCategoryAfter', leaf)}>New Category After</div></DropdownItem>
                <DropdownItem><div on:click={() => handleAction('newCategorySubCategory', leaf)}>New SubCategory</div></DropdownItem>
            </Dropdown>


            {#if expanded && Array.isArray(leaf.children)}
                <svelte:self tree={leaf.children} on:change={handleEventPropagation}>
            <span slot="actions">

            </span>

                </svelte:self>
            {/if}
        </li>
    {/each}

</ul>

<style>
    ul {
        margin: 0;
        list-style: none;
        padding-left: 1.2rem;
        user-select: none;
    }

    .no-arrow {
        padding-left: 1.0rem;
    }

    .arrow {
        cursor: pointer;
        display: inline-block;
        /* transition: transform 200ms; */
    }

    .arrowDown {
        transform: rotate(90deg);
    }
</style>
