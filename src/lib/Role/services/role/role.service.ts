import { BaseHttpService } from '../../../Shared/base-http.service';
import type { IGenericObject } from '../../../Shared/models/generic';
import queryString from 'query-string';
import { html } from 'gridjs';
import { setNotificationAction } from '../../../stores';

import { z } from 'zod';
import errors from '../../../helpers/errors';
import { validateClientData } from '../../../helpers/helperErrors';

const roleSchema = z.object({
  name: z.string().min(1, errors['400.56']),
  level: z.number().min(1, errors['400.55']).max(99, errors['400.55']),
  description: z.string().min(1, errors['400.57']),
});

export class RoleService extends BaseHttpService {
  async deleteRow(itemId: string) {
    try {
      const res = await super.delete(`role/${itemId}`);
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
    return super.getGridUrl('role', filters, (res) => {
      return res.data.map((row) => {
        return [row.uuid, row.createdAt, row.firstName, row.lastName, row.email, row.active];
      });
    });
  }

  async findOne(uuid: string, relationships: string[] = []) {
    const filters = relationships.length > 0 ? { with: relationships } : {};
    return await this.get(`role/${uuid}`, filters);
  }

  async find(filters: IGenericObject = {}, relationships: string[] = []) {
    let qs;
    if (Object.keys(filters).length > 0) {
      qs = queryString.stringify(filters);
    }

    if (relationships.length > 0) {
      qs = qs ? `${qs}&with[]=${relationships.join(',')}` : `with[]=${relationships.join(',')}`;
    }

    return await this.get(`role${qs ? `?${qs}` : ''}`);
  }

  async update(id, data) {
    try {
      const res = await this.patch(`role/${id}`, data);
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

  async create(data) {
    validateClientData(roleSchema, data);

    try {
      const res = await this.post(`role`, data);
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

  async manageRole(userUuid, roleUuid, type) {
    try {
      const res = await this.post(`user/${userUuid}/manage-role`, { roleUuid, type });
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
}
