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
</script>

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
        class="!bg-[#2a3042] text-[#a6b0cf] hover:text-white"
        label="Catalogue"
        icon={{ name: ViewGrid }}
      >
        <SidebarDropdownItem
          class="!bg-[#2a3042] text-[#a6b0cf] hover:text-white"
          label="Products"
          href="/catalogue/products"
          on:click={(e) => {
            e.preventDefault();
            navigate("/catalogue/products");
          }}
        />
        <SidebarDropdownItem
          class="!bg-[#2a3042] text-[#a6b0cf] hover:text-white"
          label="Categories"
          href="/catalogue/categories"
          on:click={(e) => {
            e.preventDefault();
            navigate("/catalogue/categories");
          }}
        />
        <SidebarDropdownItem
          class="!bg-[#2a3042] text-[#a6b0cf] hover:text-white"
          label="Properties"
          href="/catalogue/properties"
          on:click={(e) => {
            e.preventDefault();
            navigate("/catalogue/properties");
          }}
        />
        <SidebarDropdownItem
          class="!bg-[#2a3042] text-[#a6b0cf] hover:text-white"
          label="Manufacturers"
          href="/catalogue/manufacturers"
          on:click={(e) => {
            e.preventDefault();
            navigate("/catalogue/manufacturers");
          }}
        />
      </SidebarDropdownWrapper>

      <SidebarItem
        class="!bg-[#2a3042] text-[#a6b0cf] hover:text-white"
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
        class="!bg-[#2a3042] text-[#a6b0cf] hover:text-white"
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
        class="!bg-[#2a3042] text-[#a6b0cf] hover:text-white"
        label="CMS"
        icon={{ name: ShoppingCart }}
      >
        <SidebarDropdownItem
          class="!bg-[#2a3042] text-[#a6b0cf] hover:text-white"
          label="Pages"
          href="/cms/pages"
          on:click={(e) => {
            e.preventDefault();
            navigate("/cms/pages");
          }}
        />
        <SidebarDropdownItem
          class="!bg-[#2a3042] text-[#a6b0cf] hover:text-white"
          label="Categories"
          href="/cms/categories"
          on:click={(e) => {
            e.preventDefault();
            navigate("/cms/categories");
          }}
        />
        <SidebarDropdownItem
          class="!bg-[#2a3042] text-[#a6b0cf] hover:text-white"
          label="Settings"
          href="/cms/settings"
          on:click={(e) => {
            e.preventDefault();
            navigate("/cms/settings");
          }}
        />
      </SidebarDropdownWrapper>
      <SidebarItem
        class="!bg-[#2a3042] text-[#a6b0cf] hover:text-white"
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
        class="!bg-[#2a3042] text-[#a6b0cf] hover:text-white"
        label="Logout"
        icon={{ name: Logout }}
        href="/logout"
        on:click={handleLogout}
      />
    </SidebarGroup>
  </SidebarWrapper>
</Sidebar>
