import {BaseHttpService} from "../../Shared/base-http.service";
import {get} from "svelte/store";
import {app} from "../../stores";
import type {IGenericObject} from "../../Shared/models/generic";
import {sortBy, filter, find} from "lodash";
import type {IDynamicFieldConfigBlueprint} from "../../DynamicFields/types";
import {BootService} from "../../Shared/boot.service";
import {AppService} from "../../Shared/app.service";
import type {IBaseModelFieldGroup} from "../models/groups.model";
export interface ICustomFieldType {
    name: string;
    label: string;
    icon: string;
    description: string;
    fieldSettings?: IDynamicFieldConfigBlueprint[];
}

export interface ICustomFieldSelectOption {
    label: string;
    value: string;
    default?: boolean;
}





export class CustomFieldsService extends BaseHttpService {

    static allModels() {
        return sortBy(AppService.getAvailableModels().map(model => {
            return {
                label: model.name.replace('Model', ''),
                value: model.name,
            }
        }), 'label');
    }

    async sync(modelName: string, field: Partial<IDynamicFieldConfigBlueprint>) {
        await super.post(`model-manager/sync`, {modelName, field});
        // reload the models into the store and localstorage
        await new BootService().boot();

    }

    async syncFieldGroups(modelName: string, fieldGroups: Partial<IBaseModelFieldGroup>[]) {
        await super.post(`model-manager/sync/model`, {modelName, fieldGroups}, {
            successMessage: 'Model synced successfully',
        });
        // reload the models into the store and localstorage
        await new BootService().boot();
    }

    allFields(filters?: IGenericObject) {
        const models = get(app).models;
        const fields = [];
        models.forEach(model => {
            model.fields.forEach(field => {
                const found = fields.findIndex(f => f.varName === field.varName);

                if (found !== -1) {
                    fields[found].model.push(model.name);
                    return;
                }

                field.model = [model.name];

                fields.push(field);
            });
        });

        if (!filters) {
            return sortBy(fields, 'label');
        }

        return sortBy(filter(fields, filters), 'label');
    }

    modelFields(modelName: string, filters?: IGenericObject) {
        const models = get(app).models;
        const model = models.find(m => m.name === modelName);

        if (!filters) {
            return sortBy(model.fields, 'varName');
        }

        return sortBy(filter(model.fields, filters), 'varName');
    }

    static getFieldTypes(filters?: IGenericObject) {
        if (!filters) {
            return CustomFieldTypes;
        }

        return filter(CustomFieldTypes, filters) as ICustomFieldType[];

    }

    static getFieldSettings(filters?: IGenericObject) {
        if (!filters) {
            return CustomFieldModelSettings;
        }

        return filter(CustomFieldModelSettings, filters) as Partial<IDynamicFieldConfigBlueprint>[];
    }

    static getFieldSetting(filters: IGenericObject) {
        return find(CustomFieldModelSettings, filters);
    }
}

export const CustomFieldTypes: ICustomFieldType[] = [
    {
        name: 'text',
        label: 'Text',
        icon: 'text',
        description: 'A simple text field',
    },
    {
        name: 'number',
        label: 'Number',
        icon: 'number',
        description: 'A simple number field',
    },
    {
        name: 'boolean',
        label: 'Boolean',
        icon: 'boolean',
        description: 'A simple boolean field',
    },
    {
        name: 'item-selector',
        label: 'Item Object',
        icon: 'boolean',
        description: 'An item selector field',
        fieldSettings: [
            {
                varName: 'module',
                label: 'Module',
                placeholder: 'Module',
                type: 'select',
                options: CustomFieldsService.allModels,
            },
            {
                varName: 'selectMode',
                label: 'Selection Mode',
                placeholder: 'Selection Mode',
                type: 'select',
                options: [
                    {
                        label: 'Single',
                        value: 'single',
                        default: true,
                    },
                    {
                        label: 'Multiple',
                        value: 'multiple',
                    }
                ],
            },
            {
                varName: 'selectionProperty',
                label: 'Selection Property',
                placeholder: 'Selection Property',
                type: 'select',
                options: [
                    {
                        label: 'ID',
                        value: 'uuid',
                        default: true,
                    },
                    {
                        label: 'Title',
                        value: 'title',
                    },
                    {
                        label: 'Everything',
                        value: '*',
                    }
                ],
            },
        ]
    },
    {
        name: 'date',
        label: 'Date',
        icon: 'date',
        description: 'A simple date field',
    },
    {
        name: 'money',
        label: 'Money',
        icon: 'money',
        description: 'A simple money field',
    },
    {
        name: 'image',
        label: 'Image',
        icon: 'image',
        description: 'A simple image field',
    },
    {
        name: 'select',
        label: 'Select',
        icon: 'select',
        description: 'A simple select field',
    },
    {
        name: 'textarea',
        label: 'Textarea',
        icon: 'textarea',
        description: 'A simple textarea field',
    },
    {
        name: 'radio',
        label: 'Radio',
        icon: 'radio',
        description: 'A simple radio field',
    },
    {
        name: 'checkbox',
        label: 'Checkbox',
        icon: 'checkbox',
        description: 'A simple checkbox field',
    },
    {
        name: 'file',
        label: 'File',
        icon: 'file',
        description: 'A simple file field',
    },
    {
        name: 'richText',
        label: 'Rich Text',
        icon: 'rich-text',
        description: 'A simple rich text field',
    },
    {
        name: 'markDown',
        label: 'Markdown',
        icon: 'rich-text',
        description: 'A simple markdown field',
    },
    {
        name: 'nested',
        label: 'Group',
        icon: 'rich-text',
        description: 'A group of fields',
        fieldSettings: [
            {
                varName: 'perRow',
                label: 'Fields per row',
                placeholder: 'Fields per row',
                type: 'number',
                default: 1,
                hint: 'How many fields per row?',
            }
        ],
    },
    {
        name: 'repeater',
        label: 'Repeater',
        icon: 'rich-text',
        description: 'Repeatable group of fields',
        fieldSettings: [
            {
                varName: 'limit',
                label: 'Maximum number of items',
                placeholder: 'Maximum number of items',
                type: 'number',
                default: 1,
                hint: 'How many items can be added?',
            },
            {
                varName: 'perRow',
                label: 'Fields per row',
                placeholder: 'Fields per row',
                type: 'number',
                default: 1,
                hint: 'How many fields per row?',
            }
        ],
    }
];

export const CustomFieldModelSettings: Partial<IDynamicFieldConfigBlueprint>[] = [
    /*    {
            varName: 'test',
            label: 'Test',
            type: 'text',
            icon: 'sortable',
            hint: 'Is this field sortable?',
        },*/
    {
        varName: 'required',
        label: 'Required',
        type: 'boolean',
        icon: 'required',
        hint: 'Is this field required?',
    },
    {
        varName: 'translatable',
        label: 'Translatable',
        type: 'boolean',
        icon: 'translatable',
        hint: 'Is this field translatable?',
    },
    {
        varName: 'disabled',
        label: 'Disabled',
        type: 'boolean',
        icon: 'disabled',
        hint: 'Is this field disabled?',
    },
    {
        varName: 'isSlug',
        label: 'Is Slug',
        type: 'boolean',
        icon: 'slug',
        hint: 'Is this field a slug?',
    },
    {
        varName: 'isJson',
        label: 'Is Json',
        type: 'boolean',
        icon: 'json',
        hint: 'Is this field a json?',
    },
    {
        varName: 'isSortable',
        label: 'Is Sortable',
        type: 'boolean',
        icon: 'sortable',
        hint: 'Is this field sortable?',
    },

];
