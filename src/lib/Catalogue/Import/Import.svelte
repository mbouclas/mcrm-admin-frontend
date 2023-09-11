<script lang="ts">
  import { Tabs, TabItem } from 'flowbite-svelte';
  import General from './tabs/General.svelte';
  import ImportTemplates from './tabs/ImportTemplates.svelte';

  let customActiveClass =
    'inline-block p-4 text-white rounded-t-lg border-b-2 border-white active dark:text-white-500 dark:border-white-500';
  let customInActiveClass =
    'inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300';
</script>

<Tabs tabStyle="underline" class="mb-4">
  <TabItem open title="General" tabStyle="custom" {customActiveClass} {customInActiveClass}>
    <General />
  </TabItem>

  <TabItem open title="Import templates" tabStyle="custom" {customActiveClass} {customInActiveClass}>
    <ImportTemplates />
  </TabItem>
</Tabs>
<div class="mb-12 pb-6" />
