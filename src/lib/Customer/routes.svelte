<script>
  import { Router, Route, Link } from 'mcrm-svelte-navigator';
  import CustomerList from './Customer/Customers.svelte';
  import Customer from './Customer/CustomerView.svelte';
</script>

<Router>
  <Route path="list" component={CustomerList} />

  <Route path=":id" component={Customer} />
</Router>
