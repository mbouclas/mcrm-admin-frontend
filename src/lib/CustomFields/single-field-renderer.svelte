<script lang="ts">
    import type {IDynamicFieldConfigBlueprint, IItemSelectorConfig} from "../DynamicFields/types";
    import {
        Badge,
        Button,
        Checkbox, Heading,
        Helper,
        Input,
        Label,
        MultiSelect,
        Select,
        Textarea,
        Toggle
    } from "flowbite-svelte";
    import Renderer from './group-field-renderer.svelte';
    import {schemaToFields} from "../helpers/data";
    import Image from "../DynamicFields/fields/image.svelte";
    import {getItemSelectorConfig} from "../Shared/item-selector-configs";
    import ItemSelectorModal from "../DynamicFields/fields/item-selector-modal.svelte";
    import {ArrowTopRightOnSquare, Trash} from "svelte-heros-v2";
    import type {IEvent} from "../Shared/models/generic";
    import CustomFields from "./group-field-renderer.svelte";
    import Repeater from "./repeater-field-renderer.svelte";
    import RichText from "../DynamicFields/fields/richtext.svelte";
    import MarkDown from './field-types/markdown.svelte';
    import type {ZodError} from "zod";
    import FormError from "../Shared/form-error.svelte";

    export let field: Partial<IDynamicFieldConfigBlueprint>;
    export let indentNested = false;
    export let indentNestedClass = 'ml-3';
    export let errors: Partial<ZodError>;
    export let model: any;
    export let outerClass = `my-4 border border-solid border-gray-500 px-4 ${field.fieldSettings && field.fieldSettings['perRow'] ? `grid gap-2 grid-cols-${field.fieldSettings['perRow']}` : ''}`;
    export let useHeadingsForNestedFields = true;

    let fields,
        itemSelectorConfig: IItemSelectorConfig,
        itemSelectorSelection = null;
    export let color = field['color'] || 'primary';
    let items = [];

    if (typeof model === 'undefined') {
        switch (field.type) {
            case 'boolean':
            case 'switch':
            case 'toggle':
                model = field.default || false;
                break;
            case 'array':
                model = field.default || [];
                break;
            case 'json':
                model = field.default || {};
                break;
            default:
                model = field.default || '';
        }
    }


    if (field.schema) {
        fieldsFromSchema();
    }

    if (field.type === 'select') {
        if (!Array.isArray(field.options) && typeof field.options !== 'function') {
            field.options = [];
        }

        if (typeof field.options === 'function') {
            field.options = field.options();
        }

        if (typeof model === 'string' && model.length === 0) {
            field.options.forEach((option) => {
                if (option.default) {
                    model = option.value;
                }
            });
        }
    }

    if (field.type === 'multiselect') {
        items = field.options.map(option => {
            return {...option, ...{name: option.label}}
        })
    }

    if (field.type === 'item-selector') {
        if (field.fieldSettings && field.fieldSettings.module) {
            itemSelectorConfig = getItemSelectorConfig(field.fieldSettings.module);
        }

        if (!field.fieldSettings.selectMode) {
            field.fieldSettings.selectMode = 'single';
        }

        itemSelectorSelection = (field.fieldSettings.selectMode === 'single') ? {} : [];
    }



    if (['group', 'nested'].indexOf(field.type) !== -1) {
        if (typeof model !== 'object') {
            model = {};
        }

        if (field.schema) {
            field.fields = schemaToFields(field.schema);
        }

    }

    if (field.type === 'repeater') {
       if (!Array.isArray(model)) {
           model = [];
       }
    }



    function fieldsFromSchema() {
        fields = schemaToFields(field.schema);
    }

    function onItemSelectorSelection(e: IEvent<any>) {
        itemSelectorSelection = e.detail;
        if (field.fieldSettings && field.fieldSettings.selectMode === 'single') {
            model = (field.fieldSettings && field.fieldSettings.selectionProperty && field.fieldSettings.selectionProperty !== '*')
                ? e.detail[field.fieldSettings.selectionProperty] : e.detail;

            return;
        }

        if (!Array.isArray(model)) {
            model = [];
        }

        e.detail.forEach((item) => {
            if (field.fieldSettings && field.fieldSettings.selectionProperty && field.fieldSettings.selectionProperty !== '*') {
                model.push(item[field.fieldSettings.selectionProperty]);
            } else {
                model.push(item);
            }
        });

    }

    function formatItemSelectorLabel(node: any) {
        const label = itemSelectorConfig.labelField;

        if ((typeof node === 'object' && Object.keys(node).length === 0) ) {return '';}

        if (label.indexOf(':::')) {
            return label.split(':::').map((item) => {
                return node[item];
            }).join(' ');
        }
    }

    function removeItemFromItemSelector(idx: number|null) {
        if (!idx) {
            model = {};
            itemSelectorSelection = {};
            return;
        }

        const temp = itemSelectorSelection;
        const temp2 = model;
        temp.splice(idx, 1);
        temp2.splice(idx, 1);

        itemSelectorSelection = temp;
        model = temp2;
    }

    if (['richText', 'rich', 'richtext'].indexOf(field.type) !== -1) {

    }

