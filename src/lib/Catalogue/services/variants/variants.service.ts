import { BaseHttpService } from '../../../Shared/base-http.service';
import type { IGenericObject } from '../../../Shared/models/generic';
import queryString from 'query-string';
import { html } from 'gridjs';
import {z} from "zod";
import errors from "../../../helpers/errors";
import {setNotificationAction} from "../../../stores";

export const basicVariantsSchema = z.object({
  name: z
      .string({ required_error: errors['PRODUCT.010'], invalid_type_error: errors['PRODUCT.010'] })
      .min(1, errors['PRODUCT.010']),
  sku: z
      .string({ required_error: errors['PRODUCT.011'], invalid_type_error: errors['PRODUCT.011'] })
      .min(1, errors['PRODUCT.011']),
  variantId: z
      .string({ required_error: 'VariantID is required', invalid_type_error: errors['PRODUCT.011'] })
      .min(1, errors['PRODUCT.011']),
  price: z
      .number({ required_error: errors['PRODUCT.012'], invalid_type_error: errors['PRODUCT.012'] })
      .min(0.01, errors['PRODUCT.012']),
});

export class VariantsService extends BaseHttpService {
  messageAfterRequest = true;
  async activateRows(selectedIds: string[]) {
    // return await super.post('/variant/activate', { selectedIds });
    return true;
  }

  async activateRow(itemId: string) {
    // return await super.patch('/variant/activate', { itemId });
    return true;
  }

  async de_activateRows(selectedIds: string[]) {
    // return await super.post('/variant/de-activate', { selectedIds });
    return true;
  }

  async de_activateRow(itemId: string) {
    // return await super.patch('/variant/de-activate', { itemId });
    return true;
  }

  async deleteRows(selectedIds: string[]) {
    // return await super.post('/variant/delete', { selectedIds });
    return true;
  }

  async deleteRow(itemId: string) {
    return await super.delete(`product-variant/${itemId}`, {
      successMessage: 'Created successfully',
      errorMessage: 'Failed to create',
    });
  }

  getGridUrl(filters = {}) {
    return super.getGridUrl('product-variant', filters, (res) => {
      return res.data.map((row) => [
        row.uuid,
        html(`<a href='${row.uuid}'>${row.title}</a>`),
        row.variantValue,
        row.description,
        row.createdAt,
        row.updatedAt,
        row.active,
      ]);
    });
  }

  async findOne(uuid: string, relationships: string[] = []) {
    const filters = relationships.length > 0 ? { with: relationships } : {};
    return await this.get(`product-variant/${uuid}`, filters);
  }

  async find(filters: IGenericObject = {}, relationships: string[] = []) {
    let qs;
    if (Object.keys(filters).length > 0) {
      qs = queryString.stringify(filters);
    }

    if (relationships.length > 0) {
      qs = qs
          ? `${qs}&${relationships.map((r) => `with[]=${r}`).join('&')}`
          : relationships.map((r) => `with[]=${r}`).join('&');
    }


    return await this.get(`product-variant${qs ? `?${qs}` : ''}`);
  }

  async update(id: string, data: IGenericObject) {
    return await this.patch(`product-variant/${id}`, data, {
      successMessage: 'Updated successfully',
        errorMessage: 'Failed to update',
    });
  }

  async store(data: IGenericObject) {
    return await super.post('product-variant', data, {
      successMessage: 'Created successfully',
      errorMessage: 'Failed to create',
    });
  }

  async delete(uuid: string) {
    const options = (this.messageAfterRequest) ? {
      successMessage: 'Created successfully',
      errorMessage: 'Failed to create',
    } : {};

    return await super.delete(`product-variant/${uuid}`, options);
  }

  async deleteMany(uuids: string[]) {
    this.messageAfterRequest = false;
    for (const uuid of uuids) {
      await this.delete(uuid);
    }

    setNotificationAction({
      message: `Deleted ${uuids.length} variants`,
      type: 'success',
    });
  }
}
