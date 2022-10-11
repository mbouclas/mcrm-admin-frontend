<script>
  import { Link, useNavigate } from "svelte-navigator";
  import {
    SidebarGroup,
    Sidebar,
    SidebarWrapper,
    SidebarDropdownItem,
    SidebarDropdownWrapper,
    SidebarItem,
  } from "flowbite-svelte";

  import {
    ChartPie,
    ShoppingCart,
    ViewGrid,
    InboxIn,
    User,
    Login,
    Cog,
    Logout,
  } from "svelte-heros";
  import Drawer from "svelte-drawer-component";

  import { user } from "../stores";

  const navigate = useNavigate();
  function handleLogout(e) {
    e.preventDefault();
    $user = null;
    localStorage.clear();
  }

  let site = {
    name: "Flowbite-Svelte",
    href: "/",
    img: "/images/flowbite-svelte-icon-logo.svg",
  };

  let spanClass = "flex-1 ml-3 whitespace-nowrap";
  const aClass =
    "flex items-center p-2 text-base font-normal text-[#a6b0cf] hover:text-white rounded-lg dark:text-white bg-[#2a3042] dark:hover:bg-gray-700";
  const btnClass =
    "flex items-center p-2 w-full text-base font-normal hover:text-white text-[#a6b0cf] rounded-lg transition duration-75 group dark:text-white dark:hover:bg-gray-700";

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
        <SidebarDropdownWrapper
          {btnClass}
          label="Catalogue"
          icon={{ name: ViewGrid }}
        >
          <SidebarDropdownItem
            aClass={btnClass + " pl-11"}
            label="Products"
            href="/catalogue/products/list"
            on:click={(e) => {
              e.preventDefault();
              navigate("/catalogue/products/list");
            }}
          />
          <SidebarDropdownItem
            aClass={btnClass + " pl-11"}
            label="Categories"
            href="/catalogue/products/categories"
            on:click={(e) => {
              e.preventDefault();
              navigate("/catalogue/products/categories");
            }}
          />
          <SidebarDropdownItem
            aClass={btnClass + " pl-11"}
            label="Properties"
            href="/catalogue/properties"
            on:click={(e) => {
              e.preventDefault();
              navigate("/catalogue/properties");
            }}
          />
          <SidebarDropdownItem
            aClass={btnClass + " pl-11"}
            label="Manufacturers"
            href="/catalogue/manufacturers"
            on:click={(e) => {
              e.preventDefault();
              navigate("/catalogue/manufacturers");
            }}
          />

          <SidebarDropdownItem
                  aClass={btnClass + " pl-11"}
                  label="Import"
                  href="/catalogue/products/import"
                  on:click={(e) => {
              e.preventDefault();
              navigate("/catalogue/products/import");
            }}
          />
        </SidebarDropdownWrapper>

        <SidebarItem
          {aClass}
          label="Orders"
          {spanClass}
          icon={{ name: ShoppingCart }}
          href="/orders"
          on:click={(e) => {
            e.preventDefault();
            navigate("/orders");
          }}
        />
        <SidebarItem
          {aClass}
          label="Customers"
          {spanClass}
          icon={{ name: InboxIn }}
          href="/customers"
          on:click={(e) => {
            e.preventDefault();
            navigate("/customers");
          }}
        />

        <SidebarDropdownWrapper
          {btnClass}
          label="CMS"
          icon={{ name: ShoppingCart }}
        >
          <SidebarDropdownItem
            aClass={btnClass + " pl-11"}
            label="Pages"
            href="/cms/pages"
            on:click={(e) => {
              e.preventDefault();
              navigate("/cms/pages");
            }}
          />
          <SidebarDropdownItem
            aClass={btnClass + " pl-11"}
            label="Categories"
            href="/cms/categories"
            on:click={(e) => {
              e.preventDefault();
              navigate("/cms/categories");
            }}
          />
          <SidebarDropdownItem
            aClass={btnClass + " pl-11"}
            label="Settings"
            href="/cms/settings"
            on:click={(e) => {
              e.preventDefault();
              navigate("/cms/settings");
            }}
          />
        </SidebarDropdownWrapper>
        <SidebarItem
          {aClass}
          label="Settings"
          icon={{ name: Cog }}
          href="/settings"
          on:click={(e) => {
            e.preventDefault();
            navigate("/settings");
          }}
        />
      </SidebarGroup>
      <SidebarGroup border class="border-gray-500">
        <SidebarItem
          {aClass}
          label="Logout"
          icon={{ name: Logout }}
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
      <SidebarDropdownWrapper
        {btnClass}
        label="Catalogue"
        icon={{ name: ViewGrid }}
      >
        <SidebarDropdownItem
          aClass={btnClass + " pl-11"}
          label="Products"
          href="/catalogue/products/list"
          on:click={(e) => {
            e.preventDefault();
            navigate("/catalogue/products/list");
          }}
        />
        <SidebarDropdownItem
          aClass={btnClass + " pl-11"}
          label="Categories"
          href="/catalogue/products/categories"
          on:click={(e) => {
            e.preventDefault();
            navigate("/catalogue/products/categories");
          }}
        />
        <SidebarDropdownItem
          aClass={btnClass + " pl-11"}
          label="Properties"
          href="/catalogue/properties"
          on:click={(e) => {
            e.preventDefault();
            navigate("/catalogue/properties");
          }}
        />
        <SidebarDropdownItem
          aClass={btnClass + " pl-11"}
          label="Manufacturers"
          href="/catalogue/manufacturers"
          on:click={(e) => {
            e.preventDefault();
            navigate("/catalogue/manufacturers");
          }}
        />

        <SidebarDropdownItem
                aClass={btnClass + " pl-11"}
                label="Import"
                href="/catalogue/products/import"
                on:click={(e) => {
            e.preventDefault();
            navigate("/catalogue/products/import");
          }}
        />
      </SidebarDropdownWrapper>

      <SidebarItem
        {aClass}
        label="Orders"
        {spanClass}
        icon={{ name: ShoppingCart }}
        href="/orders"
        on:click={(e) => {
          e.preventDefault();
          navigate("/orders");
        }}
      />
      <SidebarItem
        {aClass}
        label="Customers"
        {spanClass}
        icon={{ name: InboxIn }}
        href="/customers"
        on:click={(e) => {
          e.preventDefault();
          navigate("/customers");
        }}
      />

      <SidebarDropdownWrapper
        {btnClass}
        label="CMS"
        icon={{ name: ShoppingCart }}
      >
        <SidebarDropdownItem
          aClass={btnClass + " pl-11"}
          label="Pages"
          href="/cms/pages"
          on:click={(e) => {
            e.preventDefault();
            navigate("/cms/pages");
          }}
        />
        <SidebarDropdownItem
          aClass={btnClass + " pl-11"}
          label="Categories"
          href="/cms/categories"
          on:click={(e) => {
            e.preventDefault();
            navigate("/cms/categories");
          }}
        />
        <SidebarDropdownItem
          aClass={btnClass + " pl-11"}
          label="Settings"
          href="/cms/settings"
          on:click={(e) => {
            e.preventDefault();
            navigate("/cms/settings");
          }}
        />
      </SidebarDropdownWrapper>
      <SidebarItem
        {aClass}
        label="Settings"
        icon={{ name: Cog }}
        href="/settings"
        on:click={(e) => {
          e.preventDefault();
          navigate("/settings");
        }}
      />
    </SidebarGroup>
    <SidebarGroup border class="border-gray-500">
      <SidebarItem
        {aClass}
        label="Logout"
        icon={{ name: Logout }}
        href="/logout"
        on:click={handleLogout}
      />
    </SidebarGroup>
  </SidebarWrapper>
</Sidebar>
