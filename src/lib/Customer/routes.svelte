<script>
  import { Router, Route, Link } from 'svelte-navigator';
  import CustomerList from './Customer/Customers.svelte';
  import Customer from './Customer/Customer.svelte';
</script>

<Router>
  <Route path="list" component={CustomerList} />

  <Route path=":id" component={Customer} />
</Router>
