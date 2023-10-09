<script>
  import { DateTime, Info } from 'luxon';
  import DayItem from './DayItem.svelte';
  import { ChevronLeft, ChevronRight } from 'svelte-heros-v2';

  export let onSelect;
  export let selectedValues = [];
  export let minLimitDate;

  let month;
  let year;

  const nextMonth = () => {
    if (month === 12) {
      month = 1;
      year += 1;
      return null;
    }

    month += 1;
  };

  const previousMonth = () => {
    if (month === 1) {
      month = 12;
      year -= 1;
      return null;
    }

    month -= 1;
  };

  const nextYear = () => {
    year += 1;
    return null;
  };

  const previousYear = () => {
    year -= 1;
    return null;
  };

  $: currentDate = DateTime.local().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  $: month = month || currentDate.month;
  $: year = year || currentDate.year;

  $: dateWithFirstDay = DateTime.fromObject({
    year,
    month,
    day: 1,
  });

  $: firstWeekDay = dateWithFirstDay.weekday.valueOf();

  $: viewDates = new Array(42).fill(null).map((item, index) => {
    let date;
    let isSelectable = true;
    let isHighlighted = true;

    let currentDayView = index + 1;
    let firstDayPostion = firstWeekDay === 7 ? 1 : firstWeekDay + 1;

    if (currentDayView === firstDayPostion) {
      date = dateWithFirstDay;
    }

    if (currentDayView < firstDayPostion) {
      date = dateWithFirstDay.minus({
        day: firstDayPostion - currentDayView,
      });

      if (date.month !== dateWithFirstDay.month) {
        isHighlighted = false;
      }
    }

    if (currentDayView > firstDayPostion) {
      date = dateWithFirstDay.plus({
        day: currentDayView - firstDayPostion,
      });

      if (date.month !== dateWithFirstDay.month) {
        isHighlighted = false;
      }
    }
    if (minLimitDate && minLimitDate >= date) {
      isSelectable = false;
    }

    const isSelected =
      minLimitDate &&
      date.year === minLimitDate.year &&
      date.month === minLimitDate.month &&
      date.day === minLimitDate.day;

    return {
      date,
      isSelected,
      isSelectable,
      isHighlighted,
    };
  });
</script>

<div>
  <div class="wrapper">
    <div class="head">
      <div class="head-item">
        <div class="year">
          <div class="control-date" on:click={() => previousYear()}>
            <ChevronLeft />
          </div>
          <div class="date-item"><span>{year}</span></div>
          <div class="control-date" on:click={() => nextYear()}>
            <ChevronRight />
          </div>
        </div>
      </div>
      <div class="head-item">
        <div class="month">
          <div class="control-date" on:click={() => previousMonth()}>
            <ChevronLeft />
          </div>
          <div class="date-item">
            <span>{Info.months()[month - 1]}</span>
          </div>
          <div class="control-date" on:click={() => nextMonth()}>
            <ChevronRight />
          </div>
        </div>
      </div>
    </div>
    <div class="days">
      <div class="item weekdays">Sun</div>
      <div class="item weekdays">Mon</div>
      <div class="item weekdays">Tue</div>
      <div class="item weekdays">Wed</div>
      <div class="item weekdays">Thu</div>
      <div class="item weekdays">Fri</div>
      <div class="item weekdays">Sat</div>

      {#each viewDates as viewDate}
        <DayItem {minLimitDate} {onSelect} {viewDate} />
      {/each}
    </div>
  </div>
</div>

<style type="text/postcss">
  .wrapper {
    @apply grid bg-gray-900 border-solid py-6 px-10 border-2 border-gray-800 rounded-xl;
    width: 100%;
  }

  .year {
    @apply grid grid-flow-col font-bold text-white;
    grid-template-columns: min-content min-content min-content;
  }

  .month {
    @apply grid grid-flow-col text-white font-bold;
    grid-template-columns: min-content min-content min-content;
  }

  .date-item {
    @apply grid justify-center items-center text-lg text-center;
    width: 120px;
  }

  .days {
    @apply grid text-white gap-2;
    justify-items: center;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(7, 1fr);
  }

  .control-date {
    @apply grid cursor-pointer items-center;
  }

  .head {
    @apply grid grid-flow-col bg-gray-800 rounded-md;
    justify-items: center;
  }
  .weekdays {
    @apply font-bold text-lg;
  }

  .item {
    @apply grid justify-center items-center;
  }

  .head-item {
    @apply grid justify-center grid-flow-col;
    grid-template-columns: min-content;
  }
</style>
