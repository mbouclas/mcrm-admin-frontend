<script>
    import {user} from "../stores";
    import {Link} from "svelte-navigator";

    function handleLogout() {
        $user = null;
        localStorage.clear();
    }

</script>

<header>
    <nav>
        <Link to="/">Home</Link>
        <Link to="about">About</Link>
        <Link to="profile">Profile</Link>


        <button on:click={handleLogout}>Logout</button>
    </nav>
</header>

<h3>Welcome {$user.user.firstName}</h3>
