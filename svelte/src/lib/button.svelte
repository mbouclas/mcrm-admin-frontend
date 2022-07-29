<script>
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();
export let type = 'button';
export let label = 'Click Me';
// export let onClick = handleOnClick;


function handleOnClick(event) {
  		dispatch('clicked', {
			text: 'Hello!'
		});
};

</script>

<button type={type} 
on:click={handleOnClick}>{label}</button>