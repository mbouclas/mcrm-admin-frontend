import { setNotificationAction } from '../../../stores';

import { BaseHttpService } from '../../../Shared/base-http.service';
import type { IGenericObject } from '../../../Shared/models/generic';

export class ProductCategoryService extends BaseHttpService {
  async tree() {
    return await this.get(`product-category/tree`);
  }

  async move(uuid: string, newParentUuid?: string) {
    try {
      const body = newParentUuid ? { newParentUuid } : {};

      const response = await this.patch(`product-category/${uuid}/move`, body);

      setNotificationAction({
        message: 'Moved successfully',
        type: 'success',
      });

      return response;
    } catch (e) {
      setNotificationAction({
        message: 'Failed to move category',
        type: 'error',
      });
    }
  }

  async findOne(uuid: string, relationships: string[] = []) {
    const filters = relationships.length > 0 ? { with: relationships } : {};
    try {
      return await super.get(`product-category/${uuid}`, filters);

    } catch (e) {
      setNotificationAction({
        message: 'Failed to get category',
        type: 'error',
      });
    }
  }

  async update(uuid: string, data: IGenericObject) {
    try {
      const response = await super.patch(`product-category/${uuid}`, data);

      setNotificationAction({
        message: 'Updated successfully',
        type: 'success',
      });

      return response;
    } catch (e) {
      setNotificationAction({
        message: 'Failed to update category',
        type: 'error',
      });
    }
  }

  async store(data: IGenericObject) {
    try {
      const response = await super.post(`product-category`, data);

      setNotificationAction({
        message: 'Created successfully',
        type: 'success',
      });

      return response;
    } catch (e) {
      setNotificationAction({
        message: 'Failed to create category',
        type: 'error',
      });
    }
  }

  async deleteOne(uuid: string, deleteType: string) {
    try {
      const response = await super.delete(`product-category/${uuid}?deleteType=${deleteType}`);

      setNotificationAction({
        message: 'Deleted successfully',
        type: 'success',
      });

      return response;
    } catch (e) {
      setNotificationAction({
        message: 'Failed to delete category',
        type: 'error',
      });
    }
  }

  async updateTree(tree: IGenericObject) { }
}
