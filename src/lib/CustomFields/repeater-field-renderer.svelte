<script lang="ts">
    import type {IDynamicFieldConfigBlueprint} from "../DynamicFields/types";
    import CustomFields from "./group-field-renderer.svelte";
    import {Button, Heading} from "flowbite-svelte";
    import {Bars3, Plus, Trash} from "svelte-heros-v2";
    import {reorderArray, setupModelFromFields} from "../helpers/data";
    import {onMount} from "svelte";
    import Sortable from "sortablejs";
    import {v4} from "uuid";

    export let model = [];
    export let fields: IDynamicFieldConfigBlueprint[] = [];
    export let field: IDynamicFieldConfigBlueprint;
    export let imageClasses = '';
    export let allowMove = false;
    export let onMoveEnd: (evt: any) => void;
    let sortable;
    let items = [];
    const id = v4().replace(/-/g, '');

    onMount(() => {
        if (model.length === 0) {
            addRow();
        }

        if (allowMove) {
            addSortable();
        }

        items = Object.assign([], model);
    });

    function addRow() {
        let temp = Object.assign([], model);
        temp.push(setupModelFromFields({},fields));
        items = temp;
        model = Object.assign([], items);

        setTimeout(() => {
            const el = document.getElementById(id);

            window.scrollTo({
                top: el.scrollHeight,
                behavior: 'smooth'
            });
        }, 100);
    }

    function addSortable() {
        const el = document.getElementById(id);
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

    }
</script>
<div class="flex justify-end gap-2.5">
    <Button on:click={toggleMove} color="blue" title="Move"><Bars3  /></Button>
    <Button on:click={addRow} color="green" title="Add row"><Plus /></Button>
</div>
<div {id}>
{#each items as item, idx}
    <div class="my-4 flex justify-end gap-2.5">
        {#if allowMove}

            <button class="handle flex gap-2.5 h-6">{idx + 1} <Bars3 /></button>
        {/if}
        <Button color="red" on:click={removeItem.bind(this, idx)}><Trash /></Button>
    </div>
    <CustomFields fields={fields} let:field={child} fieldPrimaryKey="varName" imageClasses={allowMove ? 'hidden' : imageClasses}
                  bind:model={item}
                  outerClass={`my-4 border border-solid border-gray-500 px-4 ${field.fieldSettings && field.fieldSettings['perRow'] ? `grid gap-2 grid-cols-${field.fieldSettings['perRow']}` : ''}`}>
        <svelte:fragment slot="heading">
            <Heading tag="h5">{field.label}</Heading>
        </svelte:fragment>
    </CustomFields>
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