</script>

{#if ['input', 'text', 'string', 'number'].indexOf(field.type) !== -1}

    <Label>{field.label}</Label>
    <Input id={field.varName || field.name}
           bind:value={model}
           type={field.type}
           label={field.label}
           disabled={field.disabled || false}
           placeholder={field.placeholder || field.label}
    />
    {#if field.hint}
        <Helper class="text-gray-500 my-2">{field.hint}</Helper>
    {/if}
    <FormError {errors} key={field.varName} />
{:else if ['boolean', 'switch', 'toggle'].indexOf(field.type) !== -1}
    <Checkbox bind:checked={model} {color}>{field.label}</Checkbox>
    {#if field.hint}
        <Helper class="text-gray-500">{field.hint}</Helper>
    {/if}
    <FormError {errors} key={field.varName} />
{:else if ['textarea', 'description'].indexOf(field.type) !== -1}
    <Label>{field.label}</Label>
    <Textarea id={field.varName || field.name}
              bind:value={model}
              type={field.type}
              label={field.label}
              placeholder={field.placeholder || field.label} ></Textarea>
    <FormError {errors} key={field.varName} />
{:else if field.type === 'select'}
    <Label>{field.label}</Label>

    <Select bind:value={model}>
        {#each field.options as option}
            <option value={option.value}>{option.label}</option>
        {/each}
    </Select>
    <FormError {errors} key={field.varName} />
{:else if field.type === 'select'}
    <MultiSelect items={items} bind:value={model} size='lg' let:clear let:item
                 on:selected={onSelection}>
        <Badge color="green" dismissable params={{ duration: 100 }} on:close={clear}>
            {item.name}
        </Badge>
    </MultiSelect>
    <FormError {errors} key={field.varName} />
{:else if field.type === 'image'}
    <Image
            model={model}
            title={field.label || 'Image'}
            maxNumberOfFiles={1}
            module={field.settings ? field.settings['module'] : null}
            itemId={field.settings ? field.settings['itemId'] : null}
            type={field.settings ? field.settings['type'] : 'main'}
            on:allUploadsComplete={(e) => {
              model = e.detail;
            }}
    />
    <FormError {errors} key={field.varName} />
{:else if field.type === 'item-selector'}

    <ItemSelectorModal
            config={itemSelectorConfig}
            on:select={onItemSelectorSelection}
            closeOnSelect={true}
            label={field.label}
            selectMode={field.fieldSettings ? field.fieldSettings['selectMode'] : 'single'}
    >
        <Button class="gap-1.5">
            {field.label}
            <ArrowTopRightOnSquare />
        </Button>
    </ItemSelectorModal>
    <div>

        {#if Array.isArray(itemSelectorSelection) && itemSelectorSelection.length > 0}
            <p>Selected Items:</p>

            <ul>
                {#each itemSelectorSelection as item, idx}
                    <li>
                        <Button on:click={removeItemFromItemSelector.bind(this, idx)} class="gap-1.5">
                            {formatItemSelectorLabel(item)}
                        <Trash color="red" />
                    </Button>
                    </li>
                {/each}
            </ul>

        {:else}

            {#if itemSelectorSelection && Object.keys(itemSelectorSelection).length !== 0}
                <p>Selected Item</p>

                 <Button on:click={removeItemFromItemSelector.bind(this, null)} class="gap-1.5">
                     {formatItemSelectorLabel(itemSelectorSelection)} <Trash color="red" />
            </Button>

            {/if}



        {/if}
    </div>
{:else if ['group', 'nested'].indexOf(field.type) !== -1}
    <CustomFields fields={field.fields} let:field={child} fieldPrimaryKey="varName"
                  bind:model={model} bind:errors={errors}
                  {outerClass}>

        <svelte:fragment slot="heading">
            {#if useHeadingsForNestedFields}
            <Heading tag="h5">{field.label}</Heading>
            {/if}
        </svelte:fragment>

    </CustomFields>
{:else if field.type === 'repeater'}
<Repeater bind:model={model} fields={field.fields} {field} />
    {:else if ['richText', 'rich', 'richtext'].indexOf(field.type) !== -1}
    <RichText id={field.varName} bind:model={model} {field} />
    <FormError {errors} key={field.varName} />
{:else if ['markDown', 'md', 'markdown'].indexOf(field.type) !== -1}
    <MarkDown bind:model={model} {field}>

    <svelte:fragment slot="heading">{field.label}</svelte:fragment>
    <svelte:fragment slot="hint">{field.hint || ''}</svelte:fragment>


    </MarkDown>
    <FormError {errors} key={field.varName} />
{:else if field.schema && Array.isArray(fields)}
    <div class={`${indentNested ? indentNestedClass : ''}`}>
    <Renderer fields={fields} bind:model={model}  />
    </div>
{/if}

