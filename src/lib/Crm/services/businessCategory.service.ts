import {BaseHttpService} from "../../Shared/base-http.service";
import type {IGenericObject} from "../../Shared/models/generic";

export class BusinessCategoryService extends BaseHttpService {
    async tree() {
        return await this.get(`business-category/tree`);
    }

    async move(uuid: string, newParentUuid?: string) {
        const body = newParentUuid ? { newParentUuid } : {};

        return await this.patch(`business-category/${uuid}/move`, body, {
            successMessage: 'Moved successfully',
            errorMessage: 'Failed to move category',
        });
    }

    async findOne(uuid: string, relationships: string[] = []) {
        const filters = relationships.length > 0 ? { with: relationships } : {};
        return await super.get(`business-category/${uuid}`, filters, {
            errorMessage: 'Failed to get category',
        });
    }

    async update(uuid: string, data: IGenericObject) {
        return await super.patch(`business-category/${uuid}`, data, {
            successMessage: 'Updated successfully',
            errorMessage: 'Failed to update category',
        });
    }

    async store(data: IGenericObject) {
        return await super.post(`business-category`, data, {
            successMessage: 'Created successfully',
            errorMessage: 'Failed to create category',
        });
    }

    async deleteOne(uuid: string, deleteType: string) {
        return await super.delete(`business-category/${uuid}?deleteType=${deleteType}`, {
            successMessage: 'Deleted successfully',
            errorMessage: 'Failed to delete category',
        });
    }

    async updateTree(tree: IGenericObject) { }
}
