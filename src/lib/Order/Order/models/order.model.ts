import type {IPaymentMethod} from "../../../Setting/PaymentMethods/services/payment-method.service";
import type {ISalesChannel} from "../../../SalesChannels/services/sales-channels.service";
import type {IShippingMethod} from "../../../Setting/services/shipping.service";
import type {ProductModel} from "../../../Catalogue/models/product.model";
import type {Cart} from "./cart";


export interface IOrderStatus {
    id: number;
    label: string;
    color?: string;
}

export interface ICart {
    id?: string;
    items?: (ICartItem)[] | null;
    total: number;
    numberOfItems: number;
    subTotal: number;
    vatRate?: number;
    metaData: Partial<ICartMetaData>;
    appliedConditions?: any[] | null;
    couponApplied?: ICouponApplied;
}

export interface IColor {
    color: string;
    image?: null;
    code: string;
    name: string;
    slug: string;
    variant: IProductVariant;
}

export interface IProductVariant {
    uuid: string;
    variantId: string;
    image: string;
    color: string;
}

export interface ICartMetaData {
    color?: Partial<IColor>;
    uploadedFiles?: Partial<IUploadedFiles>[] | null;
}

export interface IUploadedFiles {
    description: string;
    filename: string;
    originalName: string;
    id: string;
}

export interface ICouponApplied {

}

export interface ICartItem {
    productId: string;
    variantId: string;
    quantity: number;
    sku: string;
    slug: string;
    price: number;
    metaData: Partial<ICartMetaData>;
    title: string;
    thumb: string;
    uuid: string;
}

export interface IOrderMetaData {
    billingInformation: any;
    shippingInformation: any;
    cart: Cart;
}

export interface ICustomerAddress {
    zipcode: string;
    country: string;
    firstName: string;
    lastName: string;
    city: string;
    phone: string;
    street: string;
    region: string;
    default: boolean;
    uuid?: string;
    type?: 'BILLING' | 'SHIPPING';
}

export interface ICoupon {

}

export interface ICondition {

}


export class CartModel implements ICart {
    id?: string;
    items?: ICartItem[];
    total: number;
    numberOfItems: number;
    subTotal: number;
    vatRate?: number;
    metaData: Partial<ICartMetaData>;
    appliedConditions?: any[];
    couponApplied?: ICouponApplied;
}

export class OrderModel {
    public orderId: string;
    public paymentMethod: IPaymentMethod;
    paymentStatus = 0;
    salesChannel: string;
    shippingMethod: IShippingMethod;
    status = 1;
    total = 0;
    userId: string;
    uuid: string;
    metaData: Partial<IOrderMetaData> = {

    };
    selectedProducts: ProductModel[] = [];

    constructor(config?: Partial<OrderModel>) {
        if (config) {
            for (const key in config) {
                if (config.hasOwnProperty(key)) {
                    this[key] = config[key];
                }
            }
        }
    }
}


