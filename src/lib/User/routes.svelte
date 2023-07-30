<script>
  import { Router, Route } from 'svelte-navigator';
  import Users from './User/Users.svelte';
</script>

<Router>
  <Route path="list" component={Users} />
</Router>
