import { BaseHttpService } from '../../../Shared/base-http.service';
import type { IGenericObject } from '../../../Shared/models/generic';
import queryString from 'query-string';
import { html } from 'gridjs';

export class PagesService extends BaseHttpService {
  async activateRows(selectedIds: string[]) {
    // return await super.post('/page/activate', { selectedIds });
    return true;
  }

  async activateRow(itemId: string) {
    // return await super.patch('/page/activate', { itemId });
    return true;
  }

  async de_activateRows(selectedIds: string[]) {
    // return await super.post('/page/de-activate', { selectedIds });
    return true;
  }

  async de_activateRow(itemId: string) {
    // return await super.patch('/page/de-activate', { itemId });
    return true;
  }

  async deleteRows(selectedIds: string[]) {
    // return await super.post('/page/delete', { selectedIds });
    return true;
  }

  async deleteRow(itemId: string) {
    return await super.delete(`page/${itemId}`, {
      successMessage: 'Deleted successfully',
      errorMessage: 'Failed to delete',
    });
  }

  getGridUrl(filters = {}) {
    return super.getGridUrl('page', filters, (res) => {
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
    return await this.get(`page/${uuid}`, filters);
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

    return await this.get(`page${qs ? `?${qs}` : ''}`);
  }

  async update(id: string, data: IGenericObject) {
    return await this.patch(`page/${id}`, data, {
      successMessage: 'Updated successfully',
      errorMessage: 'Failed to update',
    });
  }

  async store(data: IGenericObject) {
    return await super.post('page/basic', data, {
      successMessage: 'Created successfully',
      errorMessage: 'Failed to create',
    });
  }

  async generateVariants(pageId: string, data) {
    return await super.post(`page/${pageId}/generate-variants`, data, {
      successMessage: 'Created successfully',
      errorMessage: 'Failed to create',
    });
  }

  async checkDuplicateVariants(pageId: string, data) {
    const propertyValues = data.propertyValues.map((val) => `propertyValues[]=${encodeURIComponent(val)}`).join('&');

    return await super.get(
      `page/${pageId}/check-duplicate-variants?${propertyValues}`,
      {},
      {
        errorMessage: 'Failed to check duplicate',
      },
    );
  }

  async savePageCategories(pageId: string, categories: IGenericObject[]) {
    const res = await super.patch(`page/${pageId}/pageCategories`, categories);
  }

  async relate(sourceUuid: string, destinationUuids: string[], type: string) {
    const successMessage = type === 'relate' ? 'Related successfully' : 'Unrelated successfully';
    const errorMessage = type !== 'relate' ? 'Failed to relate' : 'Failed to unrelate';

    const res = await super.post(
      `page/manage-relate`,
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
