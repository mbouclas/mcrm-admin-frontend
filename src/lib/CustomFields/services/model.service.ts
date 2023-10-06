import {app} from "../../stores";
import {get} from "svelte/store";
import {filter, find, sortBy} from 'lodash'
import type {IGenericObject} from "../../Shared/models/generic";
import {BaseHttpService} from "../../Shared/base-http.service";
import type {CustomFieldModel} from "../models/custom-field.model";

export class ModelService extends BaseHttpService {
    find(filters?: IGenericObject) {
        if (!filters) {return sortBy(get(app).models, 'name');}

        return sortBy(filter(get(app).models, filters), 'name');
    }

    findOne(filters: IGenericObject) {
        return find(filters);
    }

    async store(model: CustomFieldModel) {

    }
}
