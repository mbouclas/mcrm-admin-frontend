<script>
  import { Router, Route, Link, useLocation } from "svelte-navigator";
  import PrivateRoute from "../Auth/PrivateRoute.svelte";
  import Header from "../Shared/Header.svelte";
  import About from "../Dashboard/About.svelte";
  import Profile from "../User/Profile.svelte";
  import CatalogueRoutes from "../Catalogue/routes.svelte";
  import { BootService } from "../Shared/boot.service.ts";
  import { onMount } from "svelte";

  let url;
  onMount(async () => {
    await new BootService().boot();
  });

  const location = useLocation();

  $: {
    url = $location.pathname;
  }

  location.subscribe((r) => console.log(r));
</script>

<Router>
  <div class="flex bg-[#222736]">
    <Header />
    <!-- {url} -->
    <div class="body">
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
