import { BaseHttpService } from '../../../Shared/base-http.service';
import type { IGenericObject } from '../../../Shared/models/generic';
import queryString from 'query-string';
import { html } from 'gridjs';
import { z } from 'zod';
import errors from '../../../helpers/errors';

enum KindOptions {
  tax = 'tax',
  shipping = 'shipping',
  coupon = 'coupon',
}

enum TargetOptions {
  subtotal = 'subtotal',
  price = 'price',
  total = 'total',
  quantity = 'quantity',
  numberOfItems = 'numberOfItems',
  items = 'items',
}

const ruleSchema = z.object({
  name: z
    .string({
      required_error: errors['CONDITION.001'],
      invalid_type_error: errors['CONDITION.001'],
    })
    .min(1, errors['CONDITION.001']),
  field: z
    .string({
      required_error: errors['CONDITION.002'],
      invalid_type_error: errors['CONDITION.002'],
    })
    .min(1, errors['CONDITION.002']),

  operator: z

    .string({
      required_error: errors['CONDITION.002'],
      invalid_type_error: errors['CONDITION.002'],
    })
    .min(1, errors['CONDITION.002']),

  value: z

    .string({
      required_error: errors['CONDITION.002'],
      invalid_type_error: errors['CONDITION.002'],
    })
    .min(1, errors['CONDITION.002']),
});

const conditionSchema = z.object({
  title: z
    .string({
      required_error: errors['CONDITION.001'],
      invalid_type_error: errors['CONDITION.001'],
    })
    .min(1, errors['CONDITION.001']),
  value: z
    .string({
      required_error: errors['CONDITION.002'],
      invalid_type_error: errors['CONDITION.002'],
    })
    .min(1, errors['CONDITION.002']),
  type: z.nativeEnum(KindOptions),
  target: z.nativeEnum(TargetOptions),
  rules: z.array(ruleSchema).min(1, errors['CONDITION.002']),
});

export class ConditionsService extends BaseHttpService {
  async activateRows(selectedIds: string[]) {
    // return await super.post('/condition/activate', { selectedIds });
    return true;
  }

  async activateRow(itemId: string) {
    // return await super.patch('/condition/activate', { itemId });
    return true;
  }

  async de_activateRows(selectedIds: string[]) {
    // return await super.post('/condition/de-activate', { selectedIds });
    return true;
  }

  async de_activateRow(itemId: string) {
    // return await super.patch('/condition/de-activate', { itemId });
    return true;
  }

  async deleteRows(selectedIds: string[]) {
    // return await super.post('/condition/delete', { selectedIds });
    return true;
  }

  async deleteRow(itemId: string) {
    return await super.delete(`condition/${itemId}`, {
      successMessage: 'Deleted successfully',
      errorMessage: 'Failed to delete',
    });
  }

  getGridUrl(filters = {}) {
    return super.getGridUrl('condition', filters, (res) => {
      return res.data.map((row) => [
        row.uuid,
        html(`<a href='${row.uuid}'>${row.title}</a>`),
        row.sku,
        row.price,
        row.createdAt,
        row.updatedAt,
        row.active,
      ]);
    });
  }

  async findOne(uuid: string, relationships: string[] = []) {
    const filters = relationships.length > 0 ? { with: relationships } : {};
    return await this.get(`condition/${uuid}`, filters);
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

    return await this.get(`condition${qs ? `?${qs}` : ''}`);
  }

  async update(id: string, data: IGenericObject) {
    return await this.patch(`condition/${id}`, data, {
      successMessage: 'Updated successfully',
      errorMessage: 'Failed to update',
    });
  }

  async store(data: IGenericObject) {
    return await super.post(
      'condition',
      { ...data, active: true },
      {
        schema: conditionSchema,
        successMessage: 'Created successfully',
        errorMessage: 'Failed to create',
      },
    );
  }
}
