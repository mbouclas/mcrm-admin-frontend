<script lang="ts">
  import { Tabs, TabItem } from 'flowbite-svelte';
  import General from './tabs/General.svelte';

  import { useParams } from 'svelte-navigator';
  import Form from '../../DynamicFields/Form.svelte';
  import { ConditionsService } from '../services/conditions/condition.service';
  import { onMount } from 'svelte';
  import { AppService } from '../../Shared/app.service';
  import type { IDynamicFieldConfigBlueprint } from '../../DynamicFields/types';
  import getModelPrototypeFromFields from '../../helpers/model-prototype';
  import { RequestErrorException, clearErrors, handleValidationErrors } from '../../helpers/helperErrors';

  const s = new ConditionsService();
  const params = useParams();
  let model;
  let fields: IDynamicFieldConfigBlueprint[] = [];
  export let itemId;

  const defaultConditiontatus = {
    title: {
      errors: [],
    },
    value: {
      errors: [],
    },
    type: {
      errors: [],
    },
    target: {
      errors: [],
    },
  };

  let conditionStatus = defaultConditiontatus;

  onMount(async () => {
    fields = AppService.getModel('CartConditionModel').fields;

    if (itemId) {
      model = await s.findOne(itemId, ['*']);
    } else {
      if ($params.id === 'new') {
        model = getModelPrototypeFromFields(fields);
        model.rules = [];
        model.attributes = {};
      } else {
        model = await s.findOne($params.id, ['*']);
        if (!model?.rules?.length) {
          model.rules = [];
        }
      }
    }
  });

  const onSubmit = async (data) => {
    conditionStatus = clearErrors(conditionStatus);
    try {
      if ($params.id === 'new') {
        await s.store(data);
        return null;
      }
      await s.update($params.id, data);
    } catch (e) {
      if (e instanceof RequestErrorException) {
        conditionStatus = handleValidationErrors(e.details.validationErrors, conditionStatus);
        return null;
      }
    }
  };

  let customActiveClass =
    'inline-block p-4 text-white rounded-t-lg border-b-2 border-white active dark:text-white-500 dark:border-white-500';
  let customInActiveClass =
    'inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300';

  let hasError = false;
</script>

<Form bind:model {hasError}>
  <Tabs tabStyle="underline" class="mb-4">
    <TabItem open title="General" tabStyle="custom" {customActiveClass} {customInActiveClass}>
      <General {onSubmit} {fields} status={conditionStatus} {model} />
    </TabItem>
    {#if $params.id !== 'new'}{/if}
  </Tabs>
</Form>
<div class="mb-12 pb-6" />
