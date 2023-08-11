import { BaseHttpService } from '../../../Shared/base-http.service';
import type { IGenericObject } from '../../../Shared/models/generic';
import queryString from 'query-string';
import { setNotificationAction } from '../../../stores';
import { z } from 'zod';
import errors from '../../../helpers/errors';
import { validateClientData, convertServerErrorToRequestError, type ServerError } from '../../../helpers/helperErrors';

const userSchema = z.object({
  email: z.string().min(1, errors['400.21']).email(errors['400.21']),
  firstName: z.string().min(1, errors['400.22']),
  lastName: z.string().min(1, errors['400.23']),
  password: z.string().min(1, errors['400.24']),
});

export class UserService extends BaseHttpService {
  async create(data) {
    validateClientData(userSchema, data);
    try {
      const res = await super.post(`user/create`, data);
      setNotificationAction({
        message: 'Created successfully',
        type: 'success',
      });
      return res;
    } catch (err) {
      setNotificationAction({
        message: 'Failed to create user',
        type: 'error',
      });
      throw err;
    }
  }

  async delete(userId: string) {
    try {
      const res = await super.delete(`user/${userId}`);
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

  async changePassword(userId: string, password: string) {
    try {
      const res = await super.post(`user/${userId}/change-password`, {
        password,
      });
      setNotificationAction({
        message: 'Password changed successfully',
        type: 'success',
      });
      return res;
    } catch (err) {
      setNotificationAction({
        message: 'Failed to change password',
        type: 'error',
      });
    }
  }

  getGridUrl(filters = {}) {
    return super.getGridUrl('user', filters, (res) => {
      return res.data.map((row) => {
        return [row.uuid, row.createdAt, row.firstName, row.lastName, row.email, row.active];
      });
    });
  }

  async findOne(uuid: string, relationships: string[] = []) {
    const filters = relationships.length > 0 ? { with: relationships } : {};
    return await this.get(`user/${uuid}`, filters);
  }

  async find(filters: IGenericObject = {}, relationships: string[] = []) {
    let qs;
    if (Object.keys(filters).length > 0) {
      qs = queryString.stringify(filters);
    }

    if (relationships.length > 0) {
      qs = qs ? `${qs}&with[]=${relationships.join(',')}` : `with[]=${relationships.join(',')}`;
    }

    return await this.get(`user${qs ? `?${qs}` : ''}`);
  }

  async update(id, data) {
    try {
      const res = await this.patch(`user/${id}`, data);
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
      const res = super.post('user/basic', data);
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
