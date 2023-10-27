<script lang="ts">

import Card from "./card.svelte";
import {Heading, Hr} from "flowbite-svelte";
</script>
<Card>
    {#if $$slots.heading}
        <Heading tag="h6"><slot name="heading"></slot></Heading>
        <Hr classHr="my-4" />
    {/if}

    <slot></slot>
</Card>
