import type {IGenericObject} from "../../Shared/models/generic";

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
    isSortable = false;
    exported = false;
    fieldSettings?: IGenericObject = {};

    constructor(config?: CustomFieldModel) {
        if (config) {
            for (const key in config) {
                if (config.hasOwnProperty(key)) {
                    this[key] = config[key];
                }
            }
        }
    }
}
