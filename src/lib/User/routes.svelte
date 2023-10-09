<script>
  import { Router, Route } from 'mcrm-svelte-navigator';
  import Users from './User/Users.svelte';
  import UserView from './User/UserView.svelte';
</script>

<Router>
  <Route path="list" component={Users} />
  <Route path=":id" component={UserView} />
</Router>
