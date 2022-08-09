import {BaseHttpService} from "../../../Shared/base-http.service";
import type {IGenericObject} from "../../../Shared/models/generic";
import queryString from "query-string";
import {html} from "gridjs";

export class ProductsService extends BaseHttpService {



    getGridUrl(filters = {}) {
        return super.getGridUrl('product', filters, res => {
            return res.data.map(row => [
                html(`<a href='${row.uuid}'>${row.title}</a>`),
                row.sku,
                row.createdAt,
            ])
        })
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
