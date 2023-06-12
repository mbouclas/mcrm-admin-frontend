<script lang="ts">
  import { Router, Route, Link, useLocation } from "svelte-navigator";
  import PrivateRoute from "../Auth/PrivateRoute.svelte";
  import Header from "../Shared/Header.svelte";
  import Topbar from "../Shared/Topbar.svelte";
  import About from "../Dashboard/About.svelte";
  import Profile from "../User/Profile.svelte";
  import CatalogueRoutes from "../Catalogue/routes.svelte";
  import OrderRoutes from "../Order/routes.svelte";
  import { BootService } from "../Shared/boot.service";
  import { onMount } from "svelte";
  import { notificationsStore } from "../stores";
  import type { INotification } from "../stores";
  import { fly } from "svelte/transition";

  let url,
  showNotifications: INotification[] = [];
  const promise = new BootService().boot();

  
let addAndRemove = () => {
  showNotifications = [$notificationsStore[$notificationsStore.length - 1], ...showNotifications];
      setTimeout(() => {
      showNotifications.pop();
      showNotifications = showNotifications;
    }, 3000);
};

$: $notificationsStore && $notificationsStore.length && addAndRemove();

  // (new BootService()).boot().then(res => console.log('done'));
  onMount(async () => {});

  const location = useLocation();

  $: {
    url = $location.pathname;
  }

  location.subscribe((r) => console.log(r));

  let open = false;
</script>
{#if showNotifications && showNotifications.length !== 0}
<div class="notificator-wrapper">
{#each showNotifications as notification}
  <!-- 
  <Toast message={notification.message} type={notification.type} position="tr" show/>
  -->
  <div
  in:fly={{ x: 200, duration: 500 }}
  out:fly={{ x: 200, duration: 500 }}
  class="notificator"
>
 {notification.message}
</div>
  {/each}
  </div>
{/if}

{#await promise then res}
  <Router>
    <div class="flex">
      <Header bind:open />
      <div class="bg-[#222736] w-full">
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
        </div>
      </div>
    </div>
  </Router>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
<style>
  .notificator-wrapper {
        @apply absolute top-0 right-0 mt-10 mr-10 p-5;
        width: 300px;
        z-index: 3000;
    }
    .notificator {
        @apply bg-gray-500 border-4 rounded-md border-solid  text-white p-5 font-bold;
        width: 300px;
        z-index: 3000;
    }
</style>