<script lang="ts">
    import type {IEditableRegion} from "../models";
    import CustomFields from "../../CustomFields/group-field-renderer.svelte";
    import {Button, Heading, Modal} from "flowbite-svelte";
    import type {IGenericObject} from "../../Shared/models/generic";
    import {reorderArray, setupModelFromFields} from "../../helpers/data";
    import {onMount} from "svelte";
    import {Bars3, Plus, Trash} from "svelte-heros-v2";
    import Sortable from "sortablejs";

    export let model: IGenericObject[] = [];
    export let region: IEditableRegion;
    export let allowMove = false;
    export let onMoveEnd: (evt: any) => void;

    onMount(() => {
        if (model.length === 0) {
            onAddNewRow();
        }

        if (allowMove) {
            addSortable();
        }
    });

    function onAddNewRow() {
        const temp = [...model];
        temp.push(setupModelFromFields({},region.fields));
        model = temp;
    }

    function addSortable() {
        const el = document.getElementById('items');
        const s = new Sortable(el, {
            animation: 150,
            handle: '.handle',
            dataIdAttr: 'data-id',
            ghostClass: 'blue-background-class',
            onEnd: async function (/**Event*/ evt) {
                model = reorderArray(model, evt.oldIndex, evt.newIndex);
                if (onMoveEnd) {
                    onMoveEnd(evt);
                }
            }
        });
    }

    function toggleMove() {
        allowMove = true;
        addSortable();
    }

    function removeItem(idx) {
        const temp = [...model];
        temp.splice(idx, 1);
        model = temp;
    }
</script>

<div class="flex justify-end gap-2.5">
    <Button on:click={toggleMove} color="blue" title="Move"><Bars3  /></Button>
    <Button color="blue" on:click={onAddNewRow}><Plus /></Button>
</div>
<div id="items">
{#each model as item, idx}
    <div class="my-4 border border-1 border-gray-500 rounded-xl p-4">
        <div class="my-4 flex justify-end gap-2.5">
            {#if allowMove}
            <button class="handle"><Bars3 /></button>
                {/if}
            <Button color="red" on:click={removeItem.bind(this, idx)}><Trash /></Button>
        </div>
        <CustomFields fields={region.fields} let:field={field} fieldPrimaryKey="varName" bind:model={item}>

        </CustomFields>
    </div>
{/each}
</div>

<style>
    .blue-background-class {
        background-color: #c8ebfb;
    }

    .handle {
        cursor: grab;
    }
</style>
