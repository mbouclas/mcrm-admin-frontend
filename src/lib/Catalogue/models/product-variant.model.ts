import type {ImageModel} from "../../Shared/models/image.model";

export class ProductVariantModel {
    name: string;
    color?: string;
    price: number;
    sku: string;
    slug: string;
    thumb: string|ImageModel;
    uuid: string;
    variantId: string;
    productId: string;
    createdAt: Date = new Date();
    updatedAt: Date = new Date();

    constructor(config?: Partial<ProductVariantModel>) {
        for (const key in config) {
            if (config.hasOwnProperty(key)) {
                this[key] = config[key];
            }
        }
    }
}
