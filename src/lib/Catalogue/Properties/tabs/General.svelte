<script lang="ts">
  import type { IDynamicFieldConfigBlueprint } from '../../../DynamicFields/types';
  import Loading from '../../../Shared/Loading.svelte';
  import Input from '../../../Shared/Input.svelte';
  import DropDown from '../../../Shared/DropDown.svelte';

  export let fields: IDynamicFieldConfigBlueprint[] = [];
  export let model;

  const defaultStatusData = {
    title: {
      errors: [],
    },
    description: {
      errors: [],
    },
    type: { erorrs: [] },
  };
  let status = defaultStatusData;
</script>

{#if !model}<Loading /> {/if}
{#if model}
  <form>
    <div class="grid md:grid-cols-2 md:gap-6">
      <div class="relative z-0 w-full mb-6 group">
        <div class="mb-4">
          <Input bind:value={model.title} bind:errors={status.title.errors} placeholder="Title" label="Title" />
        </div>

        <div class="mb-4">
          <Input
            bind:value={model.description}
            bind:errors={status.description.errors}
            placeholder="Title"
            label="Title"
          />
        </div>

        <div class="mb-4">
          <DropDown
            placeholder="Select type"
            label="Type"
            bind:value={model.type}
            values={fields
              .find((field) => field.varName === 'type')
              .ui.defaultValues.map((item) => ({
                key: item,
                value: item,
              }))}
          />
        </div>
      </div>
    </div>
  </form>
{/if}
