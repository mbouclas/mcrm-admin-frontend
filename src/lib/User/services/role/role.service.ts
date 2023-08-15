import { BaseHttpService } from '../../../Shared/base-http.service';
import type { IGenericObject } from '../../../Shared/models/generic';
import queryString from 'query-string';

export class RoleService extends BaseHttpService {
  async deleteRow(itemId: string) {
    return await super.delete(`role/${itemId}`, {
      successMessage: 'Deleted successfully',
      errorMessage: 'Failed to delete',
    });
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
    return await this.patch(`role/${id}`, data, {
      successMessage: 'Updated successfully',
      errorMessage: 'Failed to update',
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

  async store(data: IGenericObject) {
    return super.post('role/basic', data, {
      successMessage: 'Created successfully',
      errorMessage: 'Failed to create',
    });
  }
}
