import type { IDynamicFieldConfigBlueprint } from "../DynamicFields/types";

export default function getModelPrototypeFromFields(fields: IDynamicFieldConfigBlueprint[]) {
    const tmp = {};
    fields.forEach(field => {
        if (['text','textarea'].indexOf(field.type) !== -1) {
            tmp[field.varName] = '';
        } 

        if (field.type === 'boolean') {
            tmp[field.varName] = false;
        } 

        if (['image','itemSelector', 'listSelector'].indexOf(field.type) !== -1) {
            tmp[field.varName] = {};
        } 
    })
    return tmp;
}