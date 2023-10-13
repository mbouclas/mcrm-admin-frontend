<script lang="ts">
    import { Spinner } from 'flowbite-svelte';
    export let size = '8';
    export let color: 'primary' | 'blue' | 'gray' | 'green' | 'red' | 'yellow' | 'pink' | 'purple' | 'white' | 'custom' | undefined = 'default';
    export let label = null;
</script>
<div class="flex gap-1.5">
    <Spinner {color} {size} />
    {#if $$slots.default}
        <span class="text-gray-500 py-1 pl-2"><slot></slot></span>
    {/if}
</div>

