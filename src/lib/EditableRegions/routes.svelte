<script lang="ts">
    import { Router, Route } from "mcrm-svelte-navigator";
    import Main from './main.svelte';
    import Edit from './layouts/edit.svelte';
    import View from './layouts/view.svelte';
    import Fill from './regions/fill.svelte'
</script>

<Router>
    <Route path="" component={Main} />
    <Route path=":name" component={Edit} />
    <Route path=":name/view" component={View} />
    <Route path="/:name/fill/:regionId" component={Fill} />
</Router>
