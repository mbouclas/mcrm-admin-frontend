import type {ProductVariantModel} from "./product-variant.model";
import type {ProductCategoryModel} from "./product-category.model";
import type {ITagModel} from "../../Shared/models/tag.model";
import type {ISalesChannel} from "../../SalesChannels/services/sales-channels.service";
import type {ImageModel} from "../../Shared/models/image.model";
import type {IColor} from "../../Order/Order/models/order.model";
import type {ManufacturerModel} from "./manufacturer.model";
import type {IGenericObject} from "../../Shared/models/generic";

export interface IPropertyValue {
    name: string;
    slug: string;
    code?: string;
    value?: string;
    color?: string;
}

export interface IProperty {
    uuid: string;
    title: string;
    type: 'color'|'text';
    description: string;
    values: IPropertyValue[];
}

export class ProductModel {
    sku: string;
    uuid: string;
    title: string;
    description: string;
    description_long: string;
    price: number;
    salePrice: number;
    cost: number;
    active = false;
    slug: string;
    productCategory: ProductCategoryModel[] = [];
    variants: ProductVariantModel[] = [];
    thumb: Partial<ImageModel>|string;
    images: Partial<ImageModel>[] = [];
    tags: ITagModel[] = [];
    tag: ITagModel[] = [];
    salesChannels: ISalesChannel[] = [];
    salesChannel: ISalesChannel[] = [];
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
    propertyValue: any[] = [];
    property: IProperty[] = [];
    stock: number = 0;
    lowStock: number;
    manufacturer: ManufacturerModel;
    seo: IGenericObject = {};

    constructor(config?: Partial<ProductModel>) {
        for (const key in config) {
            if (config.hasOwnProperty(key)) {
                this[key] = config[key];
            }
        }
    }

    static getProductColors(product: ProductModel) {
        const colors: Partial<IColor>[] = [];

        if (!Array.isArray(product.property)) {return colors;}
        const colorProperty = product.property.find(property => property.type === 'color');

        if (!colorProperty) {return colors;}


        if (!Array.isArray(colorProperty.values)) {return colors;}

        colorProperty.values.forEach(value => {
            if (!value.color) {return}

            colors.push({
                color: value.color,
                code: value.code,
                name: value.name,
                slug: value.slug,
            });
        });

        return colors;
    }

    static getProductVariantProperties(product: ProductModel) {
        const properties: IProperty[] = [];

        if (!Array.isArray(product.property)) {return properties;}

        product.property.forEach(property => {

            properties.push(property);
        });

        return properties;
    }
}
