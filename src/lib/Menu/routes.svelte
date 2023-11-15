<script lang="ts">

    import {Route, Router} from "mcrm-svelte-navigator";
    import List from './index.svelte';
    import MenuItems from './menu-items.svelte';
</script>
<Router>
    <Route path="" component={List} />
    <Route path="/:id" component={MenuItems} />
</Router>
