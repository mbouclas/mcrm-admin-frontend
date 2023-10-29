<script lang="ts">
    import {Button, Modal} from "flowbite-svelte";
    import Date from "../../CustomFields/field-types/date.svelte";
    import {v4} from "uuid";
    import {CalendarEditOutline} from "flowbite-svelte-icons";

    export let dates: string[] = [];
    export let id = v4();
    let showDatePickerModal = false;
    export let onDateChange: (dates: string[]) => void;

    function onDateSelect(selectedDates: string[]) {
        if (selectedDates.length === 1) {
            return;
        }
        // get the first and last date
        const from = selectedDates[0];
        const to = selectedDates[selectedDates.length - 1];
        dates = [from, to];

        if (onDateChange) {
            onDateChange(dates);
        }

        showDatePickerModal = false;

    }
</script>
<Button on:click={() => showDatePickerModal = true} class="gap-2.5" color="purple"><CalendarEditOutline /> Select Date</Button>
<Modal title="Select Dates" autoclose={false} size="xl" bind:open={showDatePickerModal}>
    <Date type="multiple" onSelect={onDateSelect} bind:model={dates} withPresets={true} />
</Modal>
