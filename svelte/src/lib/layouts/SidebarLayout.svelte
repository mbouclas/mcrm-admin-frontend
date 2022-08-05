<script>
    import { fly } from 'svelte/transition';
    export let show = false;
</script>

{#if show}
<nav
transition:fly={{x: 250, opacity: 1}} 
class="sidemenu hidden lg:block  text-gray-200 p-4 h-screen w-64 z-0 top-0 inset-0 fixed bg-gray-secondary ">
	<slot></slot>
</nav>
{/if}