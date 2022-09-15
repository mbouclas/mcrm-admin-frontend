<script>
  import Richtext from "../../../DynamicFields/fields/richtext.svelte";
  import TextInput from "../../../DynamicFields/fields/text-input.svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  export let hideModal;
  export let showModal;
  export let fields;
  export let model;
</script>

<div class="modal">
  <div class="backdrop" on:click={hideModal} />
  <div class="content">
    <h1 class="title">Image Reference</h1>
    {#each fields as field}
      {#if field.type === "text"}
        <TextInput {field} />
      {/if}

      {#if field.type === "richText"}
        <Richtext {field} />
      {/if}
    {/each}
    <button class="save-btn"> S A V E</button>
  </div>
</div>

<style scoped>
  .modal {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .backdrop {
    z-index: 100;
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.829);
  }
  .content {
    padding: 30px;
    position: relative;
    z-index: 101;
    width: 80%;
    /* height: 80%; */
    background-color: #222736;
  }
  .title {
    color: #9ca3af;
    margin-bottom: 20px;
    text-align: center;
  }
  .save-btn {
    display: block;
    width: 100%;
    color: white;
    background: #556ee6;
    padding: 10px;
    border-radius: 3px;
  }
  .save-btn:hover {
    opacity: 0.8;
  }
</style>
