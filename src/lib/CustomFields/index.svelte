<script lang="ts">
    import ModelSelector from './model-selector.svelte';
    import { Modal} from "flowbite-svelte";
    import {ArrowTopRightOnSquare} from 'svelte-heros-v2';
    import EditField from './edit-field.svelte';
    import type {IDynamicFieldConfigBlueprint} from "../DynamicFields/types";
    import {useNavigate} from "mcrm-svelte-navigator";
    import type {IBaseModel} from "../DynamicFields/base-model";
    const navigate = useNavigate();

    let showModelSelectorModal = false,
        showEditFieldModal = false,
        selectedField: Partial<IDynamicFieldConfigBlueprint> = null;


    function onSelection(model: Partial<IBaseModel>|Partial<IBaseModel>[]) {
        navigate(`/settings/cf/${model.name}`);
        // showModelSelectorModal = false
    }




</script>


<ModelSelector mode="custom" onSelection={onSelection} >
    <div slot="selector" let:model>
        <button on:click={onSelection.bind(this, model)}><ArrowTopRightOnSquare /></button>
    </div>
</ModelSelector>




<!--<FieldSelector let:field={field} mode="list">
    <div slot="actions">
        <Button on:click={editField.bind(this, field)} title="Edit">
            <ArrowTopRightOnSquare/>
        </Button>

        <Button on:click={deleteField.bind(this, field)} title="Delete">
            <Trash/>
        </Button>
    </div>
</FieldSelector>-->
