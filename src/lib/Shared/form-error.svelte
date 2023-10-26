<script lang="ts">
    import {Helper} from "flowbite-svelte";
    import type {ZodError} from "zod";

    export let errors: Partial<ZodError> = {};
    export let key: string = '';
</script>
{#if errors[key]}
    <Helper class="mt-2" color="red">
        {errors[key].message}
    </Helper>
{/if}
