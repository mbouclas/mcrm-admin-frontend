<script lang="ts">
import {onMount} from "svelte";
import {OrderStatsService} from "../Order/services/order/order-stats.service";
import {Button, Heading, Hr, Modal} from "flowbite-svelte";
import Loading from "../Shared/Loading.svelte";
import Date from '../CustomFields/field-types/date.svelte';
import {dateFormat} from "../helpers/dates";
import Widget from "../Shared/widget.svelte";
import {CalendarEditOutline} from "flowbite-svelte-icons";
import SalesByDay from './widgets/sales-by-day.svelte';
import SalesByMonth from './widgets/sales-by-month.svelte';
import SalesByYear from './widgets/sales-by-year.svelte';
import TopSalesChannels from './widgets/top-grossing-channels.svelte';
import TopUsers from './widgets/top-grossing-users.svelte';

let ready = false,
stats: any = {};
let dates: string[] = [];
let showDatePickerModal = false;
let limit = 5;

onMount(async () => {
    await search();
 ready = true;
})

async function search() {
    stats = await new OrderStatsService().stats(['salesByDate', 'salesByMonth', 'salesByYear', 'topGrossingUsers', 'topGrossingSalesChannels'], dates, limit)
    console.log(stats)
}

async function onDateSelect(selectedDates: string[]) {
    if (selectedDates.length === 1) {
        return;
    }
    // get the first and last date
    const from = selectedDates[0];
    const to = selectedDates[selectedDates.length - 1];
    dates = [from, to];
    showDatePickerModal = false;
    await search();
}

</script>
<div class="flex justify-between">
    <Heading tag="h4">Store Overview</Heading>
    <span></span>
    <div class="w-full justify-end inline-flex">

        <Button on:click={() => showDatePickerModal = true} class="gap-2.5" color="purple"><CalendarEditOutline /> Select Date</Button>
    </div>
</div>

<Hr />
{#if dates.length === 2}
<div class="text-base">
    Showing results from
        <strong class="text-indigo-500">{dateFormat(dates[0], 'DD, MMMM, YYYY')}</strong>

        to <strong class="text-indigo-500">{dateFormat(dates[1], 'DD, MMMM, YYYY')}</strong>
</div>
{/if}
<Modal title="Select Dates" autoclose={false} size="xl" bind:open={showDatePickerModal}>
    <Date type="multiple" onSelect={onDateSelect} bind:model={dates} withPresets={true} />
</Modal>

{#if ready}
    <div class="my-4">
        <SalesByDay />
        </div>
    <div class="my-4">
        <SalesByMonth />
    </div>

    <div class="my-4">
        <SalesByYear />
    </div>

        <div class="my-4">
    <TopSalesChannels />
            </div>
        <div class="my-4">
<TopUsers />
            </div>



    {:else}
        <div class="flex justify-center"><Loading /></div>
{/if}
