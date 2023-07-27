<script>
  export let viewDate;
  export let onSelect;

  let hovering = false;

  const onMouseEnter = () => {
    hovering = true;
  };

  const onMouseLeave = () => {
    hovering = false;
  };

  const onClick = () => {
    if (viewDate.isSelectable) {
      onSelect(viewDate.date);
    }
  };
</script>

<div
  on:click={onClick}
  on:mouseleave={onMouseLeave}
  on:mouseenter={onMouseEnter}
  class={`item day-of-month`}
  class:hoverSuccess={hovering && viewDate.isSelectable}
  class:hoverError={hovering && !viewDate.isSelectable}
  class:day-color={viewDate.isHighlighted}
  class:day-color-faded={!viewDate.isHighlighted}
  class:selected={viewDate.isSelected}
>
  {viewDate.date.day}
</div>

<style type="text/postcss">
  .day-of-month {
    @apply grid text-white rounded-full w-12 h-12 cursor-pointer font-bold text-center;
    box-sizing: border-box;
    align-items: center;
    justify-items: center;
    font-size: 20px;
  }

  .day-color-faded {
    @apply bg-[#0a0a0a];
    opacity: 0.4;
  }

  .day-color {
    @apply bg-[#0a0a0a];
  }

  .hoverSuccess {
    @apply bg-blue-500;
  }

  .hoverError {
    @apply bg-red-500;
  }

  .selected {
    @apply bg-[#0a0a0a] border-gray-300 border-[3px] border-solid;
  }
</style>
