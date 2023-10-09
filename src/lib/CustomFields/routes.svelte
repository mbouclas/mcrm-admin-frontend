<script lang="ts">
    import { Router, Route, Link } from 'mcrm-svelte-navigator';
    import ListFields from './index.svelte';
    import FieldList from './model-field-list.svelte'
</script>
<Router>
    <Route path="list" component={ListFields} />
    <Route path="settings/cf/:id" component={FieldList} />
</Router>
