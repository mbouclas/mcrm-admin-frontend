<script lang="ts">
  import { Router, Route, Link, useLocation } from "svelte-navigator";
  import PrivateRoute from "../Auth/PrivateRoute.svelte";
  import Header from "../Shared/Header.svelte";
  import Topbar from "../Shared/Topbar.svelte";
  import About from "../Dashboard/About.svelte";
  import Profile from "../User/Profile.svelte";
  import CatalogueRoutes from "../Catalogue/routes.svelte";
  import OrderRoutes from "../Order/routes.svelte";
  import EditableRegions from "../EditableRegions/routes.svelte";
  import { BootService } from "../Shared/boot.service";
  import { onMount } from "svelte";
  import { notificationsStore } from "../stores";
  import type { INotification } from "../stores";

  let url,
  showNotifications: INotification|null = null;
  const promise = new BootService().boot();

  notificationsStore.subscribe((state: INotification|null) => {
    if (!state) {return;}
    showNotifications = state;
  });

  // (new BootService()).boot().then(res => console.log('done'));
  onMount(async () => {});

  const location = useLocation();

  $: {
    url = $location.pathname;
  }

  location.subscribe((r) => console.log(r));

  let open = false;
</script>
{#if showNotifications}
{JSON.stringify(showNotifications)}
  Show notifications component
{/if}

{#await promise then res}
  <Router>
    <div class="flex">
      <Header bind:open />
      <div class="bg-[#222736]  w-full">
        <Topbar bind:open />
        <!-- {url} -->
        <div class="p-4 body">
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

          <PrivateRoute path="orders/*" let:location>
            <OrderRoutes />
          </PrivateRoute>

          <PrivateRoute path="editable-regions/*" let:location>
            <EditableRegions />
          </PrivateRoute>
        </div>
      </div>
    </div>
  </Router>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
