<script lang="ts">
// load the Test model from models
import {AppService} from "../Shared/app.service";
import CustomFields from "../CustomFields/group-field-renderer.svelte";
import {Area51Service} from "./area51.service";
import {onMount} from "svelte";
import {Button, Modal} from "flowbite-svelte";
import {Plus} from "svelte-heros-v2";
import {EditOutline} from "flowbite-svelte-icons";

const fields = AppService.getModel('Test').fields;

let model = {},
    ready = false,
    data = [],
    selectedItem = null;

onMount(async () => {
    await search();

    ready = true;
})

async function search() {
    const d = await new Area51Service().getData();

    data = d.data;
}

async function save() {
    await new Area51Service().saveFields(model);
    await search();
    selectedItem = null;
}

function addItem() {
    selectedItem = {};
    model = {};
}

function edit(item) {
    selectedItem = item;
    model = item;
}

</script>
<Button on:click={addItem}><Plus /> Add Item</Button>
<ul>
    {#each data as item}
        <li>
            <Button on:click={edit.bind(this, item)} class="gap-1.5">{item.title} <EditOutline /></Button>
        </li>
    {/each}
</ul>
<Modal title="Backup in progress" autoclose={false} size="xl" bind:open={selectedItem}>
<form on:submit|preventDefault={save}>
<div class="my-4 border border-1 border-gray-500 rounded-xl p-4">
    <CustomFields fields={fields} let:field={field} fieldPrimaryKey="varName" bind:model={model}>

    </CustomFields>
</div>
    <div class="my-4">
        <Button type="submit" class="w-full" color="green">Save</Button>
    </div>
</form>
</Modal>
