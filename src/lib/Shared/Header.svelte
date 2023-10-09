<script>
  import { Link, useNavigate } from 'mcrm-svelte-navigator';
  import {
    SidebarGroup,
    Sidebar,
    SidebarWrapper,
    SidebarDropdownItem,
    SidebarDropdownWrapper,
    SidebarItem,
  } from 'flowbite-svelte';

  import { ChartPie, ShoppingCart, Squares2x2, InboxArrowDown, Cog, ArrowRightOnRectangle } from 'svelte-heros-v2';
  import Drawer from 'svelte-drawer-component';

  import { user } from '../stores';
  import { AuthService } from '../Auth/auth.service';

  let hasRoleGate = AuthService.hasGate('menu.roles.show');
  let hasUsersGate = AuthService.hasGate('menu.users.show');
  let hasGatesGate = AuthService.hasGate('menu.gates.show');
  let hasCMSGate = AuthService.hasGate('menu.cms.show');
  let hasCustomersGate = AuthService.hasGate('menu.customers.show');
  let hasOrdersGate = AuthService.hasGate('menu.orders.show');
  let hasCatalogueGate = AuthService.hasGate('menu.catalogue.show');
  let hasEditableRegionsGate = AuthService.hasGate('menu.editableRegions.show');
  let hasSettingsGate = AuthService.hasGate('menu.settings.show');

  const navigate = useNavigate();
  function handleLogout(e) {
    e.preventDefault();
    $user = null;
    localStorage.clear();
  }

  let site = {
    name: 'Flowbite-Svelte',
    href: '/',
    img: '/images/flowbite-svelte-icon-logo.svg',
  };

  let spanClass = 'flex-1 ml-3 whitespace-nowrap';
  const aClass =
    'flex items-center p-2 text-base font-normal text-[#a6b0cf] hover:text-white rounded-lg dark:text-white bg-[#2a3042] dark:hover:bg-gray-700';
  const btnClass =
    'flex items-center p-2 w-full text-base font-normal hover:text-white text-[#a6b0cf] rounded-lg transition duration-75 group dark:text-white dark:hover:bg-gray-700';

  export let open = false;
</script>

<Drawer {open} size="256px" on:clickAway={() => (open = false)}>
  <Sidebar class="h-screen sidebar !bg-[#2a3042]">
    <div class="flex justify-center">
      <Link to="/" class="nav-brand  py-5 px-10">
        <img
          class="w-24 object-fit"
          src="http://skote-v-dark.svelte.themesbrand.com/assets/images/logo-light.png"
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
        class="w-24 object-fit"
        src="http://skote-v-dark.svelte.themesbrand.com/assets/images/logo-light.png"
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
                  label="Shipping"
                  icon={{ name: Cog }}
                  href="/settings/shipping"
                  on:click={(e) => {
              e.preventDefault();
              navigate('/settings/shipping');
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
