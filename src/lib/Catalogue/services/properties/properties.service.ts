import { BaseHttpService } from "../../../Shared/base-http.service";
import type { IGenericObject } from "../../../Shared/models/generic";
import queryString from "query-string";
import { html } from "gridjs";

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
    return await super.delete(`property/${itemId}`);
  }

  getGridUrl(filters = {}) {
    return super.getGridUrl("property", filters, (res) => {
      return res.data.map((row) => [
        row.uuid,
        html(`<a href='${row.uuid}'>${row.title}</a>`),
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

    return await this.get(`property${qs ? `?${qs}` : ""}`);
  }

  async update(id: string, data: IGenericObject) {
    return await this.post(`property/${id}`, data);
  }

  async store(data: IGenericObject) {
    return super.post("property/basic", data);
  }
}
