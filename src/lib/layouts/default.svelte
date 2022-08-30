<script>
  import { Router, Route, Link, useLocation } from "svelte-navigator";
  import PrivateRoute from "../Auth/PrivateRoute.svelte";
  import Header from "../Shared/Header.svelte";
  import About from "../Dashboard/About.svelte";
  import Profile from "../User/Profile.svelte";
  import CatalogueRoutes from "../Catalogue/routes.svelte";
  import { BootService } from "../Shared/boot.service";
  import { onMount } from "svelte";

  let url;
  const promise =  (new BootService()).boot();
  // (new BootService()).boot().then(res => console.log('done'));
  onMount(async () => {

  });

  const location = useLocation();

  $: {
    url = $location.pathname;
  }

  location.subscribe((r) => console.log(r));
</script>
{#await promise}
{:then res}
<Router>
  <div class="flex bg-[#222736]">
    <Header />
    <!-- {url} -->
    <div class="body p-8 w-full">
      <Route path="/">
        <h1>Home</h1>
      </Route>

      <PrivateRoute path="about/*" let:location>
        <About />
      </PrivateRoute>

      <PrivateRoute path="profile/*" let:location>
        <Profile />
      </PrivateRoute>

      <PrivateRoute path="catalogue/*" let:location>
        <CatalogueRoutes />
      </PrivateRoute>
    </div>
  </div>
</Router>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
