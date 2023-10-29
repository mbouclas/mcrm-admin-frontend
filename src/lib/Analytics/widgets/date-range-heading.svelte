<script lang="ts">
    import {dateFormat} from "../../helpers/dates";

    export let dates: string[] = [];
</script>

{#if dates.length === 2}
    <div class="text-base">
        Showing results from
        <strong class="text-indigo-500">{dateFormat(dates[0], 'DD, MMMM, YYYY')}</strong>

        to <strong class="text-indigo-500">{dateFormat(dates[1], 'DD, MMMM, YYYY')}</strong>
    </div>
{/if}
