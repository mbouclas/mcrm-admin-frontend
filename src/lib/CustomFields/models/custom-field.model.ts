import type {IGenericObject} from "../../Shared/models/generic";
import {type IZodSchema, schemaToFields} from "../../helpers/data";

export enum CustomFieldType {
    text = 'text',
    number = 'number',
    boolean = 'boolean',
    date = 'date',
    money = 'money',
    image = 'image',
    select = 'select',
    itemSelector = 'item-selector',
    json = 'json',
    slug = 'slug',
    richText = 'rich-text',
    color = 'color',
    range = 'range',
    mediaLibrary = 'media-library',
    email = 'email',
    password = 'password',
    hidden = 'hidden',
    textarea = 'textarea',
    checkbox = 'checkbox',
    radio = 'radio',
    file = 'file',
    group = 'group',
    repeatable = 'repeatable',
}
export class CustomFieldModel  {
    varName: string;
    label: string;
    hint?: string;
    type: CustomFieldType;
    placeholder?: string;
    default = false;
    translatable = false;
    required = false;
    disabled = false;
    isSlug = false;
    slugFrom?: string;
    isJson = false;
    min?: number;
    max?: number;
    step?: number;
    group?: string;
    order = 0;
    filterField?: string;
    isReadonly = false;
    isSortable = false;
    exported = false;
    fieldSettings?: IGenericObject = {};
    fields?: CustomFieldModel[] = [];
    schema?: IZodSchema;

    constructor(config?: CustomFieldModel) {
        if (config) {
            for (const key in config) {
                if (config.hasOwnProperty(key)) {
                    this[key] = config[key];
                }
            }
        }

        if (config && config.schema) {
            this.fields = schemaToFields(config.schema);
        }


    }
}
