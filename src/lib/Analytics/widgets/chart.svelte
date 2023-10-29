<script lang="ts">
    import Chart from "chart.js/auto";
    import type {ChartData, ChartTypeRegistry, Plugin} from "chart.js";
    import {onMount} from "svelte";
    import type AnyObject from "mcrm-svelte-navigator/types/AnyObject";

    export let data: ChartData;
    export let id: string;
    export let label = 'Sales';
    export let type: keyof ChartTypeRegistry= 'bar';
    export let width = '100%';
    export let height = '300px';
    export let triggerUpdate = false;
    export let plugins: any = undefined;
    let chart: Chart;

onMount(() => {
    chart = new Chart(
        id,
        {
            type,
            options: {
                responsive: true,
                plugins: plugins || undefined,
            },
            data,

        }
    );

})

$: {
    if (triggerUpdate && triggerUpdate === true) {
        console.log('trigger update', data);
        chart.data = data;
        chart.update()
        triggerUpdate = false;
    }
}
</script>
<canvas {id} style={`width: ${width}; height: ${height}`}></canvas>
