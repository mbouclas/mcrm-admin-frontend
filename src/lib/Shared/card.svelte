<script lang="ts">

import {Heading} from "flowbite-svelte";
</script>

<div class="bg-gray-800 text-gray-400 rounded-lg border border-gray-700 divide-gray-700 shadow-md flex flex-col p-4">
    <Heading tag="h6">
        <slot name="header"></slot>
    </Heading>
    <slot></slot>
    <slot name="actions"></slot>
</div>
