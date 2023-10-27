<script lang="ts">
    import {onMount} from "svelte";
    import {AuthService} from "./auth.service";

    onMount(async () => {
       await new AuthService().logout();
        window.location.href = '/';
    });
</script>
