<script lang="ts">

  import type { IDynamicFieldConfigBlueprint } from "../types";
  import { Label, Textarea, Helper } from "flowbite-svelte";
  import { onMount } from "svelte";
  import {v4} from "uuid";
  export let id = v4();
  export let useDarkMode = true;
  export let field: IDynamicFieldConfigBlueprint;
  export let onChange;
  export let model;
  export let placeholder;
  export let label;
  export let helperText;
  export let inputId: string;
  export let classes: string[] = [];
  export let plugins = 'autoresize preview importcss searchreplace autolink save directionality code visualblocks visualchars fullscreen image link media  codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount charmap quickbars emoticons';
  export let toolbar =  'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media  link anchor codesample';
  let pristine = true;

  let hasError = false;

  function init() {

    tinymce.init({
      selector: `#${id}`,
      inline: false,
      setup: (editor) => {
        editor.on('init', (e) => {
          console.log('The Editor has initialized.', `#${id}`);
        });
        editor.on('Change', (e) => {
          model = editor.getContent();
        });

        editor.on('keyup', (e) => {
          model = editor.getContent();
        });
      },
      toolbar_sticky: false,
      image_advtab: true,
      image_caption: true,
      plugins,
      toolbar,
      autosave_ask_before_unload: true,
      autosave_interval: '30s',
      autosave_prefix: '{path}{query}-{id}-',
      autosave_restore_when_empty: false,
      autosave_retention: '2m',
      quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
      toolbar_mode: 'sliding',
      contextmenu: 'link image table',
      skin: useDarkMode ? 'oxide-dark' : 'oxide',
      content_css: useDarkMode ? 'dark' : 'default',
    });
  }



  onMount(() => {
    let timer;
    if (typeof tinymce === 'undefined') {
        setInterval(() => {
          if (typeof tinymce !== 'undefined') {
            init();
            clearInterval(timer);
          }
        }, 1000);


      return;
    }

    init();

  })

</script>

<div class="my-4">
  {#if field.label}
    <Label class={`block mb-2 !text-gray-400 ${hasError ? "has-error" : ""}`}>
      {field.label}
    </Label>
  {/if}

  <div class={`${hasError ? "has-error" : ""}`}>
    <textarea {id}>{model}</textarea>
  </div>
  {#if helperText}
    <Helper class={hasError ? "helper-text has-error" : "helper-text"}>
      {helperText}
    </Helper>
  {/if}
</div>



<style global>
  .tox-promotion {display: none !important;}
  .tox-statusbar__branding {display: none !important}


</style>
