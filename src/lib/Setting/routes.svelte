<script>
  import { Router, Route } from 'svelte-navigator';
  import Condition from './Conditions/Condition.svelte';
  import ConditionList from './Conditions/Conditions.svelte';
</script>

<Router>
  <Route path="conditions/list" component={ConditionList} />

  <Route path="conditions/:id" component={Condition} let:params />
</Router>
