<script>
  import { Router, Route, Link } from "svelte-navigator";
  // import OrderList from "./Order/OrderList.svelte";
  import OrderList from "./Order/Orders.svelte";
  import Order from "./Order/OrderView.svelte";
</script>

<Router>
  <Route path="list" component={OrderList} />

  <Route path=":id" component={Order} />
</Router>
