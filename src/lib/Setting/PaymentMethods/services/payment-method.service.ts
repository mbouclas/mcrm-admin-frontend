import {BaseHttpService} from "../../../Shared/base-http.service";
import type {IGenericObject, IMcrmDi} from "../../../Shared/models/generic";
import queryString from "query-string";
import type {IShippingMethod} from "../../services/shipping.service";
import type {IZodSchema} from "../../../helpers/data";

export interface IPaymentMethodProvider extends IMcrmDi {
    shortName: string;
    settingsSchema: IZodSchema;
}

export interface IPaymentMethod {
    surcharge: number;
    title: string;
    active: boolean;
    uuid: string;
    slug: string;
    status: boolean;
    providerName: string;
    provider: IPaymentMethodProvider;
    description: string;
    paymentInformation?: IGenericObject;
    selectedShippingMethod?: IShippingMethod|null;
    shippingMethod: IShippingMethod[];
    providerSettings: IGenericObject;
}

export class PaymentMethodService extends BaseHttpService {
    async find(filters: IGenericObject = {}, relationships: string[] = []) {
        let qs;
        if (Object.keys(filters).length > 0) {
            qs = queryString.stringify(filters);
        }

        if (relationships.length > 0) {
            qs = qs
                ? `${qs}&${relationships.map((r) => `with[]=${r}`).join('&')}`
                : relationships.map((r) => `with[]=${r}`).join('&');
        }

        return await this.get(`payment-method${qs ? `?${qs}` : ''}`);
    }

    async findOne(uuid: string, relationships: string[] = []) {
        const filters = relationships.length > 0 ? { with: relationships } : {};
        return await this.get(`payment-method/${uuid}`, filters);
    }

    async update(uuid: string, channel: Partial<IPaymentMethod>) {
        return await super.patch(`payment-method/${uuid}`, channel, {
            successMessage: 'Payment Method Updated',
            errorMessage: 'Error updating Payment Method',
        });
    }

    async store(channel: Partial<IPaymentMethod>) {
        return await super.post(`payment-method`, channel, {
            successMessage: 'Sales Channel Created',
        });
    }

    async getProviders(): Promise<IPaymentMethodProvider[]> {
        return await this.get(`payment-method/providers`);
    }
}
