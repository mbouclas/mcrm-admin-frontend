import {BaseHttpService} from "../../Shared/base-http.service";
import type {IGenericObject} from "../../Shared/models/generic";
import queryString from "query-string";
export interface IShippingMethod {
    code: string;
    shippingTime: string;
    providerName: string;
    title: string;
    uuid: string;
    slug: string;
    status: boolean;
    baseCost?: number;
}

export interface IShippingMethodProvider {
    id: string;
    title: string;
    description: string;
}

export class ShippingService extends BaseHttpService {

    async findOne(uuid: string, relationships: string[] = []) {
        const filters = relationships.length > 0 ? { with: relationships } : {};
        return await this.get(`shipping-method/${uuid}`, filters);
    }

    async find(filters: IGenericObject = {}, relationships: string[] = []) {
        let qs;
        if (Object.keys(filters).length > 0) {
            qs = queryString.stringify(filters);
        }

        if (relationships.length > 0) {
            qs = qs
                ? `${qs}&${relationships.map((r) => `with[]=${r}`).join('&')}`
                : relationships.map((r) => `with[]=${r}`).join('&');
        }

        return await this.get(`shipping-method${qs ? `?${qs}` : ''}`);
    }

    async getProviders() {
        return await this.get(`shipping-method/providers`);
    }
}
