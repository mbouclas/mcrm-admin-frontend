<script lang="ts">
  import { Router, Route, Link, useLocation } from 'mcrm-svelte-navigator';
  import PrivateRoute from '../Auth/PrivateRoute.svelte';
  import Header from '../Shared/Header.svelte';
  import Topbar from '../Shared/Topbar.svelte';
  import About from '../Dashboard/About.svelte';
  import Profile from '../User/Profile.svelte';
  import CatalogueRoutes from '../Catalogue/routes.svelte';
  import CmsRoutes from '../Cms/routes.svelte';
  import OrderRoutes from '../Order/routes.svelte';
  import CustomerRoutes from '../Customer/routes.svelte';
  import UserRoutes from '../User/routes.svelte';
  import RoleRoutes from '../Role/routes.svelte';
  import GateRoutes from '../Gate/routes.svelte';
  import SettingRoutes from '../Setting/routes.svelte';
  import EditableRegions from '../EditableRegions/routes.svelte';
  import Menu from '../Menu/routes.svelte';
  import Area51 from '../area51/routes.svelte';
  import Analytics from '../Analytics/routes.svelte';
  import { BootService } from '../Shared/boot.service';
  import { onMount } from 'svelte';
  import { notificationsStore } from '../stores';
  import type { INotification } from '../stores';
  import { fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import QuickNavigation from '../Shared/quick-jump-to.svelte';
  import { v4 } from 'uuid';
  import Toast from '../Shared/Toast.svelte';
  import Dashboard from "../Dashboard/index.svelte";

  interface ExtendedINotification extends INotification {
    id: string;
  }

  let url,
    showNotifications: ExtendedINotification[] = [];
  const promise = new BootService().boot();

  let addAndRemove = () => {
    const newNotification = {
      id: v4(),
      ...$notificationsStore[0],
    };
    showNotifications = [newNotification, ...showNotifications];

    const removeNotificationById = (id) => {
      showNotifications = showNotifications.filter((notification) => notification.id !== id);
    };

    // Set a timeout for the new notification based on its expiration time
    setTimeout(() => {
      removeNotificationById(newNotification.id);
    }, newNotification.expiration); // Assuming expiration is in seconds
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
<QuickNavigation />
{#if showNotifications && showNotifications.length !== 0}
  <div class="notificator-wrapper">
    {#each showNotifications as notification, index (notification.id)}
      <div in:fly={{ x: 500, duration: 500 }} out:fly={{ x: 500, duration: 500 }} animate:flip class="notificator">
        <Toast message={notification.message} type={notification.type} position="tr" show />
      </div>
    {/each}
  </div>
{/if}

{#await promise then res}
  <Router>
    <div class="flex h-full min-h-full">
      <Header bind:open />
      <div class="bg-[#222736] w-full">
        <Topbar bind:open />
        <!-- {url} -->
        <div class="p-4 body">
          <Route path="/">
            <Dashboard />
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

          <PrivateRoute path="cms/*" let:location>
            <CmsRoutes />
          </PrivateRoute>

          <PrivateRoute path="orders/*" let:location>
            <OrderRoutes />
          </PrivateRoute>

          <PrivateRoute path="customers/*" let:location>
            <CustomerRoutes />
          </PrivateRoute>

          <PrivateRoute path="users/*" let:location>
            <UserRoutes />
          </PrivateRoute>

          <PrivateRoute path="roles/*" let:location>
            <RoleRoutes />
          </PrivateRoute>

          <PrivateRoute path="settings/*" let:location>
            <SettingRoutes />
          </PrivateRoute>

          <PrivateRoute path="gates/*" let:location>
            <GateRoutes />
          </PrivateRoute>

          <PrivateRoute path="editable-regions/*" let:location>
            <EditableRegions />
          </PrivateRoute>

          <PrivateRoute path="area51/*" let:location>
            <Area51 />
          </PrivateRoute>

          <PrivateRoute path="analytics/*" let:location>
            <Analytics />
          </PrivateRoute>

          <PrivateRoute path="menus/*" let:location>
            <Menu />
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
    @apply absolute right-5 p-5;
    width: 300px;
    z-index: 3000;
  }
  .notificator {
    @apply rounded-md mt-4 text-white p-5 font-bold;
    width: 300px;
    z-index: 3000;
  }
</style>
