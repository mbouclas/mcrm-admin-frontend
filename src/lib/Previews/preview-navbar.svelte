<script lang="ts">

    import {Navbar, NavHamburger} from "flowbite-svelte";
    import PreviewButton from "./preview-button.svelte";

    export let module: string = null;
    export let itemId: string = null;
    export let mode: 'preview' | 'refresh' = 'preview';
</script>

<Navbar color="primary" >
    <div></div>
    <div class="flex md:order-2">
        <PreviewButton bind:module={module} bind:mode={mode} bind:itemId={itemId} />
        <NavHamburger />
    </div>
</Navbar>
