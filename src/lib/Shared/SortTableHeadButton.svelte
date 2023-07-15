<script lang="ts">
    export let name: string;
    export let way = 'asc';
    export let activeFilter = 'createdAt';
    export let onChange;
</script>

<button type="button" class="flex items-center gap-x-2"
        class:text-red-500={activeFilter === name}
        on:click={onChange.bind(this, name, way)}>
    <slot></slot>

    {#if way === 'asc'}
        <svg class="h-5"
             xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M19 17h3l-4 4l-4-4h3V3h2M2 17h10v2H2M6 5v2H2V5m0 6h7v2H2v-2Z"/></svg>
    {:else}
        <svg class="h-5"
             xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M19 7h3l-4-4l-4 4h3v14h2M2 17h10v2H2M6 5v2H2V5m0 6h7v2H2v-2Z"/></svg>
    {/if}
</button>
