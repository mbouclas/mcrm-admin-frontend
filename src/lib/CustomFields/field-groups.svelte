<script lang="ts">
    import type {IBaseModelFieldGroup} from "./models/groups.model";
    import {
        Button,
        Modal,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell
    } from "flowbite-svelte";
    import {Plus, Trash} from "svelte-heros-v2";
    import EditGroup from './add-edit-group.svelte';
    import {EditOutline} from "flowbite-svelte-icons";
    import type {IBaseModel} from "../DynamicFields/base-model";
    import {CustomFieldsService} from "./services/custom-fields.service";
    import {setNotificationAction} from "../stores";

    export let groups: IBaseModelFieldGroup[] = [];
    export let model: IBaseModel;

    let showAddGroupModal = false,
        showEditGroupModal = false,
        selectedGroup: IBaseModelFieldGroup = null;

    function onAddGroup() {

    }

    function edit(group: IBaseModelFieldGroup) {
        selectedGroup = group;
        showEditGroupModal = true;
    }

    async function remove(idx: number) {
        if (!confirm('Are you sure you want to delete this group?')) {
            return;
        }
        const temp = [...groups];
        temp.splice(idx, 1);

        groups = temp;

        await save();
    }

    async function save() {
        const temp = Object.assign({}, model);
        const foundIdx = temp.fieldGroups.findIndex(g => g.name === selectedGroup.name);
        if (foundIdx > -1) {
            temp.fieldGroups[foundIdx] = selectedGroup;
        } else {
            temp.fieldGroups.push(selectedGroup);
        }

        groups = temp.fieldGroups;
        model = temp;

        await (new CustomFieldsService()).syncFieldGroups(model.name, groups);

    }

</script>
<Modal title="Add Group" autoclose={false} size="xl" bind:open={showAddGroupModal} on:close={() => selectedGroup = null}>
    <EditGroup onSave={save} bind:model={selectedGroup} fields={model.fields} />
</Modal>

<Modal title="Edit Group" autoclose={false} size="xl" bind:open={showEditGroupModal} on:close={() => selectedGroup = null} >
    <EditGroup onSave={save} bind:model={selectedGroup} fields={model.fields} />
</Modal>
<Table>
    <TableHead defaultRow={false}>
        <tr>
            <TableHeadCell colspan="6">
                <div class="flex justify-end">
                    <Button color="green" on:click={() => showAddGroupModal = true}><Plus /></Button>
                </div>
            </TableHeadCell>
        </tr>
        <tr>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Label</TableHeadCell>
            <TableHeadCell>Description</TableHeadCell>
            <TableHeadCell>#Fields</TableHeadCell>
            <TableHeadCell></TableHeadCell>
        </tr>
    </TableHead>
    <TableBody class="divide-y">
        {#each groups as group, idx}
            <TableBodyRow>
                <TableBodyCell>{group.name}</TableBodyCell>
                <TableBodyCell>{group.label}</TableBodyCell>
                <TableBodyCell>{group.description}</TableBodyCell>
                <TableBodyCell>{Array.isArray(group.fields) ? group.fields.length : 0}</TableBodyCell>
                <TableBodyCell>
                    <Button on:click={edit.bind(this, group)}><EditOutline /></Button>
                    <Button on:click={remove.bind(this, idx)}><Trash color="red" /></Button>
                </TableBodyCell>
            </TableBodyRow>
        {/each}
    </TableBody>
</Table>
