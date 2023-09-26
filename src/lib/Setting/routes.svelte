<script>
  import { Router, Route } from 'svelte-navigator';
  import Condition from './Conditions/Condition.svelte';
  import ConditionList from './Conditions/Conditions.svelte';
  import Shipping from './Shipping/shipping.svelte';
</script>

<Router>
  <Route path="conditions/list" component={ConditionList} />

  <Route path="conditions/:id" component={Condition} let:params />
  <Route path="shipping" component={Shipping} let:params />
</Router>
