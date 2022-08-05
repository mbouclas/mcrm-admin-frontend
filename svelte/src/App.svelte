<script lang="ts">
  import { Router, Route, Link } from "svelte-navigator";
  import Login from "./lib/Auth/Login.svelte";
  import PrivateRoute from "./lib/Auth/PrivateRoute.svelte";
  import DefaultLayout from './lib/layouts/default.svelte'
</script>

<Router>

<Route path="login">
  <Login />
</Route>



<PrivateRoute path="/*" let:location>
<DefaultLayout />

</PrivateRoute>


</Router>