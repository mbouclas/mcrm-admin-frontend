<script>
  import { useNavigate, useLocation } from "mcrm-svelte-navigator";
  import { user } from "../stores";
  import { AuthService } from "./auth.service";
  import { BootService } from "../Shared/boot.service";
  import logo from '../../assets/logo-2.svg';

  const navigate = useNavigate();
  const location = useLocation();

  let username;
  let password;
  $: errors = {
    password: null,
    username: null,
    general: null,
  };

  async function handleSubmit() {
    $user = { username, password };
    if (!username || username === "") {
      errors["username"] = "Please enter username";
    }
    if (!password || password === "") {
      errors["password"] = "Please enter password";
    }
    if (errors["username"] || errors["password"]) {
      return;
    }
    const res = await new AuthService().login(username, password);
    if (!res.accessToken) {
      errors["general"] = res.reason.message ?? res.reason;
      return;
    }

    localStorage.setItem("user", JSON.stringify(res));
    user.update(() => res);
    // Go get the app state from the server
    await new BootService().boot();
    const from = ($location.state && $location.state.from) || "/";
    navigate(from, { replace: true });
  }
</script>

<div class="absolute  hidden  py-3 px-3 lg:flex  top-0 right-1">
  <a href="/" class="h-8 w-8 text-white">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="stroke-current"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000000"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9" />
      <path d="M9 22V12h6v10M2 10.6L12 2l10 8.6" />
    </svg>
  </a>
</div>
<form
  class="w-full mt-16 lg:w-[28%] mx-auto  min-h-screen relative flex flex-col items-center justify-center"
>
  <div
    class=" min-h-64 min-h-[80vh] flex flex-col w-full rounded bg-gray-secondary"
  >
    <div class="h-28 rounded-t w-full bg-dark-blue">
      <div class="flex items-center justify-between  p-2 text-sm text-blue-500">
        <div class="flex flex-col  px-2 text-sm text-primary">
          <h4 class="font-bold mb-2 text-sm">Welcome Back!</h4>
          <p class="text-xs">Sign in to Continue!</p>
        </div>

        <img
          class="h-20 w-32 object-fit"
          src={logo}
          alt=""
        />
      </div>
    </div>

    <div
      class="absolute h-16 w-16 top-[15%] rounded-full bg-gray-secondary left-4 flex items-center justify-center"
    >
      <img
        src={logo}
        class="w-12 h-12 object-fit rounded-full"
        alt=""
      />
    </div>
    <div
      class="flex-grow pt-12 flex flex-col  justify-between w-full px-6 lg:px-8 "
    >
      {#if errors.general}
        <p
          class="text-red-500 text-[13px] py-2 rounded w-full bg-red-200  px-3 font-light"
        >
          {errors.general}
        </p>
      {/if}
      <div class="group flex flex-col text-gray-500  w-full">
        <label class="text-sm text-left font-semibold" for="email">Email</label>
        <input
          type="text"
          bind:value={username}
          id={username}
          placeholder="email"
          class="w-full mt-1 w-full px-3 py-2 text-sm bg-gray-secondary border border-gray-700 rounded"
          required
        />
        {#if errors.username}
          <p class="text-red-500 text-sm font-light">{errors.username}</p>
        {/if}
      </div>

      <div class="group flex flex-col text-gray-500  w-full">
        <label
          class="text-sm text-left  w-full  font-semibold"
          for="passoword"
          required>Password</label
        >
        <input
          type="password"
          bind:value={password}
          id={password}
          placeholder="Password"
          class="w-full mt-2 w-full px-3 py-2 text-sm bg-gray-secondary border border-gray-700 rounded"
        />
        {#if errors.password}
          <p class="text-red-500 text-sm font-light">{errors.password}</p>
        {/if}
      </div>
      <div
        class="group flex items-center text-gray-500 mb-2 w-full gap-2 relative"
      >
        <input type="checkbox" name="" class="h-4 w-4" id="remember" />
        <label class="text-sm  " for="remember">Remember me!</label>
      </div>

      <div class="w-full py-2">
        <button
          class="bg-primary w-full px-3 py-2 rounded hover:bg-opacity-80 text-white"
          on:click|preventDefault={handleSubmit}
          >Login
        </button>
      </div>

      <div class="flex w-full flex-col items-center justify-center">


        <div class="flex gap-2 items-center text-gray-300 mb-3">
          <svg
            class="stroke-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span class="text-sm">Forgot password!</span>
        </div>
      </div>
    </div>
  </div>
  <!-- END USER CARD -->

  <div class="footer flex items-center flex-col gap-4 my-4 jusfify-center">

    <span class="font-light  text-gray-200 text-xs"
      >© 2022 Businesslink HQ</span
    >
  </div>
</form>
