import type {ZodError} from "zod";

export default {
  '400.20': 'User exists',
  '400.21': 'Invalid email format',
  '400.22': 'First name is required',
  '400.23': 'Last name is required',
  '400.24': 'Password is required',
  '400.25': 'User with email already exists',
  '400.55': 'Role level must be between 1 and 99',
  '400.56': 'Name is required',
  '400.57': 'Description is required',

  'GATE.001': 'User exists',
  'GATE.002': 'User exists',
  'GATE.003': 'User exists',
  'GATE.004': 'User exists',
  'GATE.005': 'Name is required',
  'GATE.006': 'Level is required',
  'GATE.007': 'Provider is required',
  'GATE.008': 'Gate is required',
  'GATE.009': 'Minimum level value is 1',
  'GATE.010': 'Maximum level value is 99',

  'PRODUCT.001': 'Product not found',
  'PRODUCT.002': 'Product failed to create',
  'PRODUCT.003': 'Product failed to update',
  'PRODUCT.004': 'Product failed to delete',
  'PRODUCT.005': 'Product failed to relate',
  'PRODUCT.006': 'Failed to generate variatns',
  'PRODUCT.007': 'Failed to check duplicate variants',
  'PRODUCT.008': 'Failed to update product categories',
  'PRODUCT.009': 'Failed to attach',
  'PRODUCT.010': 'Title required',
  'PRODUCT.011': 'Sku required',
  'PRODUCT.012': 'Price required',
  'PRODUCT.013': 'Description required',

  'PRODUCT_CATEGORY.001': 'Product category not found',
  'PRODUCT_CATEGORY.002': 'Product category failed to create',
  'PRODUCT_CATEGORY.003': 'Product category failed to update',
  'PRODUCT_CATEGORY.004': 'Product category failed to delete',
  'PRODUCT_CATEGORY.005': 'Product category failed to move',

  'ROLE.001': 'Role not found',
  'ROLE.002': 'Role failed to create',
  'ROLE.003': 'Role failed to update',
  'ROLE.004': 'Role failed to delete',
  'ROLE.005': 'Name required',
  'ROLE.006': 'Level required',
  'ROLE.007': 'Description required',
  'ROLE.008': 'Role required',
  'ROLE.009': 'Minimum level value is 1',
  'ROLE.010': 'Maximum level value is 99',

  'PAGE.001': 'Page not found',
  'PAGE.002': 'Page failed to create',
  'PAGE.003': 'Page failed to update',
  'PAGE.004': 'Page failed to delete',
  'PAGE.005': 'Page failed to relate',

  'PAGE_CATEGORY.001': 'Page category not found',
  'PAGE_CATEGORY.002': 'Page category failed to create',
  'PAGE_CATEGORY.003': 'Page category failed to update',
  'PAGE_CATEGORY.004': 'Page category failed to delete',
  'PAGE_CATEGORY.005': 'Page category failed to move',

  'CONDITION.001': 'Title required',
  'CONDITION.002': 'Value required',
  'CONDITION.003': 'Dropdown value required',
  'CONDITION.004': 'Field value required',
  'CONDITION.005': 'Operator value required',
  'CONDITION.006': 'Name value required',
  'CONDITION.007': 'At least one rule required',
};


export function formatZodErrors(e: ZodError) {
  const errors = {};
  e.errors.forEach((error) => {
    errors[error.path[0]] = error;
  });

  return errors;
}
