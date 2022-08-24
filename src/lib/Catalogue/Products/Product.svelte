<script lang="ts">
    import { useParams } from "svelte-navigator";
    import Form from '../../DynamicFields/Form.svelte';
    import Fields from '../../DynamicFields/Renderer.svelte';
    import {ProductsService} from "../services/products/products.service";
    import {onMount} from "svelte";
    import {AppService} from "../../Shared/app.service";
    import type {IDynamicFieldConfigBlueprint} from "../../DynamicFields/types";
    import Loading from "../../Shared/Loading.svelte";

    const s = new ProductsService();
    const params = useParams();
    let model;
    let fields: IDynamicFieldConfigBlueprint[] = [];
    let mainFields = [];
    let secondaryFields = [];

    onMount(async () => {
        model = await s.findOne($params.id, ['*'])
        fields = AppService.getModel('ProductModel').fields;
        fields.forEach(field => {
            if (!field.group || field.group === 'main') {
                mainFields.push(field);
            }
            if (field.group === 'right') {
                secondaryFields.push(field);
            }
        })
    });


    const onSubmit = async data => {
     console.log('Submit', data)
        await s.update($params.id, data)
        // Show a toast of success, goes away after 4 seconds
    };
</script>
{#if !model}<Loading /> {/if}
{#if model}
    <div class="text-white">
        {JSON.stringify(model)}
    </div>
<Form onSubmit={onSubmit} withSubmit bind:model={model}>
    <div class="grid grid-cols-2">
        <div>
            <Fields fields={mainFields} bind:model={model}></Fields>
        </div><!-- END BLOCK -->
        <div>
            <Fields fields={secondaryFields} bind:model={model}></Fields>
        </div><!-- END BLOCK -->
    </div>
</Form>
{/if}
