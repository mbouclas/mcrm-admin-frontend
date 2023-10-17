import type {IGenericObject} from "../Shared/models/generic";
import type {IDynamicFieldBlueprint, IDynamicFieldConfigBlueprint} from "../DynamicFields/types";

export interface IZodSchema {
    type: string;
    properties: Properties;
    required?: string[] | null;
    additionalProperties: boolean;
    $schema: string;
}
export interface IZodProperty {
    type: string;
    description: string;
}
export interface Properties {
    [key: string]: IZodProperty;
}

export function flattenTree(tree, key = 'children', collection = [], level = 0) {
    if (!Array.isArray(tree)) return;

    for (var i=0; i < tree.length; i++) {
        const child = tree[i];
        child['level'] = level;

        collection.push(child);
        if (Array.isArray(child[key])) {
            collection = [...flattenTree(child[key], key, collection, level + 1)];
        }
    }

    return collection;
}


export function filterInFields(input: string, arr: object[], searchFields: string[], filterOnProp?: string) {
    const regex = new RegExp(input, 'gmi');

    return arr.filter(item => {
        for (let key in searchFields) {
            if (!item[searchFields[key]]) {
                continue;
            }
            const match = (filterOnProp) ? item[searchFields[key]][filterOnProp].match(regex) : item[searchFields[key]].match(regex);
            if (match && match.length > 0) { return item; }
        }
    });
}

export function schemaToFields(schema: IZodSchema) {
    if (!schema) {return  [];}
    const fields = [];

    for (let key in schema.properties) {
        const property = schema.properties[key];
        if (property.description && property.description.indexOf('json:') !== -1) {
            const json = JSON.parse(property.description.replace('json:', ''));

            for (let k in json) {
                property[k] = json[k];
            }
        }

        const field = {
            varName: key,
            label: property['label'] || key,
            hint: property['hint'] || property.description || '',
            placeholder: property['placeholder'] || '',
            type: property.type,
            required: schema.required && schema.required.indexOf(key) > -1,
            default: property['default'] || undefined,
            options: property['options'] || [],
        };

        fields.push(field);
    }

    return fields;
}

export function setupModelFromFields<T>(model: T, fields: IDynamicFieldConfigBlueprint[]): T {
    fields.forEach(field => {
        if (field.type === 'json' && typeof model[field.varName] === 'undefined') {
            model[field.varName] = {};
        }

        model[field.varName] = getModelValueFromFieldSchema(field);

        if (field.schema) {
            schemaToFields(field.schema).forEach(f => {
                if (model[field.varName][f.varName]) {return;}
                model[field.varName][f.varName] = getModelValueFromFieldSchema(f);
            });
        }
    });

    return model;
}

export function getModelValueFromFieldSchema<T>(field: IDynamicFieldConfigBlueprint) {
    switch (field.type) {
        case 'boolean':
        case 'switch':
        case 'toggle':
            return false;
        case 'array':
            return [];
        case 'json':
        case 'image':
        case 'file':
            return {};
        default:
            return '';
    }
}
