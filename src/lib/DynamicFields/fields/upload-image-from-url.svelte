<script lang="ts">

    import {Button, Input, Label, Radio} from "flowbite-svelte";


    export let onSave: (image: string) => void;
    let model,
    url: string,
    action: 'url'|'upload' = 'url';

    async function save() {
        if (action === 'upload') {
            // go to server, pull the image and return the url
            return;
        }

        if (onSave) {
            onSave(url);
        }

    }
</script>
<form on:submit|preventDefault={save}>
    <div class="my-4">
        <Label>Image URL</Label>
        <Input type="text" bind:value={url} placeholder="Image URL" />
    </div>

    <ul class="space-y-2">
        <li>
            <Radio bind:group={action} value="url">Use it as a link</Radio>
        </li>
        <li>
            <Radio bind:group={action} value="upload">Pull the image and save it</Radio>
        </li>
    </ul>

    <div class="my-4">
        <Button color="blue" type="submit" class="w-full">Next</Button>
    </div>
</form>
