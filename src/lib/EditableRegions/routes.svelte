<script lang="ts">
    import { Router, Route } from "mcrm-svelte-navigator";
    import Main from './main.svelte';
    import Edit from './layouts/edit.svelte';
</script>

<Router>
    <Route path="" component={Main} />
    <Route path=":name" component={Edit} />
</Router>
