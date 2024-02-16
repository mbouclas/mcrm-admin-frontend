import {BaseHttpService} from "../../Shared/base-http.service";
import type {IGenericObject} from "../../Shared/models/generic";
import queryString from "query-string";

export class BusinessService extends BaseHttpService {
    async findOne(uuid: string, relationships: string[] = []) {
        const filters = relationships.length > 0 ? { with: relationships } : {};
        return await this.get(`business/${uuid}`, filters);
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

        return await this.get(`business${qs ? `?${qs}` : ''}`);
    }

    async update(id: string, data: IGenericObject) {
        return await this.patch(`business/${id}`, data, {
            successMessage: 'Updated successfully',
            errorMessage: 'Failed to update',
        });
    }

    async store(data: IGenericObject) {
        return await super.post(
            'business',
            { ...data, active: true },
            {
                successMessage: 'Created successfully',
                errorMessage: 'Failed to create',
            },
        );
    }

    async savePageCategories(businessId: string, categories: IGenericObject[]) {
        const res = await super.patch(`business/${businessId}/businessCategories`, categories);
    }

    async relate(sourceUuid: string, destinationUuids: string[], type: string) {
        const successMessage = type === 'relate' ? 'Related successfully' : 'Unrelated successfully';
        const errorMessage = type !== 'relate' ? 'Failed to relate' : 'Failed to unrelate';

        const res = await super.post(
            `business/manage-relate`,
            {
                sourceUuid,
                destinationUuids,
                type,
            },
            { successMessage, errorMessage },
        );

        return res;
    }
}
