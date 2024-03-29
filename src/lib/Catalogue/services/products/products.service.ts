import { BaseHttpService } from '../../../Shared/base-http.service';
import type { IGenericObject } from '../../../Shared/models/generic';
import queryString from 'query-string';
import { html } from 'gridjs';
import { z } from 'zod';
import errors from '../../../helpers/errors';
import type {ProductModel} from "../../models/product.model";

export const productSchema = z.object({
  title: z
    .string({ required_error: errors['PRODUCT.010'], invalid_type_error: errors['PRODUCT.010'] })
    .min(1, errors['PRODUCT.010']),
  sku: z
    .string({ required_error: errors['PRODUCT.011'], invalid_type_error: errors['PRODUCT.011'] })
    .min(1, errors['PRODUCT.011']),
  price: z
    .number({ required_error: errors['PRODUCT.012'], invalid_type_error: errors['PRODUCT.012'] })
    .min(0.01, errors['PRODUCT.012']),
  description: z
    .string({ required_error: errors['PRODUCT.013'], invalid_type_error: errors['PRODUCT.013'] })
    .min(1, errors['PRODUCT.013']),
});

export class ProductsService extends BaseHttpService {
  async activateRows(selectedIds: string[]) {
    // return await super.post('/product/activate', { selectedIds });
    return true;
  }

  async activateRow(itemId: string) {
    // return await super.patch('/product/activate', { itemId });
    return true;
  }

  async de_activateRows(selectedIds: string[]) {
    // return await super.post('/product/de-activate', { selectedIds });
    return true;
  }

  async de_activateRow(itemId: string) {
    // return await super.patch('/product/de-activate', { itemId });
    return true;
  }

  async deleteRows(selectedIds: string[]) {
    // return await super.post('/product/delete', { selectedIds });
    return true;
  }

  async deleteRow(itemId: string) {
    return await super.delete(`product/${itemId}`, {
      successMessage: 'Deleted successfully',
      errorMessage: 'Failed to delete',
    });
  }

  getGridUrl(filters = {}) {
    return super.getGridUrl('product', filters, (res) => {
      return res.data.map((row) => [
        row.uuid,
        html(`<a href='${row.uuid}'>${row.title}</a>`),
        row.sku,
        row.price,
        row.createdAt,
        row.updatedAt,
        row.active,
      ]);
    });
  }

  async findOne(uuid: string, relationships: string[] = []) {
    const filters = relationships.length > 0 ? { with: relationships } : {};
    return await this.get(`product/${uuid}`, filters);
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

    return await this.get(`product${qs ? `?${qs}` : ''}`);
  }

  async update(id: string, data: IGenericObject) {
    return await this.patch(`product/${id}`, data, {
      successMessage: 'Updated successfully',
      errorMessage: 'Failed to update',
      schema: productSchema,
    });
  }

  async store(data: ProductModel) {
    return await super.post(
      'product',
      data,
      {
        successMessage: 'Created successfully',
        errorMessage: 'Failed to create',
      },
    );
  }

  async generateVariants(productId: string, data) {
    return await super.post(`product/${productId}/generate-variants`, data, {
      successMessage: 'Created successfully',
      errorMessage: 'Failed to create',
    });
  }

  async checkDuplicateVariants(productId: string, data) {
    const propertyValues = data.propertyValues.map((val) => `propertyValues[]=${encodeURIComponent(val)}`).join('&');

    return await super.get(
      `product/${productId}/check-duplicate-variants?${propertyValues}`,
      {},
      {
        errorMessage: 'Failed to check duplicate',
      },
    );
  }

  async saveProductCategories(productId: string, categories: IGenericObject[]) {
    return await super.patch(`product/${productId}/productCategories`, categories, {
      successMessage: 'Updated successfully',
    });
  }

  async relate(sourceUuid: string, destinationUuids: string[], type: string) {
    const successMessage = type === 'relate' ? 'Related successfully' : 'Unrelated successfully';
    const errorMessage = type !== 'relate' ? 'Failed to relate' : 'Failed to unrelate';

    const res = await super.post(
      `product/manage-relate`,
      {
        sourceUuid,
        destinationUuids,
        type,
      },
      { successMessage, errorMessage },
    );

    return res;
  }

  async manageCartCondition(sourceUuid: string, destinationUuid: string, type: string) {
    const successMessage =
      type === 'attachCondition' ? 'Cart condition attached successfully' : 'Cart condition unattached successfully';
    const errorMessage =
      type !== 'attachCondition' ? 'Cart condition failed to attach' : 'Cart condition failed to unattach';

    const res = await super.post(
      `product/manage-cart-condition`,
      {
        sourceUuid,
        destinationUuid,
        type,
      },
      { successMessage, errorMessage },
    );

    return res;
  }

  async getProductIdsFromFilters(filters: IGenericObject = {}, limit = 12) {
    let qs;

    const temp = Object.assign({}, filters);
    temp['limit'] = limit;
    if (Object.keys(temp).length > 0) {
      qs = queryString.stringify(temp);
    }

    return await this.get(`product/ids${qs ? `?${qs}` : ''}`);
  }

  async bulkUpdate(records: IGenericObject) {
    return await super.patch(`product/bulk/update`, {records}, {
        successMessage: 'Updated successfully',
    });
  }

  async bulkUpdateRelationships(records: IGenericObject, type: 'category'| 'sales-channel') {
    return await super.patch(`product/bulk/${type}`, records, {
        successMessage: 'Updated successfully',
    });
  }
}
