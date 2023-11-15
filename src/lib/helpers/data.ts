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

        if (['nested', 'json'].indexOf(field.type) !== -1 && property['properties']) {
            field['fields'] = schemaToFields(property as unknown as IZodSchema);
        }

        fields.push(field);
    }

    return fields;
}

export function setupModelFromFields<T>(model: T, fields: IDynamicFieldConfigBlueprint[]): T {
    fields.forEach(field => {

        if (['json', 'nested'].indexOf(field.type) !== -1  && typeof model[field.varName] === 'undefined') {
            model[field.varName] = {};
        }

        model[field.varName] = getModelValueFromFieldSchema(field, model[field.varName]);

        if (field.schema) {
            schemaToFields(field.schema).forEach(f => {
                if (model[field.varName][f.varName]) {return;}
                model[field.varName][f.varName] = getModelValueFromFieldSchema(f, model[field.varName][f.varName]);
            });
        }
    });

    return model;
}

export function getModelValueFromFieldSchema<T>(field: IDynamicFieldConfigBlueprint, value: any) {
    switch (field.type) {
        case 'boolean':
        case 'switch':
        case 'toggle':
            return typeof value === 'boolean' ? value : false;
        case 'array':
            return Array.isArray(value) ? value : [];
        case 'json':
        case 'nested':
        case 'image':
        case 'file':
            return typeof value === 'object' ? value : {};
        default:
            return value || '';
    }
}

export function findFieldInArray(fields: IDynamicFieldConfigBlueprint[], varName: string) {
    return fields.find(f => f.varName === varName);
}

export function getPropertyFromObject(key: string, obj?: any) {
    if (!key.includes('.') && !obj) {
        return null;
    }

    const keys = key.split('.'); // Split the key into an array of nested keys

    if (!obj) {
        return null; // Get the object to get the property from
    }

    if (keys.length === 1 && obj[keys[0]]) {
        return obj[key]; // Base case: Return the property value
    }

    const currentKey = keys.shift(); // Remove the current key from the array
    const nestedObject = obj[currentKey]; // Access the nested object

    if (!nestedObject) {
        return undefined; // Property not found, return undefined or handle the error
    }

    return getPropertyFromObject(keys.join('.'), nestedObject); // Recursive call with the remaining keys
}


export function reorderArray(arr, oldIndex, newIndex) {
    // Copy input array to avoid mutation
    let newArray = [...arr];
    // Check indexes
    if (newIndex >= newArray.length) {
        let k = newIndex - newArray.length;
        while ((k--) + 1) {
            newArray.push(undefined);
        }
    }
    // Reorder array
    newArray.splice(newIndex, 0, newArray.splice(oldIndex, 1)[0]);
    return newArray;
}
