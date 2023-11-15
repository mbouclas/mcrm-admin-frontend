<script lang="ts">
    import {navigate, useParams} from "mcrm-svelte-navigator";
import {onMount} from "svelte";
import type {MenuItemModel, MenuModel} from "./models";
import {MenuService} from "./menu.service";
    import {
        Breadcrumb, BreadcrumbItem,
        Button,
        Modal,
    } from "flowbite-svelte";

import AddEditMenuItem from "./add-edit-menu-item.svelte";
    import SimpleTreeSelector from "../Shared/SimpleTreeSelector.svelte";
    import type { IEvent, TreeDeleteType} from "../Shared/models/generic";
    import {setNotificationAction, simpleTreeSelectorStore} from "../stores";
    import {reorderArray} from "../helpers/data";

const params = useParams();
let item: MenuModel,
    movingNode: MenuItemModel,
    tree = [],
ready = false,
    showEditMenuItemModal = false,
    showAddMenuItemModal = false,
    selectedMenuItem: MenuItemModel,
currentParent: MenuItemModel;

onMount(async () => {

    await reload();

    ready = true;
});

async function reload() {
    item = await new MenuService().getMenu($params.id);
    if (!Array.isArray(item.menuItem)) {
        item.menuItem = [];
    }
    tree = item.menuItem;
}

function AddItem() {
    showAddMenuItemModal = true;
}

async function onSaveMenuItem(model:MenuItemModel, tree: MenuItemModel[]) {
    showAddMenuItemModal = false;
    showEditMenuItemModal = false;
    await reload();
    simpleTreeSelectorStore.update((state) => {
        state.value = tree;
        state.action = 'itemAdded';
        return state;
    });
}


function editMenuItem(e: IEvent<{ node: MenuItemModel, parentCategoryName: string }>) {
    selectedMenuItem = e.detail.node;
    showEditMenuItemModal = true;
}

async function handleMove(e: IEvent<{ node: MenuItemModel, parent: MenuItemModel }>) {
    const parentId = (e.detail.parent) ? e.detail.parent.uuid : $params.id;// move to root if no parent found
    await new MenuService().move(e.detail.node.uuid, parentId, $params.id);
    await reload();
    movingNode = null;
    setNotificationAction({
        message: 'Move complete',
        type: 'success',
    });

    simpleTreeSelectorStore.update((state) => {
        state.value = tree;
        state.action = 'itemAdded';
        return state;
    });
}

function onGotToNode(e: IEvent<{ node: MenuItemModel, path: MenuItemModel[] }>) {
    currentParent = e.detail.node;
}

function onCreateModalOpen(e: IEvent<MenuItemModel>) {
    currentParent = e.detail;
    showAddMenuItemModal = true;
}



async function onReorder(e) {
    const temp = Object.assign({}, item);
    const newArr = reorderArray(item.menuItem, e.oldIndex, e.newIndex);
    newArr.forEach((el,idx) => {
        el.order = idx;
    });


    item.menuItem = newArr;
    // save
    await new MenuService().saveOrder(item.menuItem);
}

async function handleDelete(item: MenuItemModel, deleteType: TreeDeleteType) {
    await new MenuService().deleteMenuItem($params.id, item.uuid, deleteType);
    await reload();

    simpleTreeSelectorStore.update((state) => {
        state.value = tree;
        state.action = 'itemAdded';
        return state;
    });
}
</script>

{#if ready}
    <Breadcrumb aria-label="Default breadcrumb example" class="mb-4">
        <BreadcrumbItem home>
            <Button on:click={() => navigate(`/menus`)}>
                Menus
            </Button>
        </BreadcrumbItem>
        <BreadcrumbItem>{item.title}</BreadcrumbItem>
    </Breadcrumb>


    <SimpleTreeSelector
            module="product"
            bind:tree={tree}
            on:selection={(e) => console.log(e)}
            on:handleMove={handleMove}
            handleCreate={(e) => console.log('===', e)}
            handleUpdate={(e) => console.log('***', e)}
            handleDelete={handleDelete}
            on:openCreateModal={onCreateModalOpen}
            on:openUpdateModal={editMenuItem}
            on:goToNode={onGotToNode}
            bind:movingNode

            onMoveEnd={onReorder}
    >
        <svelte:fragment slot="createModal">
            <Modal bind:open={showAddMenuItemModal} size="xl" title="Add Menu Item">
                <AddEditMenuItem onSave={onSaveMenuItem} parentId={currentParent?.uuid || null} menuId={$params.id} />

            </Modal>
        </svelte:fragment>

        <svelte:fragment slot="updateModal">
            <Modal bind:open={showEditMenuItemModal} size="xl" title="Edit Menu Item">
                <AddEditMenuItem model={selectedMenuItem} onSave={onSaveMenuItem} menuId={$params.id} />

            </Modal>
        </svelte:fragment>
    </SimpleTreeSelector>


{/if}
