import {BaseHttpService} from "../../../Shared/base-http.service";
import type {IGenericObject} from "../../../Shared/models/generic";
import queryString from "query-string";
import {html} from "gridjs";

export class ProductsService extends BaseHttpService {

    async activateRows(selectedIds: string[]) {
        // return await super.post('/product/activate', { selectedIds });
        return true;
    }

    async activateRow(itemId: string) {
        // return await super.patch('/product/activate', { itemId });
        return true;
    }

    async de_activateRows(selectedIds: string[]) {
        // return await super.post('/product/de-activate', { selectedIds });
        return true;
    }

    async de_activateRow(itemId: string) {
        // return await super.patch('/product/de-activate', { itemId });
        return true;
    }
    
    async deleteRows(selectedIds: string[]) {
        // return await super.post('/product/delete', { selectedIds });
        return true;
    }
    
    async deleteRow(itemId: string) {
        // return await super.delete(`/product/delete/${itemId}`);
        return true;
    }

    getGridUrl(filters = {}) {
        return super.getGridUrl('product', filters, res => {
            return res.data.map(row => [
                row.uuid,
                html(`<a href='${row.uuid}'>${row.title}</a>`),
                row.sku,
                row.price,
                row.createdAt,
                row.updatedAt,
                row.active,
            ])
        })
    }

    async findOne(uuid: string, relationships: string[] = []) {
        const filters = relationships.length > 0 ? {with: relationships} : {};
        return await this.get(`product/${uuid}`, filters);
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
