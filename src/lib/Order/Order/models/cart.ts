import type {CartItem} from "./cart-item";
import type {ICartItem, ICartMetaData, ICouponApplied} from "./order.model";
import {OrderService} from "../../services/order/order.service";
import type {IShippingMethod} from "../../../Setting/services/shipping.service";

export interface ICartConfigOptions {
    userId: string;
}

export class Cart {
    id?: string;
    total: number;
    numberOfItems: number;
    subTotal: number;
    vatRate?: number;
    metaData: Partial<ICartMetaData>;
    appliedConditions?: any[] | null;
    couponApplied?: ICouponApplied;
    items: CartItem[] = [];
    userId: string;


    constructor(config: ICartConfigOptions) {
        for (const key in config) {
            if (config.hasOwnProperty(key)) {
                this[key] = config[key];
            }
        }
    }

    async add(item: CartItem) {
        this.items.push(item);
        const res = await new OrderService().virtualCart(this, this.userId);
        this.update(res)
    }

    async updateShippingMethod(shippingMethod: IShippingMethod) {
        const res = await new OrderService().virtualCart(this, this.userId, shippingMethod);
        this.update(res)
    }

    private update(res: any) {
        for (const key in res) {
            if (res.hasOwnProperty(key)) {
                this[key] = res[key];
            }
        }
    }
}
