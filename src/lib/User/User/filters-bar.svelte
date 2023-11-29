<script lang="ts">
    import {createEventDispatcher, onMount} from "svelte";
    import {FilterOutline} from "flowbite-svelte-icons";
    import {Badge, Button, CloseButton, Drawer, Input, Label, Select} from "flowbite-svelte";
    import {sineIn} from "svelte/easing";
    import {roleItemSelectorConfig} from "../../Shared/item-selector-configs";
    import ItemSelectorModal from '../../DynamicFields/fields/item-selector-modal.svelte';
    import type {IRole} from "../../Auth/auth.service";

    const dispatch = createEventDispatcher();
    export let filters = {};
    export let excludedRoles: string[] = [];
    let toDate: string = null;
    let drawerIsHidden = true;
    let transitionParamsRight = {
        x: 320,
        duration: 200,
        easing: sineIn
    };
    let skipUuids: string[] = Array.isArray(excludedRoles) ? excludedRoles : [];



    function submit() {
        dispatch('filter', filters);
        // drawerIsHidden = true;
    }

    function clear() {
        dispatch('clear', filters);
    }

    function onRoleFilterApplied(roles: IRole[]) {
        filters.role = roles.map(role => role.name);
        submit()
    }


</script>

<div class="text-center">
    <Button color="blue" on:click={() => (drawerIsHidden = false)}>
        <FilterOutline /> <slot name="button-text"></slot>
    </Button>
</div>

<Drawer placement="right" backdrop={true}
        transitionType="fly" transitionParams={transitionParamsRight} bind:hidden={drawerIsHidden} id="filtersSidebar">
    <div class="flex items-center">
        <h5 id="drawer-label" class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">
            Filter Items
        </h5>
        <CloseButton on:click={() => (drawerIsHidden = true)} class="mb-4 dark:text-white" />
    </div>


    <form on:submit|preventDefault={submit}>

        <div class="my-4">
            <Label>Name, email..</Label>
            <Input type="text" bind:value={filters.q} placeholder="Name, email, etc.." />
        </div>

        <div class="my-4">
            <Label>Status</Label>
            <Select bind:value={filters.active}>
                <option value={null}>All</option>
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
            </Select>
        </div>

        <div class="my-4">
            <ItemSelectorModal
                    config={roleItemSelectorConfig}
                    {skipUuids}
                    on:select={(e) => onRoleFilterApplied(e.detail)}
                    closeOnSelect={true}
                    label="Filter by Role"
                    selectMode="multiple"
            >
                <Button>Filter by Role
                    <FilterOutline />
                </Button>
            </ItemSelectorModal>

        </div>

        <div class="grid grid-cols-2 gap-4">
            <Button color="red" on:click={clear} type="button" >Clear</Button>
            <Button color="green" type="submit" class="px-4">Apply Filters </Button>
        </div>
    </form>

</Drawer>
