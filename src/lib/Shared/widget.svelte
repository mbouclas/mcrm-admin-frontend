<script lang="ts">

import Card from "./card.svelte";
import {Heading, Hr} from "flowbite-svelte";
</script>
<Card>
    <div class={`${$$slots.actions ? 'grid grid-cols-2 gap-2.5' : ''}`}>
    {#if $$slots.heading}
        <Heading tag="h6"><slot name="heading"></slot></Heading>

    {/if}
        {#if $$slots.actions}
        <div class="flex justify-end">
            <slot name="actions"></slot>
        </div>
            {/if}
    </div>
    {#if $$slots.heading}
    <Hr classHr="my-4" />
    {/if}
    <slot></slot>
</Card>
