import { BaseHttpService } from '../../../Shared/base-http.service';
import type { IGenericObject } from '../../../Shared/models/generic';
import queryString from 'query-string';
import type {AddressModel} from "../../../Order/Order/models/address.model";
import type {UserModel} from "../../../User/User/models/user.model";

export class CustomerService extends BaseHttpService {
  async deleteRow(itemId: string) {
    return await super.delete(`customer/${itemId}`, {
      successMessage: 'Deleted successfully',
      errorMessage: 'Failed to delete',
    });
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
    return await this.patch(`customer/${id}`, data, {
      successMessage: 'Updated successfully',
      errorMessage: 'Failed to update',
    });
  }

  async store(data: IGenericObject) {
    return await super.post('customer/basic', data, {
      successMessage: 'Created successfully',
      errorMessage: 'Failed to create',
    });
  }

  async syncAddress(data: {type: 'BILLING'|'SHIPPING', userId: string, address: AddressModel}) {
    return await super.post('customer/address/sync', data, {
      successMessage: 'Address created successfully',
      errorMessage: 'Failed to create',
    });
  }

  async createCustomer(user: Partial<UserModel>) {
    return await super.post('customer/create', {user}, {
      successMessage: 'Customer created successfully',
      errorMessage: 'Failed to create',
    });
  }

  async assignUserToGroups(userId: string, groups: string[]) {
    return await super.post(`customer/${userId}/user-group`, groups, {
      successMessage: 'Groups assigned successfully',
      errorMessage: 'Failed to assign',
    });

  }
}
