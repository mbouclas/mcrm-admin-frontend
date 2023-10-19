<script lang="ts">
import Index from './index.svelte';
import FieldRenderer from './field-rendering.svelte';
import {Route, Router} from "mcrm-svelte-navigator";
</script>
<Router>
    <Route path="" component={Index} />
    <Route path="fields" component={FieldRenderer} />
</Router>
