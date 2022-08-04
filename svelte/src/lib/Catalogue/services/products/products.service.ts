import {BaseHttpService} from "../../../Shared/base-http.service";
import type {IGenericObject} from "../../../Shared/models/generic";

export class ProductsService extends BaseHttpService {

    async findOne(id: string) {

    }

    async find() {
        await this.get('products')
    }

    async update(id: string, data: IGenericObject) {

    }

    async store(data: IGenericObject) {

    }

}
