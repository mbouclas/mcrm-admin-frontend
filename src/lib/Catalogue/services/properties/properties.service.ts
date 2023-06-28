import { BaseHttpService } from '../../../Shared/base-http.service';
import type { IGenericObject } from '../../../Shared/models/generic';
import queryString from 'query-string';
import { html } from 'gridjs';
import { setNotificationAction } from '../../../stores';

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
    try {
      const res = await super.delete(`property/${itemId}`);
      setNotificationAction({
        message: 'Deleted successfully',
        type: 'success',
      });
      return res;
    } catch (err) {
      setNotificationAction({
        message: 'Failed to delete',
        type: 'error',
      });
    }
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

  async update(id: string, data: IGenericObject) {
    try {
      const res = await this.patch(`property/${id}`, data);
      setNotificationAction({
        message: 'Updated successfully',
        type: 'success',
      });
      return res;
    } catch (err) {
      setNotificationAction({
        message: 'Failed to update',
        type: 'error',
      });
    }
  }

  async store(data: IGenericObject) {
    try {
      const res = await super.post('property', data);
      setNotificationAction({
        message: 'Created successfully',
        type: 'success',
      });
      return res;
    } catch (err) {
      setNotificationAction({
        message: 'Failed to create',
        type: 'error',
      });
    }
  }

  async storePropertyValue(data: IGenericObject) {
    try {
      const res = await super.post(`property/${data.uuid}/value`, data);
      setNotificationAction({
        message: 'Created successfully',
        type: 'success',
      });
      return res;
    } catch (err) {
      setNotificationAction({
        message: 'Failed to create',
        type: 'error',
      });
    }
  }

  async updatePropertyValue(data: IGenericObject) {
    try {
      const res = await super.patch(`property/${data.uuid}/value/${data.propertyValueUuid}`, data);
      setNotificationAction({
        message: 'Updated successfully',
        type: 'success',
      });
      return res;
    } catch (err) {
      setNotificationAction({
        message: 'Failed to create',
        type: 'error',
      });
    }
  }

  async deletePropertyValue(data: IGenericObject) {
    try {
      const res = await super.delete(`property/${data.uuid}/value/${data.propertyValueUuid}`);
      setNotificationAction({
        message: 'Deleted successfully',
        type: 'success',
      });
      return res;
    } catch (err) {
      setNotificationAction({
        message: 'Failed to create',
        type: 'error',
      });
    }
  }
}
