<script lang="ts">
  import {createEventDispatcher} from "svelte";
  const dispatch = createEventDispatcher();
  export let group
  export let value
  export let checked = false;
  export let classes = '';
  export let name = ''
</script>


<input
        type="checkbox"
        name={name}
        id={name}
        bind:checked={checked}
        value={value}
        on:change={() => {
          dispatch("change", value)
        }}
        class={`${classes}  w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500`}
/>
<label for={name} class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
<slot></slot>
</label>
