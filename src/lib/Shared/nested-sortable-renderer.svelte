<script lang="ts">
    import { Trash, PencilSquare} from "svelte-heros-v2";
    import {onMount} from "svelte";
    import Sortable from "sortablejs";
    import {Button} from "flowbite-svelte";
    import {EditOutline} from "flowbite-svelte-icons";
    import {Move} from "radix-icons-svelte";

    export let items = [];
    export let id: string;
    export let labelKey = 'title';
    export let level = 1;

    onMount(() => {

        const nestedSortables = [].slice.call(document.querySelectorAll('.nested-sortable'));

// Loop through each nested sortable element
        for (var i = 0; i < nestedSortables.length; i++) {
            new Sortable(nestedSortables[i], {
                group: 'nested',
                animation: 150,
                ghostClass: 'blue-background-class',
                dragClass: "sortable-drag",
                handle: '.handle',
                fallbackOnBody: true,
                swapThreshold: 0.65,
                onEnd: function (/**Event*/evt) {

                }
            });
        }

    });
</script>
<ul class="nested-sortable space-y-1.5">
    {#each items as item}
    <li class={`handle list-group-item px-2 my-2`} style={`margin-left:${level + 16}px`}>
        <Button size="xs"><PencilSquare size="16" /></Button>
        <Button size="xs"><Trash size="16" /></Button>
        <Button size="xs" title="Move item"><Move /></Button>
        {item[labelKey]}
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


<style>
    .handle {
        cursor: grab;
        padding: 0.2rem;
    }

    .blue-background-class {
        background-color: #0b0923;
    }
</style>
