<script>
import {UserService} from '../user.service.ts';
import Loading from '../../Shared/Loading.svelte'
const s = new UserService();
let promise;

async function handleLogin() {
  promise = s.login('as', '32e')
}



</script>

<h1>User Settings</h1>
<button on:click={handleLogin}>Click to trigger login</button>

{#if promise}

  {#await promise}
    <Loading />
  {:then result}
  <h3>Total Results: {result.total}</h3>
  <ul>
  {#each result.data as item}
  <li>{item.id}: {item.email}</li>
  {/each}
  </ul>
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}

{/if}