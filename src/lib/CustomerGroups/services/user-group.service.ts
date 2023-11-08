import {BaseHttpService} from "../../Shared/base-http.service";
import type {IGenericObject} from "../../Shared/models/generic";
import queryString from "query-string";
import type {CustomerGroupModel} from "../models/customer-group.model";
import {z} from "zod";

export const CustomerGroupSchema =  z.object({
    title: z.string({required_error: 'Title is required'}).min(4, 'Min 4 characters'),
    description: z.string({required_error: 'Description is required'}).min(4, 'Min 4 characters'),
});

export class UserGroupService extends BaseHttpService {
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

        return await this.get(`user-group${qs ? `?${qs}` : ''}`);
    }

    async findOne(uuid: string, relationships: string[] = []) {
        const filters = relationships.length > 0 ? { with: relationships } : {};
        return await this.get(`user-group/${uuid}`, filters);
    }

    async store(record: CustomerGroupModel) {
        return await this.post(`user-group`, record, {
            successMessage: 'User group created successfully',
        });
    }

    async update(uuid: string, record: CustomerGroupModel) {
        return await this.patch(`user-group/${uuid}`, record, {
            successMessage: 'User group updated successfully',
        });
    }

    async delete(uuid: string) {
        return await super.delete(`user-group/${uuid}`, {
            successMessage: 'User group deleted successfully',
        });
    }
}
