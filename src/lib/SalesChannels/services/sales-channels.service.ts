import {BaseHttpService} from "../../Shared/base-http.service";
import type {IGenericObject} from "../../Shared/models/generic";
import queryString from "query-string";

export interface ISalesChannel {
    uuid: string;
    title: string;
    description: string;
    slug: string;
    active: string;
    default: string;
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

    async findOne(uuid: string, relationships: string[] = []) {
        const filters = relationships.length > 0 ? { with: relationships } : {};
        return await this.get(`sales-channels/${uuid}`, filters);
    }

    async sync(channels: ISalesChannel[], itemId: string, model: string) {
        return await super.post(`sales-channels/${itemId}/save`, {channels, model}, {
            successMessage: 'Sales Channels Saved',
        });
    }

    async update(uuid: string, channel: Partial<ISalesChannel>) {
        return await super.patch(`sales-channels/${uuid}`, channel, {
            successMessage: 'Sales Channel Updated',
        });
    }

    async store(channel: Partial<ISalesChannel>) {
        return await super.post(`sales-channels`, channel, {
            successMessage: 'Sales Channel Created',
        });
    }
}
