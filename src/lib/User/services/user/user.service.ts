import { BaseHttpService } from '../../../Shared/base-http.service';
import type { IGenericObject } from '../../../Shared/models/generic';
import queryString from 'query-string';
import { z } from 'zod';
import errors from '../../../helpers/errors';

const userSchema = z.object({
  email: z.string().min(1, errors['400.21']).email(errors['400.21']),
  firstName: z.string().min(1, errors['400.22']),
  lastName: z.string().min(1, errors['400.23']),
  password: z.string().min(1, errors['400.24']),
});

export class UserService extends BaseHttpService {
  async create(data) {
    return await super.post(`user/create`, data, {
      successMessage: 'Created successfully',
      errorMessage: 'Failed to create user',
      schema: userSchema,
    });
  }

  async delete(userId: string) {
    return await super.delete(`user/${userId}`, {
      successMessage: 'Deleted successfully',
      errorMessage: 'Failed to delete',
    });
  }

  async changePassword(userId: string, password: string) {
    return await super.post(
      `user/${userId}/change-password`,
      {
        password,
      },
      {
        successMessage: 'Password changed successfully',
        errorMessage: 'Failed to change password',
      },
    );
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
      qs = queryString.stringify(filters, { arrayFormat: 'bracket'});
    }

    if (relationships.length > 0) {
      qs = qs ? `${qs}&with[]=${relationships.join(',')}` : `with[]=${relationships.join(',')}`;
    }

    return await this.get(`user${qs ? `?${qs}` : ''}`);
  }

  async update(id, data) {
    return await this.patch(`user/${id}`, data, {
      successMessage: 'Updated successfully',
      errorMessage: 'Failed to update',
    });
  }

  async store(data: IGenericObject) {
    return await super.post('user/basic', data, {
      successMessage: 'Created successfully',
      errorMessage: 'Failed to create',
    });
  }
}
