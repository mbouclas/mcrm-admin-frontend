<script>
  import { Route } from "svelte-navigator";
  import PrivateRouteGuard from "./private-route-guard.svelte";

  export let path;

</script>

<Route {path} let:params let:location let:navigate>
<h1>Profile</h1>
  <PrivateRouteGuard>
    <slot {params} {location} {navigate} />
  </PrivateRouteGuard>
</Route>
