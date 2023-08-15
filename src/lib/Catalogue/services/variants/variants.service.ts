import { BaseHttpService } from '../../../Shared/base-http.service';
import type { IGenericObject } from '../../../Shared/models/generic';
import queryString from 'query-string';
import { html } from 'gridjs';

export class VariantsService extends BaseHttpService {
  async activateRows(selectedIds: string[]) {
    // return await super.post('/variant/activate', { selectedIds });
    return true;
  }

  async activateRow(itemId: string) {
    // return await super.patch('/variant/activate', { itemId });
    return true;
  }

  async de_activateRows(selectedIds: string[]) {
    // return await super.post('/variant/de-activate', { selectedIds });
    return true;
  }

  async de_activateRow(itemId: string) {
    // return await super.patch('/variant/de-activate', { itemId });
    return true;
  }

  async deleteRows(selectedIds: string[]) {
    // return await super.post('/variant/delete', { selectedIds });
    return true;
  }

  async deleteRow(itemId: string) {
    return await super.delete(`product-variant/${itemId}`, {
      successMessage: 'Created successfully',
      errorMessage: 'Failed to create',
    });
  }

  getGridUrl(filters = {}) {
    return super.getGridUrl('product-variant', filters, (res) => {
      return res.data.map((row) => [
        row.uuid,
        html(`<a href='${row.uuid}'>${row.title}</a>`),
        row.variantValue,
        row.description,
        row.createdAt,
        row.updatedAt,
        row.active,
      ]);
    });
  }

  async findOne(uuid: string, relationships: string[] = []) {
    const filters = relationships.length > 0 ? { with: relationships } : {};
    return await this.get(`product-variant/${uuid}`, filters);
  }

  async find(filters: IGenericObject = {}) {
    let qs;
    if (Object.keys(filters).length > 0) {
      qs = queryString.stringify(filters);
    }

    return await this.get(`product-variant${qs ? `?${qs}` : ''}`);
  }

  async update(id: string, data: IGenericObject) {
    return await this.patch(`product-variant/${id}`, data);
  }

  async store(data: IGenericObject) {
    return await super.post('product-variant', data, {
      successMessage: 'Created successfully',
      errorMessage: 'Failed to create',
    });
  }
}
