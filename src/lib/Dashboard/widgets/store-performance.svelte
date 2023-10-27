<script lang="ts">
import Widget from "../../Shared/widget.svelte";
import Chart from 'chart.js/auto'
import {onMount} from "svelte";
import {OrderStatsService} from "../../Order/services/order/order-stats.service";
import Loading from "../../Shared/Loading.svelte";
import dayjs from 'dayjs'
import { Colors } from 'chart.js';

export let id = 'store-performance';
export let width = '100%';
export let height = '300px';
export let label = 'Sales';
let ready = false;
let stats = {};


onMount(async () => {
    stats = await new OrderStatsService().stats(['salesByDate', 'salesByMonth'])

    ready = true;

    // Wait for the DOM to update
    setTimeout(() => {
        Chart.register(Colors);
        new Chart(
            id,
            {
                type: 'bar',
                options: {
                    responsive: true,
                    plugins: {
                        colors: {
                            enabled: true,
                            forceOverride: true
                        }
                    }
                },
                data: {
                    labels: stats['salesByMonth'].map(row => {

                        const d = dayjs(row.saleMonth);
                        //convert the numeric month to a string

                        return d.format('MMMM');
                    }),
                    datasets: [
                        {
                            label,
                            data: stats['salesByMonth'].map(row => row.totalSales)
                        }
                    ]
                }
            }
        );

        new Chart(
            'past-30-days',
            {
                type: 'line',
                options: {
                    responsive: true,
                    plugins: {
                        colors: {
                            enabled: true
                        }
                    }
                },
                data: {
                    labels: stats['salesByDate'].map(row => {

                        const d = dayjs(row.saleDate);
                        //convert the numeric month to a string

                        return d.format('DD/MM');
                    }),
                    datasets: [
                        {
                            label,
                            data: stats['salesByDate'].map(row => row.totalSales),
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                        }
                    ]
                }
            }
        );
    })
})
</script>
<div class="grid grid-cols-2 gap-2.5">
    <Widget>
        <svelte:fragment slot="heading">Sales Per Month</svelte:fragment>

        {#if !ready}
            <div class="flex justify-center">
                <Loading />
            </div>

        {:else}
            <canvas {id} style={`width: ${width}; height: ${height}`}></canvas>
        {/if}
    </Widget>

    <Widget>
        <svelte:fragment slot="heading">Past 30 days</svelte:fragment>

        {#if !ready}
            <div class="flex justify-center">
                <Loading />
            </div>

        {:else}
            <canvas id="past-30-days" style={`width: ${width}; height: ${height}`}></canvas>
        {/if}
    </Widget>

</div>
