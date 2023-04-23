import type { IDynamicFieldConfigBlueprint } from "../DynamicFields/types";

export default function getModelPrototypeFromFields(fields: IDynamicFieldConfigBlueprint[]) {
  const tmp = {};
  fields.forEach(field => {
    if (['text', 'textarea'].indexOf(field.type) !== -1) {
      tmp[field.varName] = '';
    }

    if (field.type === 'boolean') {
      tmp[field.varName] = false;
    }

    if (field.type === 'number') {
      tmp[field.varName] = 0;
    }

    if (field.type === 'related') {
      if (field.isCollection) {
        tmp[field.varName] = [getModelPrototypeFromFields(field.fields)]

      } else {
        tmp[field.varName] = getModelPrototypeFromFields(field.fields)
      }
    }

    if (['image', 'itemSelector', 'listSelector'].indexOf(field.type) !== -1) {
      tmp[field.varName] = {};
    }
  })
  return tmp;
}
