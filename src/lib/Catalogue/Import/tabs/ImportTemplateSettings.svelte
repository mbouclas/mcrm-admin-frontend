<script lang="ts">
  import DropDown from '../../../Shared/DropDown.svelte';

  const settingValues: any[] = [',', '|', ' ', ';'];

  export let item: any;
</script>

<div class="bg-gray-800 p-3 rounded-md">
  <h2 class="mb-4 text-xl lg:text-2xl tracking-tight font-extrabold text-gray-900 dark:text-white outline-none">
    Settings
  </h2>

  <div class="mb-4">
    <DropDown placeholder="Delimiter" label="Delimiter" bind:value={item['delimiter']} values={settingValues} />
  </div>
</div>
