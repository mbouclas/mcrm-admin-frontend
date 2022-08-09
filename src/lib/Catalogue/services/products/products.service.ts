import {BaseHttpService} from "../../../Shared/base-http.service";
import type {IGenericObject} from "../../../Shared/models/generic";
import queryString from "query-string";

export class ProductsService extends BaseHttpService {

    generateUrlForList(filters: IGenericObject = {}) {
        let qs;
        if (Object.keys(filters).length > 0) {
            qs = queryString.stringify(filters);
        }

        return `${this.apiUrl}product${qs ? `?${qs}` : ''}`
    }

    async findOne(id: string) {

    }

    async find(filters: IGenericObject = {}) {
        let qs;
        if (Object.keys(filters).length > 0) {
            qs = queryString.stringify(filters);
        }

        return await this.get(`product${qs ? `?${qs}` : ''}`);
    }

    async update(id: string, data: IGenericObject) {

    }

    async store(data: IGenericObject) {

    }

}
