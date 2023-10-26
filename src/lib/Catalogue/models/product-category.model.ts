export class ProductCategoryModel {
    title: string;
    description: string;
    active = false;
    parent: ProductCategoryModel;
    children: ProductCategoryModel[] = [];
}
