<script lang="ts">
    import { Button, Modal } from 'flowbite-svelte'
    import ItemSelector from "./item-selector.svelte";
    import type {IItemSelectorConfig} from "../types";
    import {createEventDispatcher} from "svelte";
    const dispatch = createEventDispatcher();
    export let config: IItemSelectorConfig;
    export let label = 'Select';
    let defaultModal = false;
    export let selectedItem = {};
    export let selectedItems = [];
    export let selectMode: 'single' | 'multiple' = 'single';
    export let closeOnSelect = false;

    function onSelect(event) {
        if (closeOnSelect) {
            defaultModal = false;
        }
        dispatch('select', event.detail);
    }

</script>


{#if !$$slots.default}
    <Button on:click={() => defaultModal = true}>Default modal</Button>
    {:else}
    <Button on:click={() => defaultModal = true}><slot></slot></Button>
    {/if}

<Modal title={label} bind:open={defaultModal} >
    <ItemSelector {selectMode} bind:selectedItem={selectedItem} bind:selectedItems={selectedItems}
                  on:select={onSelect} {config} />
    <svelte:fragment slot='footer'>
        <Button on:click={() => alert('Handle "success"')}>I accept</Button>
        <Button color="alternative">Decline</Button>
    </svelte:fragment>
</Modal>
