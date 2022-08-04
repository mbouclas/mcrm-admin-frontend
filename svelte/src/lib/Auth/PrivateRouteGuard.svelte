<script>
  import { useNavigate, useLocation } from "svelte-navigator";
  import { user } from "../stores";

  const navigate = useNavigate();
  const location = useLocation();
  let storedUser;
  const storedUserString = localStorage.getItem('user');

  if (storedUserString) {
    storedUser = JSON.parse(storedUserString);
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
