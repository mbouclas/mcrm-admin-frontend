import { BaseHttpService } from '../../../Shared/base-http.service';
import type { IGenericObject } from '../../../Shared/models/generic';
import queryString from 'query-string';
import { z } from 'zod';
import errors from '../../../helpers/errors';

const roleSchema = z.object({
  name: z.string().min(1, errors['400.56']),
  level: z.number().min(1, errors['400.55']).max(99, errors['400.55']),
  description: z.string().min(1, errors['400.57']),
});

export class RoleService extends BaseHttpService {
  async deleteRow(itemId: string) {
    return await super.delete(`role/${itemId}`, {
      successMessage: 'Deleted successfully',
      errorMessage: 'Failed to delete',
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
    return await this.patch(`role/${id}`, data, {
      successMessage: 'Updated successfully',
      errorMessage: 'Failed to update',
      schema: roleSchema,
    });
  }

  async create(data) {
    return await this.post(`role`, data, {
      schema: roleSchema,
      successMessage: 'Created successfully',
      errorMessage: 'Failed to create',
    });
  }

  async manageRole(userUuid, roleUuid, type) {
    return await this.post(
      `user/${userUuid}/manage-role`,
      { roleUuid, type },
      {
        successMessage: 'Updated successfully',
        errorMessage: 'Failed to update',
      },
    );
  }
}
