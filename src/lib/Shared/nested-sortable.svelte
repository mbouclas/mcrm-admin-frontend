<script lang="ts">
    import {v4} from "uuid";
    import Renderer from './nested-sortable-renderer.svelte';
    import {Move} from "radix-icons-svelte";
    import {PencilSquare, Plus, Trash} from "svelte-heros-v2";
    import {Button} from "flowbite-svelte";

    export let id: string = v4().replace(/-/g, '');
    export let labelKey = 'title';
    export let items = [];
    export let level = 1;

    let showMoveModal = false,
        showEditModal = false,
        showAddModal = false;


</script>
<ul class="nested-sortable space-y-1.5">
    {#each items as item}
        <li class:hidden={level > 1}
                class={`handle list-group-item px-2 my-2`} style={`margin-left:${level + 16}px`}>
            <Button size="xs"><PencilSquare size="16" /></Button>
            <Button size="xs"><Trash size="16" /></Button>
            <Button size="xs"><Plus size="16" /></Button>
            <Button size="xs" title="Move item"><Move /></Button>
            {item[labelKey]} {level}
            {#if item.children}
                <svelte:self
                        id={id}
                        items={item.children}
                        labelKey={labelKey}
                        level={level + 1} />
            {/if}
        </li>
    {/each}

</ul>
<!--<Renderer bind:items={items} {id} />-->




