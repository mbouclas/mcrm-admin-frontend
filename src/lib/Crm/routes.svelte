<script>
    import { Router, Route, Link } from 'mcrm-svelte-navigator';
    import BusinessList from './Business/BusinessesList.svelte';
    import BusinessCategoriesList from './Business/BusinessesCategoriesList.svelte';
    import Business from './Business/Business.svelte';
    import Settings from './Settings.svelte';
    import People from './People/PeopleList.svelte';
    import Person from "./People/Person.svelte";
    import Account from "./Accounts/Account.svelte";
    import AccountList from "./Accounts/AccountList.svelte";
</script>

<Router>
    <Route path="businesses/list" component={BusinessList} />

    <Route path="categories" component={BusinessCategoriesList} />

    <Route path="businesses/:id" component={Business} let:params />
    <Route path="settings" component={Settings} let:params />
    <Route path="people" component={People} let:params />
    <Route path="people/:id" component={Person} let:params />
    <Route path="accounts/:id" component={Account} let:params />
    <Route path="accounts" component={AccountList} let:params />

</Router>
