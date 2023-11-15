<script lang="ts">
    import type {IDynamicFieldConfigBlueprint} from "../DynamicFields/types";
    import CustomFields from "./group-field-renderer.svelte";
    import {Button, Heading} from "flowbite-svelte";
    import {Bars3, Plus} from "svelte-heros-v2";
    import {setupModelFromFields} from "../helpers/data";
    import {onMount} from "svelte";

    export let model = [];
    export let fields: IDynamicFieldConfigBlueprint[] = [];
    export let field: IDynamicFieldConfigBlueprint;

    onMount(() => {
        if (model.length === 0) {
            addRow();
        }
    });

    function addRow() {
        let temp = Object.assign([], model);
        temp.push(setupModelFromFields({},fields));
        model = temp;
    }
</script>
<div class="flex justify-end">
    <Button on:click={addRow} color="green" title="Add row"><Plus /></Button>
</div>

{#each model as item}

    <CustomFields fields={fields} let:field={child} fieldPrimaryKey="varName"
                  bind:model={item}
                  outerClass={`my-4 border border-solid border-gray-500 px-4 ${field.fieldSettings && field.fieldSettings['perRow'] ? `grid gap-2 grid-cols-${field.fieldSettings['perRow']}` : ''}`}>
        <svelte:fragment slot="heading">
            <Heading tag="h5">{field.label}</Heading>
        </svelte:fragment>
    </CustomFields>
    {/each}
