import type { IItemSelectorConfig } from '../DynamicFields/types';

export const userItemSelectorConfig: IItemSelectorConfig = {
  apiUrl: 'user',
  module: 'User',
  labels: [
    {
      field: 'lastName.firstName',
      label: 'Name',
    },
    {
      field: 'email',
      label: 'Email',
    },
    {
      field: 'active',
      label: 'Active',
      type: 'boolean',
    },
  ],
};

export const customerItemSelectorConfig: IItemSelectorConfig = {
  apiUrl: 'user',
  module: 'User',
  filters: {
    isCustomer: true,
  },
  labels: [
    {
      field: 'lastName.firstName',
      label: 'Name',
    },
    {
      field: 'email',
      label: 'Email',
    },
    {
      field: 'active',
      label: 'Active',
      type: 'boolean',
    },
  ],
};

export const productItemSelectorConfig: IItemSelectorConfig = {
  apiUrl: 'product',
  module: 'Product',
  labels: [
    {
      field: 'title',
      label: 'Title',
    },
    {
      field: 'sku',
      label: 'SKU',
    },
    {
      field: 'price',
      label: 'Price',
      type: 'money',
    },
    {
      field: 'active',
      label: 'Active',
      type: 'boolean',
    },
  ],
};

export const propertyItemSelectorConfig: IItemSelectorConfig = {
  apiUrl: 'property',
  module: 'Property',
  labels: [
    {
      field: 'title',
      label: 'Title',
    },
    {
      field: 'description',
      label: 'Description',
    },
    {
      field: 'active',
      label: 'Active',
      type: 'boolean',
    },
    {
      field: 'actions',
      label: 'Actions',
    },
  ],
};

/**
 * <ItemSelector selectMode="single" config={productCategoryItemSelectorConfig}
 *               on:select={(e) => {
 *                   console.log(e.detail);
 *               }} />
 */
export const productCategoryItemSelectorConfig: IItemSelectorConfig = {
  apiUrl: 'product-category/tree',
  module: 'ProductCategory',
  labelField: 'title',
  filter: 'local',
  isTree: true,
  labels: [
    {
      field: 'title',
      label: 'Title',
    },
    {
      field: 'active',
      label: 'Active',
      type: 'boolean',
    },
  ],
};

export const pageCategoryItemSelectorConfig: IItemSelectorConfig = {
  apiUrl: 'page-category/tree',
  module: 'PageCategory',
  labelField: 'title',
  filter: 'local',
  isTree: true,
  labels: [
    {
      field: 'title',
      label: 'Title',
    },
    {
      field: 'active',
      label: 'Active',
      type: 'boolean',
    },
  ],
};

export const manufacturerItemSelectorConfig: IItemSelectorConfig = {
  apiUrl: 'manufacturer',
  module: 'Manufacturer',
  labels: [
    {
      field: 'title',
      label: 'Title',
    },
    {
      field: 'active',
      label: 'Active',
      type: 'boolean',
    },
  ],
};

export const pageItemSelectorConfig: IItemSelectorConfig = {
  apiUrl: 'page',
  module: 'Page',
  labels: [
    {
      field: 'title',
      label: 'Title',
    },
    {
      field: 'active',
      label: 'Active',
      type: 'boolean',
    },
  ],
};

export const conditionItemSelectorConfig: IItemSelectorConfig = {
  apiUrl: 'condition',
  module: 'Condition',
  filters: {
    target: 'item',
  },
  labels: [
    {
      field: 'title',
      label: 'Title',
    },
    {
      field: 'type',
      label: 'Type',
    },
    {
      field: 'target',
      label: 'Target',
    },
    {
      field: 'value',
      label: 'Value',
    },
  ],
};

export const shippingMethodItemSelectorConfig: IItemSelectorConfig = {
  apiUrl: 'shipping-method',
  module: 'ShippingMethod',
  labels: [
    {
      field: 'title',
      label: 'Title',
    },

    {
      field: 'shippingTime',
      label: 'Shipping Time',
    },
  ],
};

export const paymentMethodItemSelectorConfig: IItemSelectorConfig = {
  apiUrl: 'payment-method',
  module: 'PaymentMethod',
  labels: [
    {
      field: 'title',
      label: 'Title',
    },
  ],
};

export const addressItemSelectorConfig = (userId): IItemSelectorConfig => {
  return {
    apiUrl: 'address',
    filters: {
      userId,
    },
    module: 'Address',
    labels: [
      {
        field: 'country',
        label: 'Country',
      },

      {
        field: 'region',
        label: 'Region',
      },

      {
        field: 'street',
        label: 'Street',
      },
    ],
  };
};
