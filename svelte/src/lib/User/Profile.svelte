<script>
  import { Router, Route, Link } from "svelte-navigator";
  import Settings from './settings/Settings.svelte';
</script>
<Router>
<h1>Profile</h1>
<Link to="/profile/settings">Edit Settings</Link>


<Route path="settings/*">
<Settings />
</Route>
</Router>
