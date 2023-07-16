import { BaseHttpService } from '../../../Shared/base-http.service';
import type { IGenericObject } from '../../../Shared/models/generic';

export class ProductCategoryService extends BaseHttpService {
  async tree() {
    return await this.get(`product-category/tree`);
  }

  async move(uuid: string, newParentUuid?: string) {
    const body = newParentUuid ? { newParentUuid } : {};

    return await this.patch(`product-category/${uuid}/move`, body);
  }

  async findOne(uuid: string) { }

  async update(uuid: string, data: IGenericObject) { }

  async store(data: IGenericObject) {
    return await super.post(`product-category`, data);
  }

  async deleteOne(uuid: string, deleteType: string) {
    return await super.delete(`product-category/${uuid}?deleteType=${deleteType}`);
  }

  async updateTree(tree: IGenericObject) { }
}
