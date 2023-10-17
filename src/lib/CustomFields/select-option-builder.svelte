<script lang="ts">
import type {ICustomFieldSelectOption} from "./services/custom-fields.service";
import {
    Button,
    Input,
    Label,
    Radio,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell
} from "flowbite-svelte";
import {Plus, Trash} from "svelte-heros-v2";

export let model: ICustomFieldSelectOption[] = [];
let defaultItem = 0;

function setDefault(idx: number) {
    defaultItem = idx;
    const temp = Object.assign([], model);
    temp.forEach((item, i) => {
        item.default = i === idx;
    });

    model = temp;
}

function addRow() {
    const temp = Object.assign([], model);
    temp.push({
        label: '',
        value: '',
        default: false
    });
    model = temp;
}

function removeRow(idx: number) {
    const temp = Object.assign([], model);
    temp.splice(idx, 1);
    model = temp;
}
</script>
<Table>
    <TableHead defaultRow={false}>
        <tr>
            <TableHeadCell colspan="4">
                <div class="justify-end flex">
                    <Button color="green" on:click={addRow}><Plus/></Button>
                </div>

            </TableHeadCell>
        </tr>
        <tr>
        <TableHeadCell>Label</TableHeadCell>
        <TableHeadCell>Value</TableHeadCell>
        <TableHeadCell>Default</TableHeadCell>
        <TableHeadCell></TableHeadCell>
        </tr>
    </TableHead>
    <TableBody class="divide-y">
        {#each model as item, idx}
            <TableBodyRow>
                <TableBodyCell>
                    <Input bind:value={item.label} placeholder="Label" />
                </TableBodyCell>
                <TableBodyCell><Input bind:value={item.value} placeholder="Value" /></TableBodyCell>
                <TableBodyCell><Radio bind:group={defaultItem} value={idx} on:change={setDefault.bind(this, idx)} /></TableBodyCell>
                <TableBodyCell><Button on:click={removeRow.bind(this, idx)}>
                    <Trash color="red" />
                </Button></TableBodyCell>
            </TableBodyRow>
        {/each}
    </TableBody>
</Table>
