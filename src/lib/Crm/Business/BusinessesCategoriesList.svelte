<script lang="ts">
    import SimpleTreeSelector from '../../Shared/SimpleTreeSelector.svelte';
    import {BusinessCategoryService} from "../services/businessCategory.service";

    import { onMount } from 'svelte';
    import {simpleTreeSelectorStore} from "../../stores";
    import {Modal} from "flowbite-svelte";
    import AddEditBusinessCategoryItem from "./AddEditBusinessCategoryItem.svelte";
    import type {BusinessCategoryModel} from "../models/business-category.model";
    import type {IEvent} from "../../Shared/models/generic";
    import AddEditMenuItem from "../../Menu/add-edit-menu-item.svelte";


    export let model = [];
    let selectedItem: BusinessCategoryModel;

    const service = new BusinessCategoryService();

    let tree = [],
        showEditItemModal = false,
        showAddItemModal = false,
        currentParent: BusinessCategoryModel = null,
        ready = false;
    let movingNode = null;

    onMount(async () => {
        await reload();
        ready = true;
    });

    async function reload() {
        tree = await service.tree();
    }

    function handleEdit(node) {
        console.log(node.uuid);
    }

    const handleMove = async (node, parentNode = null) => {
        const result = await service.move(node.uuid, parentNode?.uuid || null);

        simpleTreeSelectorStore.update((state) => {
            state.value = tree;
            state.action = 'itemAdded';
            return state;
        });
        return result;
    };

    const handleDelete = async (node, deleteType: string) => {
        const newTree = await service.deleteOne(node.uuid, deleteType);
        tree = newTree;

        simpleTreeSelectorStore.update((state) => {
            state.value = tree;
            state.action = 'itemAdded';
            return state;
        });
        return null;
    };

    const handleCreate = async (data) => {
        const newTree = await service.store(data);
        tree = newTree;

        simpleTreeSelectorStore.update((state) => {
            state.value = tree;
            state.action = 'itemAdded';
            return state;
        });
        return null;
    };

    const handleUpdate = async (uuid, data) => {
        const newTree = await service.update(uuid, data);
        tree = newTree;

        simpleTreeSelectorStore.update((state) => {
            state.value = tree;
            state.action = 'itemAdded';
            return state;
        });
        return null;
    };

    function handleNewAfter(node) {
        console.log(node.uuid);
    }

    function handleNewBefore(node) {
        console.log(node.uuid);
    }

    function handleNewSubCategory(node) {
        console.log(node.uuid);
    }

    function handleOnTreeViewChangeEvent(e) {
        const { type, node } = e.detail;
        console.log(type, node.uuid);
    }

    async function onSaveItem(e) {
        await reload();
        showAddItemModal = false;
    }

    function onGotToNode(e: IEvent<{ node: BusinessCategoryModel, path: BusinessCategoryModel[] }>) {
        currentParent = e.detail.node;
    }

    function onCreateModalOpen(e: IEvent<BusinessCategoryModel>) {
        currentParent = e.detail;
        showAddItemModal = true;
    }

    function editItem(e: IEvent<{ node: BusinessCategoryModel, parentCategoryName: string }>) {
        selectedItem = e.detail.node;
        showEditItemModal = true;
    }
</script>
{#if ready}
    <SimpleTreeSelector
            module="business"
            bind:tree
            on:selection={handleOnTreeViewChangeEvent}
            on:handleMove={async (e) => {
    const { node, parent } = e.detail;
    const newTree = await handleMove(node, parent);
    tree = newTree;
    movingNode = null;
  }}
            {handleCreate}
            {handleUpdate}
            {handleDelete}
            bind:movingNode
            on:openCreateModal={onCreateModalOpen}
            on:openUpdateModal={editItem}
            on:goToNode={onGotToNode}

    >
        <svelte:fragment slot="updateModal">
            <Modal bind:open={showEditItemModal} size="xl" title="Edit Item">
                <AddEditBusinessCategoryItem onSave={onSaveItem} model={selectedItem} />

            </Modal>
        </svelte:fragment>
        <svelte:fragment slot="createModal">
            <Modal bind:open={showAddItemModal} size="xl" title="Add Item">
                <AddEditBusinessCategoryItem onSave={onSaveItem} parentId={currentParent?.uuid || null} parent={currentParent} />

            </Modal>
        </svelte:fragment>
    </SimpleTreeSelector>
{/if}

