<script>
  import { Link } from "svelte-navigator";
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

<Sidebar class="h-screen sidebar bg-[#2a3042]">
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
  <SidebarWrapper
    class="rounded-none bg-[#2a3042] text-[#a6b0cf]  hover:bg-[#2a3042] hover:text-white"
  >
    <SidebarGroup>
      <SidebarDropdownWrapper
        class="text-[#a6b0cf] hover:bg-[#2a3042] hover:text-white"
        label="Catalogue"
        icon={{ name: ShoppingCart }}
      >
        <SidebarDropdownItem
          class="text-[#a6b0cf]  hover:bg-[#2a3042] hover:text-white"
          label="Products"
        />
        <SidebarDropdownItem
          class="text-[#a6b0cf]  hover:bg-[#2a3042] hover:text-white"
          label="Categories"
        />
        <SidebarDropdownItem
          class="text-[#a6b0cf]  hover:bg-[#2a3042] hover:text-white"
          label="Properties"
        />
        <SidebarDropdownItem
          class="text-[#a6b0cf]  hover:bg-[#2a3042] hover:text-white"
          label="Manufacturers"
        />
      </SidebarDropdownWrapper>

      <SidebarItem
        class="text-[#a6b0cf]  hover:bg-[#2a3042] hover:text-white"
        label="Orders"
        {spanClass}
        icon={{ name: ViewGrid }}
      />
      <SidebarItem
        class="text-[#a6b0cf]  hover:bg-[#2a3042] hover:text-white"
        label="Customers"
        {spanClass}
        icon={{ name: InboxIn }}
      />

      <SidebarDropdownWrapper
        class="text-[#a6b0cf]  hover:bg-[#2a3042] hover:text-white"
        label="CMS"
        icon={{ name: ShoppingCart }}
      >
        <SidebarDropdownItem
          class="text-[#a6b0cf]  hover:bg-[#2a3042] hover:text-white"
          label="Pages"
        />
        <SidebarDropdownItem
          class="text-[#a6b0cf]  hover:bg-[#2a3042] hover:text-white"
          label="Categories"
        />
        <SidebarDropdownItem
          class="text-[#a6b0cf]  hover:bg-[#2a3042] hover:text-white"
          label="Settings"
        />
      </SidebarDropdownWrapper>
      <SidebarItem
        class="text-[#a6b0cf]  hover:bg-[#2a3042] hover:text-white"
        label="Settings"
        icon={{ name: Cog }}
      />
      <SidebarItem
        class="text-[#a6b0cf]  hover:bg-[#2a3042] hover:text-white"
        label="Logout"
        icon={{ name: Logout }}
        on:click={handleLogout}
      />
    </SidebarGroup>
  </SidebarWrapper>
</Sidebar>
