import { BaseHttpService } from '../../../Shared/base-http.service';
import type { IGenericObject } from '../../../Shared/models/generic';
import queryString from 'query-string';
import { html } from 'gridjs';

export class ImportTemplatesService extends BaseHttpService {
  async activateRows(selectedIds: string[]) {
    // return await super.post('/import-template/activate', { selectedIds });
    return true;
  }

  async activateRow(itemId: string) {
    // return await super.patch('/import-template/activate', { itemId });
    return true;
  }

  async de_activateRows(selectedIds: string[]) {
    // return await super.post('/import-template/de-activate', { selectedIds });
    return true;
  }

  async de_activateRow(itemId: string) {
    // return await super.patch('/import-template/de-activate', { itemId });
    return true;
  }

  async deleteRows(selectedIds: string[]) {
    // return await super.post('/import-template/delete', { selectedIds });
    return true;
  }

  async deleteRow(itemId: string) {
    return await super.delete(`import-template/${itemId}`, {
      successMessage: 'Deleted successfully',
      errorMessage: 'Failed to delete',
    });
  }

  getGridUrl(filters = {}) {
    return super.getGridUrl('import-template', filters, (res) => {
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
    return await this.get(`import-template/${uuid}`, filters);
  }

  async find(filters: IGenericObject = {}, relationships: string[] = [], mixed = false) {
    let qs;
    if (Object.keys(filters).length > 0) {
      qs = queryString.stringify(filters);
    }

    if (relationships.length > 0) {
      qs = qs
        ? `${qs}&${relationships.map((r) => `with[]=${r}`).join('&')}`
        : relationships.map((r) => `with[]=${r}`).join('&');
    }

    if (mixed) {
        qs = qs ? `${qs}&mixed=${mixed}` : `mixed=${mixed}`;
    }

    return await this.get(`import-template${qs ? `?${qs}` : ''}`);
  }

  async update(id: string, data: IGenericObject) {
    return await this.patch(`import-template/${id}`, data, {
      successMessage: 'Updated successfully',
      errorMessage: 'Failed to update',
    });
  }

  async store(data: IGenericObject) {
    return await super.post(
      'import-template',
      { ...data, active: true },
      {
        successMessage: 'Created successfully',
        errorMessage: 'Failed to create',
      },
    );
  }
}
