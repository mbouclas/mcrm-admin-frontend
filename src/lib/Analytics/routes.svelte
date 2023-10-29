<script lang="ts">
    import {Route, Router} from "mcrm-svelte-navigator";
    import Orders from "./orders.svelte";
    import Merchandising from "./merchandising.svelte";
    import Predictive from "./predictive.svelte";
</script>
<Router>
    <Route path="/orders" component={Orders}/>
    <Route path="/merchandising" component={Merchandising}/>
    <Route path="/predictive" component={Predictive}/>
</Router>
