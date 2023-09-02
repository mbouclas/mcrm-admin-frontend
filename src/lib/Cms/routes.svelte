<script>
  import { Router, Route, Link } from 'svelte-navigator';
  import Page from './Pages/Page.svelte';
  import PageList from './Pages/Pages.svelte';
  import PageCategoriesList from './Pages/PageCategoriesList.svelte';
</script>

<Router>
  <Route path="pages/list" component={PageList} />

  <Route path="pages/categories" component={PageCategoriesList} />

  <Route path="pages/:id" component={Page} let:params />
</Router>
