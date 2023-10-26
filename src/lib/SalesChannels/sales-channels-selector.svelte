<script lang="ts">
    import {createEventDispatcher, onMount} from "svelte";
    import {MultiSelect, Badge, Heading, Select} from 'flowbite-svelte';
    import {type ISalesChannel, SalesChannelsService} from "./services/sales-channels.service";
    import Loading from "../Shared/Loading.svelte";
    import type {IEvent} from "../Shared/models/generic";
    let items = [],
        loading = false,
        selected = [];
    export let model = [];

    export let label = 'Sales Channels';
    export let saveOnSelect = false;
    export let mode: 'multi'|'single' = 'multi';
    export let onSave: (value: any, itemId) => void = undefined;
    export let itemId = undefined;
    const dispatch = createEventDispatcher();
    export let singleSelection = null;

    onMount(async () => {
        if (!Array.isArray(model) && mode === 'multi') {
            model = [];
        }
        loading = true;
        const s = new SalesChannelsService();

        const found = await s.find({active: true});
        items = found.data.map(f => {
            return {
                id: f.uuid,
                uuid: f.uuid,
                value: f.uuid,
                name: f.title
            }
        });

        selected = model.map(m => {
            if (typeof m === 'string') {
                return m;
            }

            return m.uuid;
        });

        loading = false;
    })

    async function onSelection(e) {

        dispatch('selection', model);
        if (saveOnSelect && typeof onSave === 'function') {
            await onSave(e.detail, itemId);
            return;
        }
    }

    async function onSingleSelection(e: Event) {
        // get the value from the option
        const found = items.find(i => i.uuid === e.target.value);
        dispatch('selection', found);

        if (saveOnSelect && typeof onSave === 'function') {
            await onSave(found, itemId);
            return;
        }
    }

</script>


    {#if loading}
        <Loading />
    {:else}
        {#if mode === 'multi'}
    <Heading tag="h6" class="font-normal">{label} ( {selected.length} selected )</Heading>
        <MultiSelect items={items} bind:value={selected} size='lg' let:clear let:item
                     on:selected={onSelection}>
            <Badge color="green" dismissable params={{ duration: 100 }} on:close={clear}>
                {item.name}
            </Badge>
        </MultiSelect>
        {:else}
            <Select bind:value={singleSelection} on:change={onSingleSelection}>
                <option value={null}>All</option>
                {#each items as item}
                    <option value={item.uuid}>{item.name}</option>
                {/each}
            </Select>
        {/if}
    {/if}

