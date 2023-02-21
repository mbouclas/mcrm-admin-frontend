<script>
  import { Router, Route, Link } from "svelte-navigator";
  import OrderList from "./Order/OrderList.svelte";
</script>

<Router>
  <Route path="list" component={OrderList} />
</Router>
