<script lang="ts">
    import type {IEditableRegion} from "../models";
    import CustomFields from "../../CustomFields/group-field-renderer.svelte";
    import {Button} from "flowbite-svelte";
    import type {IGenericObject} from "../../Shared/models/generic";
    import {reorderArray, setupModelFromFields} from "../../helpers/data";
    import {onMount} from "svelte";
    import {Bars3, Plus, Trash} from "svelte-heros-v2";
    import Sortable from "sortablejs";

    export let model: IGenericObject[] = [];
    export let region: IEditableRegion;
    export let allowMove = false;
    export let onMoveEnd: (evt: any) => void;
    let showBottomButtons = false;
    let sortable;
    let items = [];
    onMount(() => {
        if (model.length === 0) {
            onAddNewRow();
        }

        if (allowMove) {
            addSortable();
        }

        shouldShowBottomButtons();
        items = Object.assign([], model);
    });

    function onAddNewRow() {
        const temp = [...items];
        temp.push(setupModelFromFields({},region.fields));
        items = temp;
        model = Object.assign([], items);
        // scroll to bottom
        setTimeout(() => {
            const el = document.getElementById('items');

            window.scrollTo({
                top: el.scrollHeight,
                behavior: 'smooth'
            })
            shouldShowBottomButtons()
        }, 100);
    }

    function addSortable() {
        const el = document.getElementById('items');
        sortable = new Sortable(el, {
            animation: 150,
            handle: '.handle',
            dataIdAttr: 'data-id',
            ghostClass: 'blue-background-class',
            onEnd: async function (/**Event*/ evt) {
                model = reorderArray(items, evt.oldIndex, evt.newIndex);
                moveEnd();

                if (onMoveEnd) {
                    onMoveEnd(evt);
                }
            }
        });

    }

    function moveEnd() {
        // Hack to solve some issues with sortable. Without this once the array is rearranged the items are not updated
        sortable.destroy();
        items = [];
        setTimeout(() => {
            items = Object.assign([], model);
            addSortable();
        })

    }

    function toggleMove() {
        allowMove = !allowMove;
        if (allowMove) {
            addSortable();
        } else {
            sortable.destroy();
        }

    }

    function removeItem(idx) {
        const temp = [...model];
        temp.splice(idx, 1);
        model = temp;
        items = Object.assign([], model);
        shouldShowBottomButtons()
    }

    function shouldShowBottomButtons() {
        const el = document.getElementById('items');
        const height = el.scrollHeight;
        showBottomButtons = height > window.innerHeight;
    }

</script>

<div class="flex justify-end gap-2.5">
    <Button on:click={toggleMove} color="blue" title="Move"><Bars3  /></Button>
    <Button color="blue" on:click={onAddNewRow}><Plus /></Button>
    <slot name="actions"></slot>
</div>
<div id="items">
{#each items as item, idx}
    <div class="my-4 border border-1 border-gray-500 rounded-xl p-4">

        <div class="my-4 flex justify-end gap-2.5">
            {#if allowMove}

            <button class="handle flex gap-2.5 h-6">{idx + 1} <Bars3 /></button>
                {/if}
            <Button color="red" on:click={removeItem.bind(this, idx)}><Trash /></Button>
        </div>
        <CustomFields fields={region.fields} let:field={field} fieldPrimaryKey="varName" bind:model={item}
                      imageClasses={allowMove ? 'hidden' : "w-full h-64 object-contain"}>

        </CustomFields>
    </div>
{/each}
</div>

{#if showBottomButtons}
    <div class="flex justify-end gap-2.5">
        <Button on:click={toggleMove} color="blue" title="Move"><Bars3  /></Button>
        <Button color="blue" on:click={onAddNewRow}><Plus /></Button>
        <slot name="actions"></slot>
    </div>
    {/if}
<style>
    .blue-background-class {
        background-color: #c8ebfb;
    }

    .handle {
        cursor: grab;
    }
</style>
