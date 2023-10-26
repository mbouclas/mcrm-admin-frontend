import { BaseHttpService } from '../../../Shared/base-http.service';
import type { IGenericObject } from '../../../Shared/models/generic';
import queryString from 'query-string';
import { html } from 'gridjs';

export class PropertiesService extends BaseHttpService {
  async activateRows(selectedIds: string[]) {
    // return await super.post('/property/activate', { selectedIds });
    return true;
  }

  async activateRow(itemId: string) {
    // return await super.patch('/property/activate', { itemId });
    return true;
  }

  async de_activateRows(selectedIds: string[]) {
    // return await super.post('/property/de-activate', { selectedIds });
    return true;
  }

  async de_activateRow(itemId: string) {
    // return await super.patch('/property/de-activate', { itemId });
    return true;
  }

  async deleteRows(selectedIds: string[]) {
    // return await super.post('/property/delete', { selectedIds });
    return true;
  }

  async deleteRow(itemId: string) {
    return await super.delete(`property/${itemId}`, {
      successMessage: 'Deleted successfully',
      errorMessage: 'Failed to delete',
    });
  }

  getGridUrl(filters = {}) {
    return super.getGridUrl('property', filters, (res) => {
      return res.data.map((row) => [
        row.uuid,
        html(`<a href='${row.uuid}'>${row.title}</a>`),
        row.propertyValue,
        row.description,
        row.createdAt,
        row.updatedAt,
        row.active,
      ]);
    });
  }

  async findOne(uuid: string, relationships: string[] = []) {
    const filters = relationships.length > 0 ? { with: relationships } : {};
    return await this.get(`property/${uuid}`, filters);
  }

  async find(filters: IGenericObject = {}) {
    let qs;
    if (Object.keys(filters).length > 0) {
      qs = queryString.stringify(filters);
    }

    return await this.get(`property${qs ? `?${qs}` : ''}`);
  }

  async findValueByVariantId(id: string) {
    return await this.get(`property/variant/${id}`);
  }

  async searchValues(q: string, relationships: string[] = []) {
    const filters = relationships?.length > 0 ? { with: relationships } : {};

    return await this.get(`property/value/search?q=${q}`, filters);
  }

  async findValues(filters: IGenericObject = {}, relationships: string[] = []) {
    let qs;
    if (Object.keys(filters).length > 0) {
      qs = queryString.stringify(filters);
    }

    if (relationships.length > 0) {
      qs = qs ? `${qs}&with[]=${relationships.join(',')}` : `with[]=${relationships.join(',')}`;
    }

    return await this.get(`property/value${qs ? `?${qs}` : ''}`);
  }

  async update(id: string, data: IGenericObject) {
    return await this.patch(`property/${id}`, data, {
      successMessage: 'Updated successfully',
      errorMessage: 'Failed to update',
    });
  }

  async store(data: IGenericObject) {
    return await super.post(
      'property',
      { ...data, active: true },
      {
        successMessage: 'Created successfully',
        errorMessage: 'Failed to created',
      },
    );
  }

  async storePropertyValue(data: IGenericObject) {
    return await super.post(`property/${data.uuid}/value`, data, {
      successMessage: 'Created successfully',
      errorMessage: 'Failed to create',
    });
  }

  async updatePropertyValue(data: IGenericObject) {
    return await super.patch(`property/${data.uuid}/value/${data.propertyValueUuid}`, data, {
      successMessage: 'Updated successfully',
      errorMessage: 'Failed to create',
    });
  }

  async deletePropertyValue(data: IGenericObject) {
    return await super.delete(`property/${data.uuid}/value/${data.propertyValueUuid}`, {
      successMessage: 'Deleted successfully',
      errorMessage: 'Failed to create',
    });
  }
}
