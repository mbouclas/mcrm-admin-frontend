<script>
  import { Router, Route, Link } from 'mcrm-svelte-navigator';
  import Page from './Pages/Page.svelte';
  import PageList from './Pages/Pages.svelte';
  import PageCategoriesList from './Pages/PageCategoriesList.svelte';
</script>

<Router>
  <Route path="pages/list" component={PageList} />

  <Route path="categories" component={PageCategoriesList} />

  <Route path="pages/:id" component={Page} let:params />
</Router>
