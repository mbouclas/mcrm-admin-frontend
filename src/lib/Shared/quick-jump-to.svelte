<script lang="ts">
    import {Listgroup, Modal, Search} from "flowbite-svelte";
    import {SideBarMenuItem, sideBarMenuItems} from "../../data/menu";
    import {navigate} from "mcrm-svelte-navigator";
    import {flattenTree} from "../helpers/data";
    let showModal = false;
    let childrenItems: SideBarMenuItem[] = [];
    let searchTerm = '';
    const flatMenu = flattenTree(sideBarMenuItems);
    let menuItems = sideBarMenuItems;

    function onKeyPressed(e) {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();

            showModal = true;
            return
        }
    }

    function open(item: SideBarMenuItem) {
        if (item.children && item.children.length > 0) {
            childrenItems = item.children;
            return;
        }

        showModal = false;
        navigate(item.route);
    }

    function search() {
        if (searchTerm.length === 0) {
            menuItems = sideBarMenuItems;
            return;
        }

        menuItems = flatMenu.filter(item => item.label.toLowerCase().includes(searchTerm.toLowerCase()));
    }
</script>

<svelte:window on:keydown={onKeyPressed}/>
<Modal title="Quick Navigation" autoclose={false} size="lg" bind:open={showModal}>
    <Search bind:value={searchTerm} on:input={search} on:keyup={search} />
    <div class="flex transform-gpu divide-x divide-gray-100">

        <!-- Preview Visible: "sm:h-96" -->
        <div class="max-h-96 min-w-0 flex-auto scroll-py-4 overflow-y-auto px-6 py-4 sm:h-96">
            <!-- Default state, show/hide based on command palette state. -->
            <h2 class="mb-4 mt-2 text-xs font-semibold text-gray-500">Navigate To...</h2>

            <!-- Results, show/hide based on command palette state. -->
            <ul class="-mx-2 text-sm text-gray-700" id="options" role="listbox">
                <!-- Active: "bg-gray-100 text-gray-900" -->
                {#each menuItems as item}
                <li class="group hover:bg-gray-600 flex cursor-default select-none items-center rounded-md p-2" id="option-1" role="option" tabindex="-1">
                    <a href="#" on:click|preventDefault={open.bind(this, item)} class="w-full flex">
                    <span class="ml-3 flex-auto truncate">{item.label}</span>
                    <!-- Not Active: "hidden" -->
                    <svg class="ml-3  h-5 w-5 flex-none text-gray-800" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                    </svg>
                    </a>
                </li>
                    {/each}
            </ul>
        </div>

        <!-- Active item side-panel, show/hide based on active state -->
        <div class="hidden h-96 w-1/2 flex-none flex-col divide-y divide-gray-100 overflow-y-auto sm:flex">
            {#if childrenItems.length > 0}
            <div class="flex flex-auto flex-col justify-between p-6">
                <Listgroup active items={childrenItems} let:item  on:click={(e) => {
                    navigate(e.detail.route);
                    showModal = false;
                }}>
                    {item.label}
                </Listgroup>
            </div>
                {:else}
                <div class="flex justify-center">
                    Select an item from the right
                </div>
                {/if}
        </div>

    </div>
</Modal>
