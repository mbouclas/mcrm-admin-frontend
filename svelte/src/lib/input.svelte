<script>
  export let model;
  export let placeholder;

</script>

<input type="text" placeholder={placeholder}
bind:value={model} />

{model}