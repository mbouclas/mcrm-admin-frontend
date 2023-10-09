<script>
  import { Router, Route } from 'mcrm-svelte-navigator';
  import Gates from './Gate/Gates.svelte';
  import GateView from './Gate/GateView.svelte';
</script>

<Router>
  <Route path="list" component={Gates} />
  <Route path=":id" component={GateView} />
</Router>
