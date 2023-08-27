import { BaseHttpService } from '../../../Shared/base-http.service';
import type { IGenericObject } from '../../../Shared/models/generic';
import queryString from 'query-string';
import { setNotificationAction } from '../../../stores';

export class CustomerService extends BaseHttpService {
  async deleteRow(itemId: string) {
    try {
      const res = await super.delete(`customer/${itemId}`);
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
    return super.getGridUrl('customer', filters, (res) => {
      return res.data.map((row) => {
        return [row.uuid, row.createdAt, row.firstName, row.lastName, row.email, row.active];
      });
    });
  }

  async findOne(uuid: string, relationships: string[] = []) {
    const filters = relationships.length > 0 ? { with: relationships } : {};
    return await this.get(`customer/${uuid}`, filters);
  }

  async find(filters: IGenericObject = {}, relationships: string[] = []) {
    let qs;
    if (Object.keys(filters).length > 0) {
      qs = queryString.stringify(filters);
    }

    if (relationships.length > 0) {
      qs = qs ? `${qs}&with[]=${relationships.join(',')}` : `with[]=${relationships.join(',')}`;
    }

    return await this.get(`customer${qs ? `?${qs}` : ''}`);
  }

  async update(id, data) {
    try {
      const res = await this.patch(`customer/${id}`, data);
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
      const res = super.post('customer/basic', data);
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
}
