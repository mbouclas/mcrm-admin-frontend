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

export function flattenTree(tree, key = 'children', collection = []) {
    if (!Array.isArray(tree)) return;

    for (var i=0; i < tree.length; i++) {
        const child = tree[i];

        collection.push(child);
        if (Array.isArray(child[key])) {
            collection = [...flattenTree(child[key], key, collection)];
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
    const fields = [];

    for (let key in schema.properties) {
        const property = schema.properties[key];
        const field = {
            varName: key,
            label: key,
            type: property.type,
            required: schema.required && schema.required.indexOf(key) > -1,
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

        if (field.schema) {
            schemaToFields(field.schema).forEach(f => {
                if (model[field.varName][f.varName]) {return;}

                switch (f.type) {
                    case 'boolean':
                    case 'switch':
                    case 'toggle':
                        model[field.varName][f.varName] = false;
                        break;
                    case 'array':
                        model[field.varName][f.varName] = [];
                        break;
                    case 'json':
                        model[field.varName][f.varName] = {};
                        break;
                    default:
                        model[field.varName][f.varName] = '';
                }
            })
        }
    });

    return model;
}
