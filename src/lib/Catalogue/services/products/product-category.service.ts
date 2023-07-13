import { BaseHttpService } from '../../../Shared/base-http.service';
import type { IGenericObject } from '../../../Shared/models/generic';

export class ProductCategoryService extends BaseHttpService {
  async tree() {
    return await this.get(`product-category/tree`);
  }

  async move(uuid: string, newParentUuid?: string) {
    const body = newParentUuid ? { newParentUuid } : {};

    console.log(uuid, body);
    return await this.patch(`product-category/${uuid}/move`, body);
  }

  async findOne(uuid: string) {}

  async update(uuid: string, data: IGenericObject) {}

  async store(data: IGenericObject) {}

  async delete(uuid: string) {}

  async updateTree(tree: IGenericObject) {}
}
