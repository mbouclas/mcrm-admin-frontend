<script lang="ts">
import VanillaCalendar from "@uvarov.frontend/vanilla-calendar";
import "@uvarov.frontend/vanilla-calendar/build/vanilla-calendar.min.css";
import "@uvarov.frontend/vanilla-calendar/build/themes/dark.min.css";
import type {Options, IActions} from "@uvarov.frontend/vanilla-calendar";
import {onMount} from "svelte";
import {datePresets, getDatesBetween} from "../../helpers/dates";
import {Button, Heading, TabItem, Tabs} from "flowbite-svelte";

export let model: string[] = undefined;
export let type: 'default' | 'multiple' | 'month' | 'year' = 'default'
export let id = 'calendar';
export let theme: 'light' | 'dark' = 'dark';
export let withTime = false;
export let disablePast = false;
export let withPresets = false;

export let onSelect: (dates: string[]) => void = () => {};
let presets = withPresets ? datePresets() : null;
let calendar: VanillaCalendar;
const actions: Partial<IActions> = {
    clickDay(event, dates) {
        model = dates;
        if (onSelect) {
            onSelect(dates);
        }
    }
};

onMount(() => {
    initializeCalendar();


})

function initializeCalendar() {
    const options: Options = {
        type,
        settings: {
            visibility: {
                theme,
                daysOutside: false,
            }
        },
        actions,
    };

    if (withTime) {
        options.settings && options.settings.selection ?  {
            time: true,
        } : {
            selection: {
                time: true,
            }
        };
    }

    if (type === 'multiple') {

        options.settings = {...options.settings, ...{
                range: {
                    disablePast
                },
                selection: {
                    day: "multiple-ranged"
                },
            }};
    }



    calendar = new VanillaCalendar(`#${id}`, options);
    if (Array.isArray(model) && model.length > 1) {
        calendar.settings.selected.dates = model;
    }
    calendar.init();
}

function setDate(preset: string = null) {
    //set the date on the calendar
    model = [presets[preset].from, presets[preset].to];

    if (onSelect) {
        onSelect(model);
    }

    if (!calendar || !calendar.HTMLElement) {
        return
    }

    calendar.settings.selected.dates = getDatesBetween(presets[preset].from, presets[preset].to);
    calendar.update();
}

</script>
<slot name="heading"></slot>
<div class={`${withPresets ? 'grid grid-cols-2 gap-2.5' : ''}`}>
    <div {id}></div>
    {#if withPresets && presets}
        <slot name="presets">
        <div class="space-y-1.5">
            <Heading tag="h6">Presets</Heading>
            <div class="grid-cols-2 grid gap-2.5">
                <Button size="sm" color="blue" on:click={setDate.bind(this, 'today')}>Today</Button>
                <Button size="sm" color="blue" on:click={setDate.bind(this, 'yesterday')}>Yesterday</Button>
            </div>
            <div class="grid-cols-2 grid gap-2.5">
                <Button size="sm" color="blue" on:click={setDate.bind(this, 'lastWeek')}>Last Week</Button>
                <Button size="sm" color="blue" on:click={setDate.bind(this, 'lastMonth')}>Last Month</Button>
            </div>
            <div class="grid-cols-2 grid gap-2.5">
                <Button size="sm" color="blue" on:click={setDate.bind(this, 'weekToDate')}>Week To Date</Button>
                <Button size="sm" color="blue" on:click={setDate.bind(this, 'monthToDate')}>Month To Date</Button>
            </div>
            <div class="grid-cols-2 grid gap-2.5">
                <Button size="sm" color="blue" on:click={setDate.bind(this, 'quarterToDate')}>Quarter To Date</Button>
                <Button size="sm" color="blue" on:click={setDate.bind(this, 'yearToDate')}>Year To Date</Button>
            </div>
        </div>
        </slot>
    {/if}
</div>


<style global>
    .vanilla-calendar[data-calendar-theme="light"] {
        border: 1px solid #e8edf3;
    }

    .vanilla-calendar {
        height: max-content;
        max-width: 100%;
        width: 280px;
    }

    .vanilla-calendar_multiple {
        width: 580px;
    }

    .vanilla-calendar * {
        font-family: "Lato", "Helvetica", "Arial", sans-serif;
    }

    .vanilla-calendar-time__keeping {
        background: transparent;
        border: 0;
        padding: 0;
    }

</style>
