import {BaseHttpService} from "../../Shared/base-http.service";
import type {IGenericObject} from "../../Shared/models/generic";
import queryString from "query-string";

export interface ISalesChannel {
    uuid: string;
    title: string;
    description: string;
    slug: string;
    active: string;
}

export class SalesChannelsService extends BaseHttpService {
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

        return await this.get(`sales-channels${qs ? `?${qs}` : ''}`);
    }

    async save(channels: ISalesChannel[], itemId: string, model: string) {
        return await super.post(`sales-channels/${itemId}/save`, {channels, model}, {
            successMessage: 'Sales Channels Saved',
        });
    }
}
