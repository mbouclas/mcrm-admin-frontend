import {ProductModel} from "../../../Catalogue/models/product.model";
import type {ProductVariantModel} from "../../../Catalogue/models/product-variant.model";
import type {ICartItem, ICartMetaData} from "./order.model";

export class CartItem implements ICartItem {
    productId: string;
    variantId: string;
    quantity: number;
    sku: string;
    slug: string;
    price: number;
    metaData: Partial<ICartMetaData> = {};
    title: string;
    thumb: string;
    uuid: string;

    constructor(config?: Partial<CartItem>) {
        if (config) {
            for (const key in config) {
                if (config.hasOwnProperty(key)) {
                    this[key] = config[key];
                }
            }
        }
    }

    static productToCartItem(item: ProductModel) {
        return new CartItem({
            productId: item.uuid,
            quantity: 1,
            sku: item.sku,
            slug: item.slug,
            price: item.price,
            title: item.title,
            thumb: typeof item.thumb === 'string' ? item.thumb : item.thumb.url,
        });
    }

    static productVariantToCartItem(item: ProductModel,variant: ProductVariantModel) {
        const color = ProductModel.getProductColors(item).find(c => c.code === variant.color);
        return new CartItem({
            productId: item.uuid,
            variantId: variant.uuid,
            quantity: 1,
            sku: item.sku,
            slug: item.slug,
            price: variant.price,
            title: item.title,
            metaData: {
                color,
                uploadedFiles: []
            }
        });
    }

}
