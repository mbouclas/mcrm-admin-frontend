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
