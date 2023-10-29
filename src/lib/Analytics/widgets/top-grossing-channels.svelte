<script lang="ts">
    import Widget from "../../Shared/widget.svelte";
    import DateSelector from "./date-selector.svelte";
    import {onMount} from "svelte";
    import {OrderStatsService} from "../../Order/services/order/order-stats.service";
    import Chart from './chart.svelte';
    import DateRange from "./date-range-heading.svelte";
    import type {ChartData} from "chart.js";
    import {moneyFormat} from "../../helpers/money";

    let dates = [];
    let ready = false;
    let stats;
    let data: ChartData
    const id = 'topGrossingSalesChannels';
    let triggerUpdate = false;

    const plugins = {
        tooltip: {
            callbacks: {
                title: (ctx) => {
                    // console.log('*-----', ctx.dataIndex)
                },
                label: (ctx) => {
                    return `Sales: ${ctx.parsed.y}\n
                        Amount: ${moneyFormat(stats[ctx.dataIndex].totalAmount)}`;
                },
            }
        }
    };

    onMount(async () => {
        await search();
        ready = true;
    });

    async function search() {
        stats = await new OrderStatsService().load('topGrossingSalesChannels', dates, 12);

        data = {
            labels: stats.map(row => row.channel.title),
            datasets: [
                {
                    label: 'Sales',
                    data: stats.map(row => row.totalSales),
                    fill: false,
                    backgroundColor: '#42a5f5',
                    borderColor: '#42a5f5',
                    tension: 0.1
                }
            ]
        }

    }

    async function onDateSelect(selectedDates: string[]) {
        dates = selectedDates;
        await search();
        triggerUpdate = true;
    }
</script>

<Widget>
    <svelte:fragment slot="heading">Top Grossing Sales Channels</svelte:fragment>
    <div slot="actions">
        <DateSelector bind:dates={dates} onDateChange={onDateSelect} {id} />
    </div>
    <DateRange bind:dates={dates} />
    {#if ready}
        <Chart {id} {data} bind:triggerUpdate={triggerUpdate} type="bar" {plugins} />
    {/if}
</Widget>
