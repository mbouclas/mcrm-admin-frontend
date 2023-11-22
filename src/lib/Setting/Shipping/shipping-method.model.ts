import type {IGenericObject} from "../../Shared/models/generic";

export class ShippingMethodModel {
    public uuid: string;
    public code: string;
    public shippingTime: string;
    public providerName: string;
    public title: string;
    public slug: string;
    public status = false;
    public baseCost = 0;
    public settings?: IGenericObject = {};
    public weightMin?: number;
    public weightLimit?: number;
    public destination?: string;
    public description?: string;

}
