<script>
  import Input from './lib/input.svelte'
  import Button from './lib/button.svelte'
  import Dashboard from './lib/dashboard.svelte'

  import PrivateRoute from "./lib/auth/private-route.svelte";
  import Login from "./lib/auth/login.svelte";
  import { Router, Route } from "svelte-navigator";
  import { user } from "./lib/store";

  function handleLogout() {
    $user = null;
  }

let model = {
  text: 'Text',
  place: 'place'
}

function handleButtonClick(event) {
  console.log(event.detail.text)
}

function handleSubmit(event) {
  console.log('In Submit', model)

}

</script>
<Router>
  <!-- <header>
    <h1>History</h1>
    <h1 class="text-3xl font-bold underline">
      Hello world!
    </h1>
    <nav>
      <Link to="/">Home</Link>
      <Link to="about">About</Link>
      <Link to="profile">Profile</Link>
    </nav>
  </header> -->



 <Route path="/"><Dashboard /></Route>
     <Route path="login">
      <Login />
    </Route>

<PrivateRoute path="profile" let:location>
  <h3>Welcome {$user.username}</h3>
  <button on:click={handleLogout}>Logout</button>
</PrivateRoute>

  </Router>


- {model.text} - {model.place}
<form on:submit|preventDefault={handleSubmit}>
<Input placeholder="This is the place" bind:model={model.text} />
<Input placeholder="This is the place" bind:model={model.place} />

<Button label="A Label" on:clicked={handleButtonClick} type="submit" />

</form>
