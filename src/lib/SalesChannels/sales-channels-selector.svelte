<script lang="ts">
    import {createEventDispatcher, onMount} from "svelte";
    import {MultiSelect, Badge, Heading} from 'flowbite-svelte';
    import {SalesChannelsService} from "./services/sales-channels.service";
    import Loading from "../Shared/Loading.svelte";
    let items = [],
        loading = false,
        selected = [];
    export let model = [];
    export let label = 'Sales Channels';
    export let saveOnSelect = false;
    export let onSave: (value: any, itemId) => void;
    export let itemId;
    const dispatch = createEventDispatcher();

    onMount(async () => {
        if (!Array.isArray(model)) {
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


</script>


    {#if loading}
        <Loading />
    {:else}
    <Heading tag="h6" class="font-normal">{label} ( {selected.length} selected )</Heading>
        <MultiSelect items={items} bind:value={selected} size='lg' let:clear let:item
                     on:selected={onSelection}>
            <Badge color="green" dismissable params={{ duration: 100 }} on:close={clear}>
                {item.name}
            </Badge>
        </MultiSelect>
    {/if}

