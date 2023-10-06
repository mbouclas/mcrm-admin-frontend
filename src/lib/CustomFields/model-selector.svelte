<script lang="ts">
    import {ModelService} from "./services/model.service";
    import {
        Table,
        TableHeadCell,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        Button,
        Checkbox, Heading
    } from "flowbite-svelte";
    import {Plus} from 'svelte-heros-v2';
    import type {IBaseModel} from "../DynamicFields/base-model";
    import {createEventDispatcher} from "svelte";
    const dispatch = createEventDispatcher();

    /**
     * @type {'single'|'multiple'|'custom'|'list'}
     * @default 'single'
     * @description <ModelSelector mode="custom" onSelection={onSelection} let:model={model}> The let part allows you to get the model from the slot
     * On the parent component, you can use a slot. The model is passed to the slot from the let: statement
     *     <div slot="selector">
     *         <button on:click={onSelection.bind(this, model)}>Select</button>
     *     </div>
     * @description <ModelSelector mode="multiple" onSelection={onSelection} /> The onSelection function will be called with an array of models
     * @description <ModelSelector mode="single" onSelection={onSelection} /> The onSelection function will be called with a single model
     * @description <ModelSelector mode="list" onSelection={onSelection} /> Just a list of models, no selection
     * @description Add a slot actions to add custom actions to the table
     */

    export let mode: 'single'|'multiple'|'custom'|'list' = 'single';
    export let onSelection: (model: Partial<IBaseModel>|Partial<IBaseModel>[], selected?: Partial<IBaseModel>) => void;
    const service = new ModelService();
    let selection: Partial<IBaseModel>[] = [];
    let models = service.find();

    function selectSingle(model: Partial<IBaseModel>) {
        if (typeof onSelection === 'function') {
            onSelection(model);
        }

        dispatch('select', model);
    }

    function addToSelection(model: Partial<IBaseModel>) {
        selection.push(model);
        if (typeof onSelection === 'function') {
            onSelection(selection, model);
        }

        dispatch('select', {selection, model});
    }

</script>
<slot name="heading">
    <Heading tag="h4" class="mb-4">{models.length} Models</Heading>
</slot>
<Table>
    <TableHead>
        {#if mode !== 'list'}
            <TableHeadCell></TableHeadCell>
        {/if}
        <TableHeadCell>Model</TableHeadCell>
        <TableHeadCell>#Fields</TableHeadCell>
        {#if $$slots.actions}
        <TableHeadCell></TableHeadCell>
            {/if}
    </TableHead>
    <TableBody class="divide-y">
        {#each models as model}
        <TableBodyRow>
            {#if mode !== 'list'}
            <TableBodyCell>
                {#if mode === 'multiple'}
                <Checkbox on:change={addToSelection.bind(this, model)} />
                    {:else if mode === 'single'}
                <Button on:click={selectSingle.bind(this, model)}>
                    <Plus />
                </Button>
                    {:else}
                    <slot name="selector" model={model} />
                {/if}
            </TableBodyCell>
                {/if}
            <TableBodyCell>{model.name}</TableBodyCell>
            <TableBodyCell>{model.fields.length}</TableBodyCell>
            {#if $$slots.actions}
                <TableBodyCell>
                    <slot name="actions" model={model}></slot>
                </TableBodyCell>
            {/if}
        </TableBodyRow>
        {/each}
    </TableBody>
</Table>
