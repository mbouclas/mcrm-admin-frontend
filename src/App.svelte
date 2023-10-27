<script lang="ts">
  import { Router, Route, Link } from "mcrm-svelte-navigator";
  import Login from "./lib/Auth/Login.svelte";
  import Logout from "./lib/Auth/Logout.svelte";
  import PrivateRoute from "./lib/Auth/PrivateRoute.svelte";
  import DefaultLayout from "./lib/layouts/default.svelte";

  import { user } from "./lib/stores";

</script>

<Router>
  <Route path="login">
    <Login />
  </Route>

  <Route path="logout">
    <Logout />
  </Route>

  <PrivateRoute path="/*" let:location>
    <DefaultLayout />
  </PrivateRoute>
</Router>

<style global>
  body.lock-scroll {
    overflow-y: hidden !important;
  }
</style>
