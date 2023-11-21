<script lang="ts">
  import {
    SidebarGroup,
    Sidebar,
    SidebarWrapper,
    SidebarItem, SidebarBrand, Button
  } from 'flowbite-svelte';

  import { user } from '../stores';
  import { AuthService } from '../Auth/auth.service';
  import logo from '../../assets/logo-2.svg';

  import { sideBarMenuItems} from "../../data/menu";
  import type { SideBarMenuItem} from "../../data/menu";
  import { ChevronLeft, ChevronRight} from "svelte-heros-v2";
  import {navigate, useLocation} from "mcrm-svelte-navigator";


  let hasRoleGate = AuthService.hasGate('menu.roles.show');
  let hasUsersGate = AuthService.hasGate('menu.users.show');
  let hasGatesGate = AuthService.hasGate('menu.gates.show');
  let hasCMSGate = AuthService.hasGate('menu.cms.show');
  let hasCustomersGate = AuthService.hasGate('menu.customers.show');
  let hasOrdersGate = AuthService.hasGate('menu.orders.show');
  let hasCatalogueGate = AuthService.hasGate('menu.catalogue.show');
  let hasEditableRegionsGate = AuthService.hasGate('menu.editableRegions.show');
  let hasSettingsGate = AuthService.hasGate('menu.settings.show');


  function handleLogout(e) {
    e.preventDefault();
    $user = null;
    localStorage.clear();
  }

  let site = {
    name: '',
    href: '/',
    img: logo,
  };

  export let open = false;
  let activeLevel = 0;
  let breadcrumbs = [],
          currentLevelSideBarMenuItems = sideBarMenuItems,
          currentItem: SideBarMenuItem = sideBarMenuItems[0],
  activeUrl = '/',
  isActive = '';

  useLocation().subscribe(data => {
    activeUrl = data.pathname;
    currentItem = findWhereTheHeckAmI(sideBarMenuItems, activeUrl);
    if (!currentItem) {return}
    if (currentItem.parent) {
        currentLevelSideBarMenuItems = currentItem.parent.children;
    }
    breadcrumbs = getBreadcrumbs(currentItem);
  });

  function findWhereTheHeckAmI(items: SideBarMenuItem[], activeUrl = '/'): SideBarMenuItem | null {
    for (let item of items) {
      let isMatch: boolean;

      // If regexMatch string is provided, use it for matching
      if (item.regexMatch) {
        const routeRegex = new RegExp(item.regexMatch);
        isMatch = routeRegex.test(activeUrl);

      } else {
        // Otherwise, do a direct route comparison
        isMatch = item.route === activeUrl;
      }

      if (isMatch) {
        return item;
      }

      // Recursively check children
      if (item.children && item.children.length > 0) {
        const foundChild = findWhereTheHeckAmI(item.children, activeUrl);
        if (foundChild) {
          return foundChild;
        }
      }
    }
    return null;
  }

  function getBreadcrumbs(item: SideBarMenuItem) {
    const breadcrumbs = [];
    let currentItem = item.parent; // Start from the parent of the current item

    while (currentItem) {
      breadcrumbs.unshift(currentItem);  // Add to the start of the array
      currentItem = currentItem.parent;
    }

    return breadcrumbs;
  }

  function changeLevel(item: SideBarMenuItem) {
    currentItem = item;
    if (!Array.isArray(item.children) || item.children.length === 0) {
      if (item.route) {
        navigate(item.route);
      }
      return;
    }


    currentLevelSideBarMenuItems = item.children;
    breadcrumbs = [...breadcrumbs, item];
  }

  function goBackALevel() {
    if (breadcrumbs.length === 1) {
        currentLevelSideBarMenuItems = sideBarMenuItems;
        breadcrumbs = [];
        currentItem = sideBarMenuItems[0];
        return;
    }

    breadcrumbs = breadcrumbs.slice(0, breadcrumbs.length - 1);
    currentLevelSideBarMenuItems = breadcrumbs[breadcrumbs.length - 1].children;
    currentItem = breadcrumbs[breadcrumbs.length - 1];
  }

  function amIActive(item: SideBarMenuItem) {
    if (!item.regexMatch && item.route === activeUrl) {
      return 'bg-[#2a3042] text-white';
    }

    if (item.regexMatch) {
      const routeRegex = new RegExp(item.regexMatch);
      if (routeRegex.test(activeUrl)) {
        return 'bg-[#2a3042] text-white';
      }
    }

    return '';
  }

  $: {
    if (currentItem) {
      currentLevelSideBarMenuItems = currentLevelSideBarMenuItems.map(item => {
        item.isActive = currentItem.route === item.route;
        return item;
      });
    }
  }

