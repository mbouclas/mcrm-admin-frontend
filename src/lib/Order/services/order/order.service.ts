import { BaseHttpService } from "../../../Shared/base-http.service";
import type { IGenericObject } from "../../../Shared/models/generic";
import queryString from "query-string";
import { html } from "gridjs";

export class OrderService extends BaseHttpService {
  async activateRows(selectedIds: string[]) {
    // return await super.post('/product/activate', { selectedIds });
    return true;
  }

  async activateRow(itemId: string) {
    // return await super.patch('/product/activate', { itemId });
    return true;
  }

  async de_activateRows(selectedIds: string[]) {
    // return await super.post('/product/de-activate', { selectedIds });
    return true;
  }

  async de_activateRow(itemId: string) {
    // return await super.patch('/product/de-activate', { itemId });
    return true;
  }

  async deleteRows(selectedIds: string[]) {
    // return await super.post('/product/delete', { selectedIds });
    return true;
  }

  async deleteRow(itemId: string) {
    return await super.delete(`order/${itemId}`);
  }

  getGridUrl(filters = {}) {
    return super.getGridUrl("order", filters, (res) => {
      return res.data.map((row) => {
        return [
          row.uuid,
          row.createdAt,
          row.orderId,
          row.user
            ? `${row.user.firstName} ${row.user.lastName}`
            : "No customer",
          row.status,
          row.paymentInfo ? row.paymentInfo.price : row.total,
          row.active,
        ];
      });
    });
  }

  async findOne(uuid: string, relationships: string[] = []) {
    const filters = relationships.length > 0 ? { with: relationships } : {};
    return await this.get(`order/${uuid}`, filters);
  }

  async find(filters: IGenericObject = {}, relationships: string[] = []) {
    let qs;
    if (Object.keys(filters).length > 0) {
      qs = queryString.stringify(filters);
    }

    return await this.get(`order${qs ? `?${qs}` : ""}`);
  }

  async update(id, data) {
    return await this.post(`order/${id}`, data);
  }

  async store(data: IGenericObject) {
    return super.post("order/basic", data);
  }
}
