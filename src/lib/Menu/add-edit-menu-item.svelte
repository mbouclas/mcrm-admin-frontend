<script lang="ts">
    import {MenuItemModel} from "./models";
    import {onMount} from "svelte";
    import {MenuService} from "./menu.service";
    import {z, ZodError} from "zod";
    import {formatZodErrors} from "../helpers/errors";
    import {Button, Heading, Helper, Input, Label, TabItem, Tabs} from "flowbite-svelte";
    import {
        pageCategoryItemSelectorConfig, pageItemSelectorConfig,
        productCategoryItemSelectorConfig,
        productItemSelectorConfig
    } from "../Shared/item-selector-configs";
    import CustomFields from "../CustomFields/group-field-renderer.svelte";
    import ItemSelectorModal from "../DynamicFields/fields/item-selector-modal.svelte";
    import {FilterOutline} from "flowbite-svelte-icons";


    const fields = MenuItemModel.getModelFields().filter(f => f.varName === 'metaData');
    //add target field as the first element of the fields array

    fields.unshift(
        {
            varName: 'target',
            label: 'Link opens in',
            placeholder: 'Link opens in',
            type: 'select',
            options: [
                {
                    label: 'Same Tab',
                    value: '_self',
                    default: true,
                },
                {
                    label: 'New Tab',
                    value: '_blank',
                }
            ],
        },
    )
    export let model: MenuItemModel = new MenuItemModel();
    export let menuId: string;
    export let parentId: string;
    export let onSave: (model: MenuItemModel, tree: MenuItemModel[]) => void;
    let selectedModel: Partial<MenuItemModel>;
    const menuService = new MenuService();
    let childrenToAdd = null;

    const schema = z.object({
        title: z.string({required_error: 'Title is required', invalid_type_error: 'Title must be a string'}).min(1, 'Title is required'),
        description: z.string({invalid_type_error: 'Description must be a string'}).optional(),
        caption: z.string({ invalid_type_error: 'Caption must be a string'}).optional(),
    });


    let ready = false,
        errors = {};

    onMount(async () => {
        if (model.uuid) {
            model = await menuService.getMenuItem(model.uuid);
        }

        if (parentId) {
            model.parentUuid = parentId;
        }

        ready = true;
    })

    async function save() {
        try {
            MenuItemModel.modelSchema.parse(model);
        }
        catch (e) {
            if (e instanceof ZodError) {
                errors = formatZodErrors(e);
            }
            console.log(errors)
            return;
        }
        let tree,
        res;

        if (model.uuid) {
           res = await menuService.updateMenuItem(model.uuid, model);
        }
        else {
            res = await menuService.createMenuItem(menuId, model);
            model.uuid = res.item.uuid;
        }

        if (childrenToAdd) {
            await addItemChildren({...childrenToAdd.item, ...{uuid: model.uuid}}, childrenToAdd.modelName);
            childrenToAdd = null;
        }

        if (onSave)
        {
            onSave(model, res.tree);
        }

    }

    async function onSelect(item: MenuItemModel, modelName: string) {
        // convert this to a menu item and send it to the Backend
        model.type = 'object';
        model.model = modelName;
        const temp = Object.assign({}, model);
        const y = await new MenuService().toMenuItem(modelName, item);
        model = new MenuItemModel(y);
        model.target = temp.target;
        model.metaData = temp.metaData;

        if (Array.isArray(item.children) && item.children.length > 0) {
            const r = confirm('This item has children. Do you want to add them too?')
            if (r) {
                childrenToAdd = {item, modelName};
                childrenToAdd.item.children.forEach(c => {
                    c.type = 'object';
                    c.model = modelName;
                })
            }
        }
    }

    async function addItemChildren(item: MenuItemModel, modelName: string) {
        await new MenuService().addMenuItemChildren(menuId, item, modelName);
    }

    function setMenuTypeToObject(modelName: string) {
        // already set
        if (model.permalink) {
            const c = confirm('Are you sure you want to change the type of this menu item? This will reset your selection.')
            if (!c) {
                return;
            }
            model.title = null;
            model.permalink = null;
        }


        model.type = 'object';
        model.model = modelName;
    }