</script>

<Sidebar {activeUrl} class="bg-gray-800 h-screen">
  <SidebarWrapper>

    <SidebarGroup>
      <SidebarBrand {site} />
      {#if breadcrumbs.length > 0}
      <div class="h-12 flex space-x-1.5">
        <Button on:click={goBackALevel}>
          <ChevronLeft /> <span class="text-white">{breadcrumbs[breadcrumbs.length - 1].label}</span>
        </Button>

      </div>
        {/if}
      {#each currentLevelSideBarMenuItems as item}
      <SidebarItem class={`${amIActive(item)}`} label={item.label} href={item.href || 'javascript:void(0)'} on:click={changeLevel.bind(this, item)}>

        <svelte:fragment slot="icon">
          {#if item.icon}
            <svelte:component this={item.icon} />

          {/if}
        </svelte:fragment>
        <svelte:fragment slot="subtext">
          {#if Array.isArray(item.children) && item.children.length > 0}
            <span class="inline-flex justify-end w-full">
              <ChevronRight  />
            </span>

            {/if}
        </svelte:fragment>
      </SidebarItem>
        {/each}
    </SidebarGroup>



  </SidebarWrapper>
</Sidebar>

<!--
<Drawer {open} size="256px" on:clickAway={() => (open = false)}>
  <Sidebar class="h-screen sidebar !bg-[#2a3042]">
    <div class="flex justify-center">
      <Link to="/" class="nav-brand  py-5 px-10">
        <img
          class="w-24 object-fit"
          src={logo}
          alt=""
          srcset=""
        />
      </Link>
    </div>
    <SidebarWrapper class="rounded-none !bg-[#2a3042]">
      <SidebarGroup>

        {#if hasCatalogueGate}
          <SidebarDropdownWrapper {btnClass} label="Catalogue" icon={{ name: Squares2x2 }}>
            <SidebarDropdownItem
              aClass={btnClass + ' pl-11'}
              label="Products"
              href="/catalogue/products/list"
              on:click={(e) => {
                e.preventDefault();
                navigate('/catalogue/products/list');
              }}
            />
            <SidebarDropdownItem
              aClass={btnClass + ' pl-11'}
              label="Categories"
              href="/catalogue/products/categories"
              on:click={(e) => {
                e.preventDefault();
                navigate('/catalogue/products/categories');
              }}
            />
            <SidebarDropdownItem
              aClass={btnClass + ' pl-11'}
              label="Properties"
              href="/catalogue/properties/list"
              on:click={(e) => {
                e.preventDefault();
                navigate('/catalogue/properties/list');
              }}
            />
            <SidebarDropdownItem
              aClass={btnClass + ' pl-11'}
              label="Manufacturers"
              href="/catalogue/manufacturers/list"
              on:click={(e) => {
                e.preventDefault();
                navigate('/catalogue/manufacturers/list');
              }}
            />

            <SidebarDropdownItem
              aClass={btnClass + ' pl-11'}
              label="Import"
              href="/catalogue/products/import"
              on:click={(e) => {
                e.preventDefault();
                navigate('/catalogue/products/import');
              }}
            />
          </SidebarDropdownWrapper>
        {/if}
        {#if hasOrdersGate}
          <SidebarItem
            {aClass}
            label="Orders"
            {spanClass}
            icon={{ name: ShoppingCart }}
            href="/orders"
            on:click={(e) => {
              e.preventDefault();
              navigate('/orders');
            }}
          />
        {/if}
        {#if hasCustomersGate}
          <SidebarItem
            {aClass}
            label="Customers"
            {spanClass}
            icon={{ name: InboxArrowDown }}
            href="/customers"
            on:click={(e) => {
              e.preventDefault();
              navigate('/customers');
            }}
          />
        {/if}
        {#if hasCMSGate}
          <SidebarDropdownWrapper {btnClass} label="CMS" icon={{ name: ShoppingCart }}>
            <SidebarDropdownItem
              aClass={btnClass + ' pl-11'}
              label="Pages"
              href="/cms/pages/list"
              on:click={(e) => {
                e.preventDefault();
                navigate('/cms/pages/list');
              }}
            />
            <SidebarDropdownItem
              aClass={btnClass + ' pl-11'}
              label="Categories"
              href="/cms/categories"
              on:click={(e) => {
                e.preventDefault();
                navigate('/cms/categories');
              }}
            />
            {#if hasSettingsGate}
              <SidebarDropdownItem
                aClass={btnClass + ' pl-11'}
                label="Settings"
                href="/cms/settings"
                on:click={(e) => {
                  e.preventDefault();
                  navigate('/cms/settings');
                }}
              />
            {/if}
          </SidebarDropdownWrapper>
        {/if}
        {#if hasEditableRegionsGate}
          <SidebarItem
            {aClass}
            label="Editable Regions"
            icon={{ name: Cog }}
            href="/editable-regions"
            on:click={(e) => {
              e.preventDefault();
              navigate('/editable-regions');
            }}
          />
        {/if}
        {#if hasSettingsGate}
          <SidebarItem
            {aClass}
            label="Settings"
            icon={{ name: Cog }}
            href="/settings"
            on:click={(e) => {
              e.preventDefault();
              navigate('/settings');
            }}
          />
        {/if}
      </SidebarGroup>
      <SidebarGroup border class="border-gray-500">
        <SidebarItem
          {aClass}
          label="Logout"
          icon={{ name: ArrowRightOnRectangle }}
          href="/logout"
          on:click={handleLogout}
        />
      </SidebarGroup>
    </SidebarWrapper>
  </Sidebar>
</Drawer>
<Sidebar class="h-screen sidebar !bg-[#2a3042] hidden lg:block">
  <div class="flex justify-center">
    <Link to="/" class="nav-brand  py-5 px-10">
      <img
        class="w-36 object-fit"
        src={logo}
        alt=""
        srcset=""
      />
    </Link>
  </div>
  <SidebarWrapper class="rounded-none !bg-[#2a3042]">
    <SidebarGroup>
      {#if hasCatalogueGate}
        <SidebarDropdownWrapper {btnClass} label="Catalogue" icon={{ name: Squares2x2 }}>
          <SidebarDropdownItem
            aClass={btnClass + ' pl-11'}
            label="Products"
            href="/catalogue/products/list"
            on:click={(e) => {
              e.preventDefault();
              navigate('/catalogue/products/list');
            }}
          />
          <SidebarDropdownItem
            aClass={btnClass + ' pl-11'}
            label="Categories"
            href="/catalogue/products/categories"
            on:click={(e) => {
              e.preventDefault();
              navigate('/catalogue/products/categories');
            }}
          />
          <SidebarDropdownItem
            aClass={btnClass + ' pl-11'}
            label="Properties"
            href="/catalogue/properties/list"
            on:click={(e) => {
              e.preventDefault();
              navigate('/catalogue/properties/list');
            }}
          />
          <SidebarDropdownItem
            aClass={btnClass + ' pl-11'}
            label="Manufacturers"
            href="/catalogue/manufacturers/list"
            on:click={(e) => {
              e.preventDefault();
              navigate('/catalogue/manufacturers/list');
            }}
          />

          <SidebarDropdownItem
            aClass={btnClass + ' pl-11'}
            label="Import"
            href="/catalogue/products/import"
            on:click={(e) => {
              e.preventDefault();
              navigate('/catalogue/products/import');
            }}
          />
        </SidebarDropdownWrapper>
      {/if}
      {#if hasOrdersGate}
        <SidebarItem
          {aClass}
          label="Orders"
          {spanClass}
          icon={{ name: ShoppingCart }}
          href="/orders/list"
          on:click={(e) => {
            e.preventDefault();
            navigate('/orders/list');
          }}
        />
      {/if}
      {#if hasCustomersGate}
        <SidebarItem
          {aClass}
          label="Customers"
          {spanClass}
          icon={{ name: InboxArrowDown }}
          href="/customers/list"
          on:click={(e) => {
            e.preventDefault();
            navigate('/customers/list');
          }}
        />
      {/if}
      {#if hasUsersGate}
        <SidebarItem
          {aClass}
          label="Users"
          {spanClass}
          icon={{ name: InboxArrowDown }}
          href="/users/list"
          on:click={(e) => {
            e.preventDefault();
            navigate('/users/list');
          }}
        />
      {/if}
      {#if hasRoleGate}
        <SidebarItem
          {aClass}
          label="Roles"
          {spanClass}
          icon={{ name: InboxArrowDown }}
          href="/roles/list"
          on:click={(e) => {
            e.preventDefault();
            navigate('/roles/list');
          }}
        />
      {/if}
      {#if hasGatesGate}
        <SidebarItem
          {aClass}
          label="Gates"
          {spanClass}
          icon={{ name: InboxArrowDown }}
          href="/gates/list"
          on:click={(e) => {
            e.preventDefault();
            navigate('/gates/list');
          }}
        />
      {/if}

      {#if hasCMSGate}
        <SidebarDropdownWrapper {btnClass} label="CMS" icon={{ name: ShoppingCart }}>
          <SidebarDropdownItem
            aClass={btnClass + ' pl-11'}
            label="Pages"
            href="/cms/pages/list"
            on:click={(e) => {
              e.preventDefault();
              navigate('/cms/pages/list');
            }}
          />
          <SidebarDropdownItem
            aClass={btnClass + ' pl-11'}
            label="Categories"
            href="/cms/categories"
            on:click={(e) => {
              e.preventDefault();
              navigate('/cms/categories');
            }}
          />
          <SidebarDropdownItem
            aClass={btnClass + ' pl-11'}
            label="Settings"
            href="/cms/settings"
            on:click={(e) => {
              e.preventDefault();
              navigate('/cms/settings');
            }}
          />
        </SidebarDropdownWrapper>
      {/if}
      {#if hasEditableRegionsGate}
        <SidebarItem
          {aClass}
          label="Editable Regions"
          icon={{ name: Cog }}
          href="/editable-regions"
          on:click={(e) => {
            e.preventDefault();
            navigate('/editable-regions');
          }}
        />
      {/if}
      {#if hasSettingsGate}
        <SidebarDropdownWrapper {btnClass} label="Settings" icon={{ name: Squares2x2 }}>
          <SidebarItem
            {aClass}
            label="Conditions"
            icon={{ name: Cog }}
            href="/settings/conditions/list"
            on:click={(e) => {
              e.preventDefault();
              navigate('/settings/conditions/list');
            }}
          />
          <SidebarItem
                  {aClass}
                  label="Shipping Methods"
                  icon={{ name: Cog }}
                  href="/settings/shipping"
                  on:click={(e) => {
              e.preventDefault();
              navigate('/settings/shipping');
            }}
          />
          <SidebarItem
                  {aClass}
                  label="Payment Methods"
                  icon={{ name: Cog }}
                  href="/settings/payment-methods"
                  on:click={(e) => {
              e.preventDefault();
              navigate('/settings/payment-methods');
            }}
          />
          <SidebarItem
                  {aClass}
                  label="Custom Fields"
                  icon={{ name: Cog }}
                  href="/settings/cf"
                  on:click={(e) => {
              e.preventDefault();
              navigate('/settings/cf');
            }}
          />

          <SidebarItem
                  {aClass}
                  label="Sales Channels"
                  icon={{ name: Cog }}
                  href="/settings/sales-channels"
                  on:click={(e) => {
              e.preventDefault();
              navigate('/settings/sales-channels');
            }}
          />
        </SidebarDropdownWrapper>
      {/if}
    </SidebarGroup>
    <SidebarGroup border class="border-gray-500">
      <SidebarItem
        {aClass}
        label="Logout"
        icon={{ name: ArrowRightOnRectangle }}
        href="/logout"
        on:click={handleLogout}
      />
    </SidebarGroup>
  </SidebarWrapper>
</Sidebar>
-->
