<script lang="ts">
    import {
        Button, Checkbox, Heading,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
        TableSearch
    } from "flowbite-svelte";
    import {onMount} from "svelte";
    import {CustomFieldsService} from "./services/custom-fields.service";
    import {createEventDispatcher} from "svelte";
    import type {IDynamicFieldConfigBlueprint} from "../DynamicFields/types";
    import {Plus} from "svelte-heros-v2";
    import type {IGenericObject} from "../Shared/models/generic";

    const dispatch = createEventDispatcher();
    export let mode: 'single'|'multiple'|'custom'|'list' = 'single';
    export let onSelection: (model: Partial<IDynamicFieldConfigBlueprint>|Partial<IDynamicFieldConfigBlueprint>[], selected?: Partial<IDynamicFieldConfigBlueprint>) => void = undefined;
    export let selection: Partial<IDynamicFieldConfigBlueprint>|Partial<IDynamicFieldConfigBlueprint>[] = [];
    export let modelName: string = '';
    export let refresh = false;

    const fieldsService = new CustomFieldsService();
    let fields = [],
        searchTerm = '';

    onMount(async () => {
        fields = fieldsService.modelFields(modelName);

    });

    function selectSingle(field: Partial<IDynamicFieldConfigBlueprint>) {
        if (typeof onSelection === 'function') {
            onSelection(field);
        }

        dispatch('select', field);
    }

    function addToSelection(field: Partial<IDynamicFieldConfigBlueprint>) {
        selection.push(field);

        if (typeof onSelection === 'function') {
            onSelection(selection, field);
        }

        dispatch('select', {fields, model: field});
    }

    $: filteredItems = fields.filter((item) => item.label.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
    $: {
        if (refresh) {
            fields = fieldsService.modelFields(modelName);
            refresh = false;
        }
    }
</script>

{#if fields.length > 0}

    <slot name="heading">
        <Heading tag="h4" class="mb-4">{filteredItems.length} Fields</Heading>
    </slot>
    <slot name="top-actions"></slot>
<TableSearch placeholder="Search by field name" hoverable={true} bind:inputValue={searchTerm} >
    <TableHead>
        {#if mode !== 'list'}
        <TableHeadCell></TableHeadCell>
        {/if}
        <TableHeadCell>ID</TableHeadCell>
        <TableHeadCell>Name</TableHeadCell>
        {#if $$slots.actions}
            <TableHeadCell></TableHeadCell>
        {/if}
    </TableHead>
    <TableBody class="divide-y">
        {#each filteredItems as field}
            <TableBodyRow>
                {#if mode !== 'list'}
                <TableBodyCell>
                    {#if mode === 'multiple'}
                        <Checkbox on:change={addToSelection.bind(this, field)} />
                    {:else if mode === 'single'}
                        <Button on:click={selectSingle.bind(this, field)}>
                            <Plus />
                        </Button>
                    {:else}
                        <slot name="selector" field={field} />
                    {/if}
                </TableBodyCell>
                    {/if}
                <TableBodyCell>{field.varName}</TableBodyCell>
                <TableBodyCell>{field.label}</TableBodyCell>

                {#if $$slots.actions}
                    <TableBodyCell>
                    <slot name="actions" field={field}></slot>
                    </TableBodyCell>
                    {/if}
            </TableBodyRow>
        {/each}
    </TableBody>
</TableSearch>
{/if}