</script>
{#if ready}

    <form on:submit|preventDefault={save}>
        <div class="my-4">
            <Label>Title</Label>
            <Input bind:value={model.title} placeholder="Title" disabled={model.type !== 'custom'} />
            {#if errors['title']}
                <Helper class="mt-2" color="red">
                    {errors['title'].message}
                </Helper>
            {/if}
        </div>
        <div class="my-4">
            <Heading tag="h6">Type of menu</Heading>

        <Tabs style="underline">
            <TabItem open={model.type === 'custom'} title="Custom Link" on:click={() => model.type = 'custom'}>
                <div class="my-4">
                    <Label>Link</Label>
                    <Input bind:value={model.link} placeholder="link" />
                    {#if errors['link']}
                        <Helper class="mt-2" color="red">
                            {errors['link'].message}
                        </Helper>
                    {/if}
                </div>
                <div class="my-4">
                    <Label>Caption</Label>
                    <Input bind:value={model.caption} placeholder="Caption" />
                    {#if errors['caption']}
                        <Helper class="mt-2" color="red">
                            {errors['caption'].message}
                        </Helper>
                    {/if}
                </div>
            </TabItem>
            <TabItem  on:click={setMenuTypeToObject.bind(this, 'ProductCategory')} open={model.type === 'object' && model.model === 'ProductCategory'} title="Product Category">
                <ItemSelectorModal
                        config={productCategoryItemSelectorConfig}
                        on:select={(e) => onSelect(e.detail, 'ProductCategory')}
                        closeOnSelect={true}
                        label="Select Product Category"
                        selectMode="single"
                >
                    <Button color="purple" type="button" class="gap-2.5">
                        Select Product Category <FilterOutline />
                    </Button>
                </ItemSelectorModal>
            </TabItem>
            <TabItem  on:click={setMenuTypeToObject.bind(this, 'Product')} open={model.type === 'object' && model.model === 'Product'} title="Product">
                <ItemSelectorModal
                        config={productItemSelectorConfig}
                        on:select={(e) => onSelect(e.detail, 'Product')}
                        closeOnSelect={true}
                        label="Select Product"
                        selectMode="single"
                >
                    <Button color="purple" type="button" class="gap-2.5">
                        Select Product <FilterOutline />
                    </Button>
                </ItemSelectorModal>

            </TabItem>

            <TabItem  on:click={setMenuTypeToObject.bind(this, 'PageCategory')} open={model.type === 'object' && model.model === 'PageCategory'} title="Page Category">
                <ItemSelectorModal
                        config={pageCategoryItemSelectorConfig}
                        on:select={(e) => onSelect(e.detail, 'PageCategory')}
                        closeOnSelect={true}
                        label="Select Page Category"
                        selectMode="single"
                >
                    <Button color="purple" type="button" class="gap-2.5">
                        Select Page Category <FilterOutline />
                    </Button>
                </ItemSelectorModal>
            </TabItem>
            <TabItem  on:click={setMenuTypeToObject.bind(this, 'Page')} open={model.type === 'object' && model.model === 'Page'} title="Page">
                <ItemSelectorModal
                        config={pageItemSelectorConfig}
                        on:select={(e) => onSelect(e.detail, 'Page')}
                        closeOnSelect={true}
                        label="Select Page"
                        selectMode="single"
                >
                    <Button color="purple" type="button" class="gap-2.5">
                        Select Page <FilterOutline />
                    </Button>
                </ItemSelectorModal>
            </TabItem>
        </Tabs>
            <div>
                {#if model.model && model.title}
                    <ul>
                        <li>Selected Type: <strong>{model.model}</strong></li>
                        <li>Selected Item: <strong>{model.title}</strong></li>
                        <li>Url: <strong>{model.permalink || model.link || ''}</strong></li>
                    </ul>

                {/if}
            </div>
        </div>


            <CustomFields fields={fields} let:field={field} fieldPrimaryKey="varName" bind:model={model} outerClass={''} useHeadingsForNestedFields={false}>

            </CustomFields>

        <div class="mb-4 mt-4">

            <Button type="submit" size="sm" color="green" class="w-full">
                Save
            </Button>
        </div>
    </form>
{/if}



