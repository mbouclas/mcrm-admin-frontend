<script>
  import { Router, Route } from 'mcrm-svelte-navigator';
  import Condition from './Conditions/Condition.svelte';
  import ConditionList from './Conditions/Conditions.svelte';
  import Shipping from './Shipping/shipping.svelte';
  import CustomFields from '../CustomFields/index.svelte';
  import CustomFieldList from '../CustomFields/model-field-list.svelte';
  import SalesChannelsList from '../SalesChannels/sales-channels-list.svelte';
  import PaymentMethodsList from './PaymentMethods/index.svelte';
  import CustomerGroupsList from '../CustomerGroups/index.svelte';
</script>

<Router>
  <Route path="conditions/list" component={ConditionList} />

  <Route path="conditions/:id" component={Condition} let:params />
  <Route path="shipping" component={Shipping} let:params />
  <Route path="sales-channels" component={SalesChannelsList} let:params />
  <Route path="payment-methods" component={PaymentMethodsList} let:params />
  <Route path="customer-groups" component={CustomerGroupsList} let:params />
  <Route path="cf" component={CustomFields} let:params />
  <Route path="cf/:id" component={CustomFieldList} let:params />
</Router>
