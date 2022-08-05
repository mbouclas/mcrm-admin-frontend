<script>
  import { useNavigate, useLocation } from "svelte-navigator";
  import { user } from "../stores";
  import {AuthService} from "./auth.service.ts";

  const navigate = useNavigate();
  const location = useLocation();
  const storedUser = AuthService.currentUser();


  if (storedUser) {
    user.update(() => storedUser);
  }


  $: if (!$user) {
    navigate("/login", {
      state: { from: $location.pathname },
      replace: true,
    });
  }
</script>

{#if $user}
  <slot />
{/if}
