export class ProductCategoryModel {
    title: string;
    description: string;
    active = false;
    parent: ProductCategoryModel;
    children: ProductCategoryModel[] = [];

    constructor(config?: Partial<ProductCategoryModel>) {
        for (const key in config) {
            if (config.hasOwnProperty(key)) {
                this[key] = config[key];
            }
        }
    }
}
