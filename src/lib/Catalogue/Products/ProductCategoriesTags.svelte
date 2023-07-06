<script lang="ts">
    import Tags from '../../Shared/Tag.svelte';

    import {TagService} from "../../Shared/services/tag.service";
    export let itemId;
    export let model = [];
    export let saveOnAction = false;
    let tagList = [];

    (new TagService()).getTags('Product').then(tags => {
        tagList = tags;
    });

    async function onTagAdd(tags, tag) {
        // Was not found in the list, so it must be new
        if (!tag.uuid){
            const newTag = await (new TagService()).store(tag.name, 'Product');
            let foundIndex = tags.findIndex(t => t.name === tag.name);
            model[foundIndex] = newTag;
            model = tags;
        }

        if (!saveOnAction) {
            return
        }

        // sync with the mothership
        await (new TagService()).attachToModel('Product', itemId, tag);

    }

    async function onTagRemove(tags, tag) {
        if (!saveOnAction) {
            return
        }
        await (new TagService()).detachFromModel('Product', itemId, tag);

    }

</script>

<Tags
        bind:tags={model}
        autoComplete={tagList}
        autoCompleteKey={"name"}
        addKeys={[9, 13]}
        allowBlur={true}
        onlyUnique={true}
        onTagRemove={(tags, tag) => onTagRemove(tags, tag)}
        onTagAdd={(tags, tag) => onTagAdd(tags, tag)}
/>
