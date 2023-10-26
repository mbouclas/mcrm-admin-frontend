<script>
  import { Router, Route, Link } from 'mcrm-svelte-navigator';
  import OrderList from './Order/Orders.svelte';
  import Order from './Order/OrderView.svelte';
  import New from './Order/wizard/index.svelte';
</script>

<Router>
  <Route path="new" component={New} />
  <Route path="list" component={OrderList} />

  <Route path=":id" component={Order} />
</Router>
