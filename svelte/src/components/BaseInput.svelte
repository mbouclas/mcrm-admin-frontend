<script>
// @ts-nocheck

    	export let label;
    	export let type;
      export let model;

</script>


{#if type==='password'}
<div class="group text-gray-500 mb-4 w-full">
  <label class="text-sm  font-semibold" for="email">{label}</label>
  <input type="password"
  bind:value={model} 
  id={label} class="w-full mt-2 w-full px-3 py-2 text-sm bg-gray-secondary border border-gray-700 rounded" placeholder={`Enter ${label}`}>
</div>
{/if}


{#if type==='text'}
<div class="group text-gray-500 mb-4 w-full">
  <label class="text-sm  font-semibold" for="email">{label}</label>
  <input type="text"
  bind:value={model} 
  id={label} class="w-full mt-2 w-full px-3 py-2 text-sm bg-gray-secondary border border-gray-700 rounded" placeholder={`Enter ${label}`}>
</div>
{/if}

