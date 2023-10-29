<script lang="ts">

    import {Heading, Hr} from "flowbite-svelte";
</script>

<div class="bg-gray-800 text-gray-400 rounded-lg border border-gray-700 divide-gray-700 shadow-md flex flex-col p-4">

    <div class={`${$$slots.headerActions ? 'grid grid-cols-2 gap-2.5' : ''}`}>
        {#if $$slots.header}
            <Heading tag="h6"><slot name="header"></slot></Heading>

        {/if}
        {#if $$slots.headerActions}
            <div class="flex justify-end">
                <slot name="headerActions"></slot>
            </div>
        {/if}
    </div>
    {#if $$slots.header}
        <Hr classHr="my-4" />
    {/if}
    <slot></slot>
    <slot name="actions"></slot>
</div>
