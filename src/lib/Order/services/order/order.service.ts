import { BaseHttpService } from "../../../Shared/base-http.service";
import type { IGenericObject } from "../../../Shared/models/generic";
import queryString from "query-string";
import { html } from "gridjs";
import { setNotificationAction } from "../../../stores";

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
    try {
      const res = await super.delete(`order/${itemId}`);
      setNotificationAction({
        message: "Deleted successfully",
        type: "success",
      });
      return res;
    } catch (err) {
      setNotificationAction({
        message: "Failed to delete",
        type: "error",
      });
    }
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

    if (relationships.length > 0) {
        qs = qs ? `${qs}&${relationships.map(r => `with[]=${r}`).join('&')}` : relationships.map(r => `with[]=${r}`).join('&');
    }

    return await this.get(`order${qs ? `?${qs}` : ""}`);
  }

  async update(id, data) {
    try {
      const res = await this.patch(`order/${id}`, data);
      setNotificationAction({
        message: "Updated successfully",
        type: "success",
      });
      return res;
    } catch (err) {
      setNotificationAction({
        message: "Failed to update",
        type: "error",
      });
    }
  }

  async store(data: IGenericObject) {
    try {
      const res = super.post("order/basic", data);
      setNotificationAction({
        message: "Created successfully",
        type: "success",
      });
      return res;
    } catch (err) {
      setNotificationAction({
        message: "Failed to create",
        type: "error",
      });
    }
  }

  async updateOrderStatus(uuid: string, status: number) {
    try {
      const res = super.patch(`order/${uuid}/status`, { status });
      setNotificationAction({
        message: "Order status updated successfully",
        type: "success",
      });
      return res;
    } catch (err) {
      setNotificationAction({
        message: "Failed to update",
        type: "error",
      });
    }
  }
}
