<script context="module">
    import Sortable, { MultiDrag, Swap } from 'sortablejs';
</script>
<script lang="ts">
    import type {IBaseModelFieldGroup} from "./models/groups.model";
    import {Badge, Button, Heading, Helper, Hr, Input, Label, MultiSelect} from "flowbite-svelte";
    import {z, ZodError} from "zod";
    import {formatZodErrors} from "../helpers/errors";
    import type {IDynamicFieldConfigBlueprint} from "../DynamicFields/types";
    import {Bars3, Trash} from "svelte-heros-v2";
    import {onMount} from "svelte";


    const schema = z.object({
        name: z.string().min(1, 'Name is required'),
        label: z.string().min(1, 'Label is required'),
        description: z.string().min(1, 'Description is required'),

    });
    export let model: Partial<IBaseModelFieldGroup> = {
        fields: [],
    };
    export let fields: IDynamicFieldConfigBlueprint[] = [];
    export let onSave: (model: Partial<IBaseModelFieldGroup>) => void;
    let errors = {},
        selection = [],
    filteredItems: IDynamicFieldConfigBlueprint[] = [];

    onMount(() => {
        filteredItems = fields.filter((item) => {
            return !model.fields.find((s) => s === item.varName);
        });
        addSortable('items');
        addSortable('selection');
    })

    function addSortable(elId: string) {
        const el = document.getElementById(elId);

        new Sortable(el, {
            animation: 150,
            handle: '.handle',
            dataIdAttr: 'data-id',
            ghostClass: 'blue-background-class',
            group: 'shared',
            onEnd: function (/**Event*/evt) {
                // same properties as onEnd
                const temp = Object.assign({}, model);
                const els = [];
                document.getElementById('selection').querySelectorAll('li').forEach(node => {
                    els.push(node.dataset.id);
                });

                temp.fields = els;
                model = temp;
                return;


            },
        });
    }

    if (!model) {
        model = {
            fields: [],
        };
    }

    if (!Array.isArray(model.fields)) {
        model.fields = [];
    }


    model.fields.forEach((f) => {
        const index = fields.findIndex((item) => item.varName === f);

        if (index === -1) {
            return;
        }
        selection.push(fields[index]);
    });


    function save() {
        errors = {};
        try {
            schema.parse(model);
        }
        catch (e) {
            if (e instanceof ZodError) {
                errors = formatZodErrors(e);
            }
            return;
        }

        if (onSave) {
            onSave(model);
        }
    }




</script>
<form on:submit|preventDefault={save}>
    <div class="my-4">
        <Label>Name</Label>
        <Input bind:value={model.name} placeholder="Name" />
        {#if errors['name']}
            <Helper class="mt-2" color="red">
                {errors['name'].message}
            </Helper>
        {/if}
    </div>

    <div class="my-4">
        <Label>Label</Label>
        <Input bind:value={model.label} placeholder="Label" />
    </div>

    <div class="my-4">
        <Label>Description</Label>
        <Input bind:value={model.description} placeholder="Description" />
    </div>

    <Hr />
    <Heading tag="h6">Fields</Heading>
    <Helper>Fields will appear in the order you add them</Helper>

    <div class="grid-cols-2 grid gap-2.5 my-4">
    <ul id="items" role="list">
        {#each filteredItems as field}
            <li class="relative group" data-id={field.varName}>
                <button type="button" title="move item" class="handle">
                    <Bars3 size="16" />
                </button>
                {field.label}</li>
        {/each}
    </ul>

    <div>
        <ul id="selection" role="list"
            class:h-12={model.fields.length === 0}
        class:bg-gray-500={model.fields.length === 0}>
            {#each selection as field}
                <li class="relative group" data-id={field.varName}>
                    <button type="button" title="move item" class="handle">
                        <Bars3 size="16" />
                    </button>
                    {field.label}</li>
            {/each}
        </ul>
        {#if model.fields.length === 0}
            <p>Drop fields from the left to here</p>
        {/if}
    </div>
    </div>


    <div class="my-4">
        <Button type="submit" color="green" class="w-full">Save</Button>
    </div>
</form>

<style>
    .handle {
        cursor: grab;
        padding: 0.2rem;
    }
</style>
