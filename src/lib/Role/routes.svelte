<script>
  import { Router, Route } from 'mcrm-svelte-navigator';
  import Roles from './Role/Roles.svelte';
  import RoleView from './Role/RoleView.svelte';
</script>

<Router>
  <Route path="list" component={Roles} />
  <Route path=":id" component={RoleView} />
</Router>
